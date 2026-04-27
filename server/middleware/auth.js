import { createClerkClient, verifyToken } from '@clerk/backend'
import { query } from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config()

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log('🔐 Auth attempt - Token present:', !!token)

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    // Verify the Clerk session token
    try {
      console.log('🔍 Verifying token with Clerk...')

      // Use the standalone verifyToken function
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      })

      const userId = payload.sub

      // Check if user already exists in DB first (fast path - no Clerk API call needed)
      const checkUserSql = 'SELECT * FROM users WHERE id = $1'
      let existingUser = await query(checkUserSql, [userId])

      let dbUser = existingUser.rows[0]

      if (!dbUser) {
        // New user — fetch from Clerk to get name/email/metadata
        console.log('👤 New user, fetching from Clerk...')
        const user = await clerkClient.users.getUser(userId)
        const userEmail = user.emailAddresses[0]?.emailAddress

        let defaultRole = null
        if (userEmail === 'ekoumortzis@agroapps.gr' || userEmail === 'ekoumortzis@yahoo.gr') {
          defaultRole = 'admin'
        } else if (user.unsafeMetadata?.role) {
          defaultRole = user.unsafeMetadata.role
        }

        const createUserSql = `
          INSERT INTO users (id, email, first_name, last_name, role)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `
        try {
          const result = await query(createUserSql, [
            userId, userEmail, user.firstName, user.lastName, defaultRole
          ])
          existingUser = result
          console.log('✅ User created with role:', defaultRole)

          await query(`
            INSERT INTO user_activity_log (user_id, action, details)
            VALUES ($1, 'signup', $2)
          `, [userId, JSON.stringify({ email: userEmail, role: defaultRole })])

        } catch (dbError) {
          if (dbError.message.includes('users_email_key')) {
            await query('DELETE FROM users WHERE email = $1', [userEmail])
            const result = await query(createUserSql, [
              userId, userEmail, user.firstName, user.lastName, defaultRole
            ])
            existingUser = result
          } else {
            throw dbError
          }
        }
        dbUser = existingUser.rows[0]
      }

      // Fix role if null for existing users
      if (!dbUser.role) {
        let correctedRole = null
        if (dbUser.email === 'ekoumortzis@agroapps.gr' || dbUser.email === 'ekoumortzis@yahoo.gr') {
          correctedRole = 'admin'
        }
        if (!correctedRole) {
          // Need Clerk metadata to determine role
          const clerkUser = await clerkClient.users.getUser(userId)
          if (clerkUser.unsafeMetadata?.role) {
            correctedRole = clerkUser.unsafeMetadata.role
          }
        }
        if (correctedRole) {
          await query('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [correctedRole, userId])
          dbUser = { ...dbUser, role: correctedRole }
          console.log('🔧 Fixed null role for user:', userId, '→', correctedRole)
        }
      }

      // Check if user is active
      if (dbUser.is_active === false) {
        return res.status(403).json({
          error: 'Account paused',
          message: 'Your account has been paused. Please contact an administrator.'
        })
      }

      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        role: dbUser.role,
        isActive: dbUser.is_active
      }

      console.log('✅ Auth complete for user:', userId)
      next()
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.message)
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
  } catch (error) {
    console.error('❌ Auth error:', error.message)
    return res.status(403).json({ error: 'Invalid token' })
  }
}

export const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      })
    }

    next()
  }
}

export const requirePM = requireRole(['admin', 'pm'])
export const requireViewer = requireRole(['admin', 'pm', 'viewer'])
