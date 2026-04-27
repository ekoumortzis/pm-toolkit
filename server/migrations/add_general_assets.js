import { query } from '../config/database.js'

async function addGeneralAssetsColumn() {
  try {
    console.log('🔄 Adding general_assets column to briefs table...')

    // Check if column already exists
    const checkColumnSql = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='briefs' AND column_name='general_assets'
    `
    const checkResult = await query(checkColumnSql)

    if (checkResult.rows.length > 0) {
      console.log('✅ Column general_assets already exists')
      return
    }

    // Add the column
    const addColumnSql = `
      ALTER TABLE briefs
      ADD COLUMN general_assets JSONB DEFAULT '{"images": [], "files": []}'::jsonb
    `
    await query(addColumnSql)

    console.log('✅ Successfully added general_assets column')
  } catch (error) {
    console.error('❌ Error adding general_assets column:', error)
    throw error
  }
}

// Run the migration
addGeneralAssetsColumn()
  .then(() => {
    console.log('✅ Migration completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
