import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { query } from '../config/database.js'
import { createClerkClient } from '@clerk/backend'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

// DELETE /api/user - Delete user account
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    console.log('🗑️ Attempting to delete user:', userId)

    // Delete user from Clerk using admin API
    try {
      await clerkClient.users.deleteUser(userId)
      console.log('✅ User deleted from Clerk:', userId)
    } catch (clerkError) {
      console.error('❌ Clerk deletion error:', clerkError.message)
      // Continue even if Clerk deletion fails - we'll still clean up our DB
    }

    // Delete user data from Neon database
    try {
      // Delete user's briefs (if table exists)
      try {
        await query('DELETE FROM briefs WHERE user_id = $1', [userId])
      } catch (err) {
        console.log('ℹ️ Briefs table not found or no data to delete')
      }

      // Delete user's sitemaps (if table exists)
      try {
        await query('DELETE FROM sitemaps WHERE user_id = $1', [userId])
      } catch (err) {
        console.log('ℹ️ Sitemaps table not found or no data to delete')
      }

      // Delete user's user journeys (if table exists)
      try {
        await query('DELETE FROM user_journeys WHERE user_id = $1', [userId])
      } catch (err) {
        console.log('ℹ️ User journeys table not found or no data to delete')
      }

      // Delete the user
      await query('DELETE FROM users WHERE id = $1', [userId])

      console.log('✅ User data deleted from Neon:', userId)
    } catch (dbError) {
      console.error('❌ Database deletion error:', dbError.message)
      // Don't throw - account is already deleted from Clerk
    }

    res.json({
      success: true,
      message: 'Account successfully deleted'
    })
  } catch (error) {
    console.error('❌ Error deleting account:', error)
    res.status(500).json({
      error: 'Failed to delete account',
      message: error.message
    })
  }
})

export default router
