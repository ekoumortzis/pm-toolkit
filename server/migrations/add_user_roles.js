import { query } from '../config/database.js'

async function addUserRoles() {
  try {
    console.log('🔄 Starting user roles migration...')

    // 1. Add role column to users table
    console.log('📝 Adding role column to users table...')
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'pm'
    `)
    console.log('✅ Role column added')

    // 1b. Add is_active column
    console.log('📝 Adding is_active column to users table...')
    await query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
    `)
    console.log('✅ is_active column added')

    // 2. Create user_activity_log table
    console.log('📝 Creating user_activity_log table...')
    await query(`
      CREATE TABLE IF NOT EXISTS user_activity_log (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        action VARCHAR(100),
        performed_by VARCHAR(255),
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Activity log table created')

    // 3. Create role_change_requests table
    console.log('📝 Creating role_change_requests table...')
    await query(`
      CREATE TABLE IF NOT EXISTS role_change_requests (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        from_role VARCHAR(20),
        requested_role VARCHAR(20),
        reason TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        reviewed_by VARCHAR(255),
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Role change requests table created')

    // 4. Set admin role for ekoumortzis@agroapps.gr
    console.log('📝 Setting admin role for ekoumortzis@agroapps.gr...')
    const result = await query(`
      UPDATE users
      SET role = 'admin'
      WHERE email = 'ekoumortzis@agroapps.gr'
      RETURNING email, role
    `)

    if (result.rows.length > 0) {
      console.log('✅ Admin role set for:', result.rows[0].email)
    } else {
      console.log('⚠️  User ekoumortzis@agroapps.gr not found - will be set on first login')
    }

    // 5. Log this migration
    await query(`
      INSERT INTO user_activity_log (user_id, action, performed_by, details)
      VALUES ('system', 'migration_completed', 'system', $1)
    `, [JSON.stringify({ migration: 'add_user_roles', timestamp: new Date() })])

    console.log('✅ Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run the migration
addUserRoles()
  .then(() => {
    console.log('🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
