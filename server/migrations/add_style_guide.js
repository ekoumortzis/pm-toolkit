import { query } from '../config/database.js'

async function addStyleGuideColumn() {
  try {
    console.log('🔄 Adding style_guide column to briefs table...')

    const checkColumnSql = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='briefs' AND column_name='style_guide'
    `
    const checkResult = await query(checkColumnSql)

    if (checkResult.rows.length > 0) {
      console.log('✅ Column style_guide already exists')
      return
    }

    const addColumnSql = `
      ALTER TABLE briefs
      ADD COLUMN style_guide JSONB DEFAULT '{}'::jsonb
    `
    await query(addColumnSql)

    console.log('✅ Successfully added style_guide column')
  } catch (error) {
    console.error('❌ Error adding style_guide column:', error)
    throw error
  }
}

addStyleGuideColumn()
  .then(() => {
    console.log('✅ Migration completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
