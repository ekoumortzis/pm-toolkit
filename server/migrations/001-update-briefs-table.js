import { query } from '../config/database.js'

export async function up() {
  try {
    console.log('🔄 Running migration: Update briefs table schema...')

    // Drop old table if it exists with wrong schema
    await query('DROP TABLE IF EXISTS briefs CASCADE')

    // Create new table with correct schema
    await query(`
      CREATE TABLE IF NOT EXISTS briefs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        project_name TEXT NOT NULL,
        what_building TEXT,
        why_building TEXT,
        who_using TEXT,
        success_goals TEXT,
        site_map JSONB DEFAULT '{"pages": []}'::jsonb,
        user_journeys JSONB DEFAULT '[]'::jsonb,
        page_content JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await query('CREATE INDEX IF NOT EXISTS idx_briefs_user_id ON briefs(user_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC)')

    console.log('✅ Migration completed: Briefs table updated')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    throw error
  }
}

export async function down() {
  try {
    await query('DROP TABLE IF EXISTS briefs CASCADE')
    console.log('✅ Migration rolled back: Briefs table dropped')
  } catch (error) {
    console.error('❌ Rollback failed:', error.message)
    throw error
  }
}
