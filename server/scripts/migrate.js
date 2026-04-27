import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('🔌 Connecting to Neon database...')
    await client.connect()
    console.log('✅ Connected!')

    // Read the schema file
    const schemaPath = path.join(__dirname, '../../database/neon-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📝 Running migration...')
    await client.query(schema)

    console.log('✅ Migration completed successfully!')
    console.log('🎉 Database is ready to use!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
