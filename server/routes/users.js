import express from 'express'
import { query } from '../config/database.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { createClerkClient } from '@clerk/backend'
import dotenv from 'dotenv'

dotenv.config()

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

const router = express.Router()

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `
    const result = await query(sql)
    res.json({ users: result.rows })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get recent signups (last 7 days) for notifications
router.get('/recent', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT id, email, first_name, last_name, role, created_at
      FROM users
      WHERE created_at > NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
    `
    const result = await query(sql)
    res.json({ users: result.rows })
  } catch (error) {
    console.error('Error fetching recent users:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const sql = 'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1'
    const result = await query(sql, [req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Set user role (for first-time OAuth users)
router.post('/set-role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body

    // Validate role
    if (!['pm', 'viewer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "pm", "viewer", or "admin"' })
    }

    // Check if user exists
    const checkSql = 'SELECT role, email FROM users WHERE id = $1'
    const checkResult = await query(checkSql, [req.user.id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Allow role update if current role is null OR if setting admin for agroapps.gr email
    const currentRole = checkResult.rows[0].role
    const userEmail = checkResult.rows[0].email

    if (currentRole !== null && !(role === 'admin' && userEmail === 'ekoumortzis@agroapps.gr')) {
      return res.status(400).json({ error: 'Role already set. Contact admin to change role.' })
    }

    // Set the role
    const sql = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role
    `
    const result = await query(sql, [role, req.user.id])

    console.log(`✅ Role set for user: ${req.user.id} → ${role}`)
    res.json({ success: true, user: result.rows[0] })
  } catch (error) {
    console.error('Error setting role:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update user role (Admin only)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body
    const userId = req.params.id

    if (!['admin', 'pm', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Get old role for logging
    const oldUserResult = await query('SELECT role FROM users WHERE id = $1', [userId])
    const oldRole = oldUserResult.rows[0]?.role

    // Update role
    const sql = `
      UPDATE users
      SET role = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role
    `
    const result = await query(sql, [role, userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Log activity
    await query(`
      INSERT INTO user_activity_log (user_id, action, performed_by, details)
      VALUES ($1, 'role_changed', $2, $3)
    `, [
      userId,
      req.user.id,
      JSON.stringify({ from: oldRole, to: role })
    ])

    console.log(`✅ Role updated: ${userId} from ${oldRole} to ${role}`)
    res.json({ success: true, user: result.rows[0] })
  } catch (error) {
    console.error('Error updating role:', error)
    res.status(500).json({ error: error.message })
  }
})

// Request role change (Viewer → PM)
router.post('/request-role-change', authenticateToken, async (req, res) => {
  try {
    const { requestedRole, reason } = req.body

    // Only allow viewer → pm requests for now
    if (req.user.role !== 'viewer' || requestedRole !== 'pm') {
      return res.status(400).json({ error: 'Invalid role change request' })
    }

    // Check if there's already a pending request
    const checkSql = `
      SELECT * FROM role_change_requests
      WHERE user_id = $1 AND status = 'pending'
    `
    const existing = await query(checkSql, [req.user.id])

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You already have a pending request' })
    }

    // Create request
    const sql = `
      INSERT INTO role_change_requests (user_id, from_role, requested_role, reason)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await query(sql, [req.user.id, req.user.role, requestedRole, reason])

    console.log(`📋 Role change request: ${req.user.email} → ${requestedRole}`)
    res.status(201).json({ success: true, request: result.rows[0] })
  } catch (error) {
    console.error('Error creating role change request:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get pending role change requests (Admin only)
router.get('/role-requests/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT
        r.*,
        u.email,
        u.first_name,
        u.last_name
      FROM role_change_requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at DESC
    `
    const result = await query(sql)
    res.json({ requests: result.rows })
  } catch (error) {
    console.error('Error fetching role requests:', error)
    res.status(500).json({ error: error.message })
  }
})

// Approve/reject role change request (Admin only)
router.put('/role-requests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body // 'approved' or 'rejected'
    const requestId = req.params.id

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    // Get request details
    const requestResult = await query(
      'SELECT * FROM role_change_requests WHERE id = $1',
      [requestId]
    )

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' })
    }

    const request = requestResult.rows[0]

    // Update request status
    await query(`
      UPDATE role_change_requests
      SET status = $1, reviewed_by = $2, reviewed_at = NOW()
      WHERE id = $3
    `, [status, req.user.id, requestId])

    // If approved, update user role
    if (status === 'approved') {
      await query(`
        UPDATE users
        SET role = $1, updated_at = NOW()
        WHERE id = $2
      `, [request.requested_role, request.user_id])

      // Log activity
      await query(`
        INSERT INTO user_activity_log (user_id, action, performed_by, details)
        VALUES ($1, 'role_changed', $2, $3)
      `, [
        request.user_id,
        req.user.id,
        JSON.stringify({
          from: request.from_role,
          to: request.requested_role,
          via: 'request_approval'
        })
      ])

      console.log(`✅ Role request approved: ${request.user_id} → ${request.requested_role}`)
    } else {
      console.log(`❌ Role request rejected: ${request.user_id}`)
    }

    res.json({ success: true, status })
  } catch (error) {
    console.error('Error processing role request:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get activity log (Admin only)
router.get('/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50

    const sql = `
      SELECT
        a.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name
      FROM user_activity_log a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT $1
    `
    const result = await query(sql, [limit])
    res.json({ activities: result.rows })
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({ error: error.message })
  }
})

// Pause/Unpause user (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body
    const userId = req.params.id

    // Prevent admin from pausing themselves
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'You cannot pause your own account' })
    }

    // Update database
    const sql = `
      UPDATE users
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role, is_active
    `
    const result = await query(sql, [isActive, userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Sync with Clerk - ban/unban user
    try {
      if (isActive) {
        // Unban user in Clerk
        await clerkClient.users.unbanUser(userId)
      } else {
        // Ban user in Clerk
        await clerkClient.users.banUser(userId)
      }
      console.log(`✅ User ${isActive ? 'unbanned' : 'banned'} in Clerk: ${userId}`)
    } catch (clerkError) {
      console.error('⚠️ Clerk sync warning:', clerkError.message)
      // Continue even if Clerk sync fails
    }

    // Log activity
    await query(`
      INSERT INTO user_activity_log (user_id, action, performed_by, details)
      VALUES ($1, $2, $3, $4)
    `, [
      userId,
      isActive ? 'user_activated' : 'user_paused',
      req.user.id,
      JSON.stringify({ is_active: isActive })
    ])

    console.log(`✅ User ${isActive ? 'activated' : 'paused'}: ${userId}`)
    res.json({ success: true, user: result.rows[0] })
  } catch (error) {
    console.error('Error updating user status:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' })
    }

    // Get user details for logging
    const userResult = await query('SELECT email FROM users WHERE id = $1', [userId])

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userEmail = userResult.rows[0].email

    // Log activity before deletion
    await query(`
      INSERT INTO user_activity_log (user_id, action, performed_by, details)
      VALUES ($1, 'user_deleted', $2, $3)
    `, [
      userId,
      req.user.id,
      JSON.stringify({ email: userEmail })
    ])

    // Delete from database (cascade will handle related records)
    await query('DELETE FROM users WHERE id = $1', [userId])

    // Delete from Clerk
    try {
      await clerkClient.users.deleteUser(userId)
      console.log(`✅ User deleted from Clerk: ${userId}`)
    } catch (clerkError) {
      console.error('⚠️ Clerk deletion warning:', clerkError.message)
      // Continue even if Clerk deletion fails (user already deleted from DB)
    }

    console.log(`🗑️ User deleted: ${userEmail}`)
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
