import express from 'express'
import { query } from '../config/database.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all guidelines
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { section } = req.query

    let sql = 'SELECT * FROM guidelines WHERE 1=1'
    const params = []

    if (section) {
      sql += ' AND section = $1'
      params.push(section)
    }

    sql += ' ORDER BY "order"'

    const result = await query(sql, params)
    res.json({ guidelines: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single guideline
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = 'SELECT * FROM guidelines WHERE id = $1'
    const result = await query(sql, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guideline not found' })
    }

    res.json({ guideline: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create guideline (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { section, title, content, examples, order } = req.body

    const sql = `
      INSERT INTO guidelines (section, title, content, examples, "order")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const result = await query(sql, [
      section,
      title,
      content,
      JSON.stringify(examples || []),
      order || 0
    ])

    res.status(201).json({ guideline: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update guideline (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { section, title, content, examples, order } = req.body

    const sql = `
      UPDATE guidelines
      SET section = $1, title = $2, content = $3, examples = $4, "order" = $5
      WHERE id = $6
      RETURNING *
    `
    const result = await query(sql, [
      section,
      title,
      content,
      JSON.stringify(examples),
      order,
      req.params.id
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guideline not found' })
    }

    res.json({ guideline: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete guideline (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sql = 'DELETE FROM guidelines WHERE id = $1 RETURNING id'
    const result = await query(sql, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guideline not found' })
    }

    res.json({ message: 'Guideline deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
