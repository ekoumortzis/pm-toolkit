import express from 'express'
import { query } from '../config/database.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all prompts with optional filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, difficulty, search, ai_tool } = req.query

    let sql = `
      SELECT p.*,
             json_build_object(
               'id', pc.id,
               'name', pc.name,
               'description', pc.description,
               'icon', pc.icon,
               'order', pc.order
             ) as category
      FROM prompts p
      LEFT JOIN prompt_categories pc ON p.category_id = pc.id
      WHERE 1=1
    `
    const params = []
    let paramCount = 1

    if (category) {
      sql += ` AND p.category_id = $${paramCount}`
      params.push(category)
      paramCount++
    }

    if (difficulty) {
      sql += ` AND p.difficulty = $${paramCount}`
      params.push(difficulty)
      paramCount++
    }

    if (ai_tool) {
      sql += ` AND (p.ai_tool = $${paramCount} OR p.ai_tool = 'any')`
      params.push(ai_tool)
      paramCount++
    }

    if (search) {
      sql += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      params.push(`%${search}%`)
      paramCount++
    }

    sql += ' ORDER BY p.created_at DESC'

    const result = await query(sql, params)
    res.json({ prompts: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single prompt
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT p.*,
             json_build_object(
               'id', pc.id,
               'name', pc.name,
               'description', pc.description,
               'icon', pc.icon,
               'order', pc.order
             ) as category
      FROM prompts p
      LEFT JOIN prompt_categories pc ON p.category_id = pc.id
      WHERE p.id = $1
    `
    const result = await query(sql, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' })
    }

    res.json({ prompt: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all categories
router.get('/categories/all', authenticateToken, async (req, res) => {
  try {
    const sql = 'SELECT * FROM prompt_categories ORDER BY "order"'
    const result = await query(sql)
    res.json({ categories: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create prompt (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { category_id, title, description, prompt_text, ai_tool, difficulty, tags } = req.body

    const sql = `
      INSERT INTO prompts (category_id, title, description, prompt_text, ai_tool, difficulty, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    const result = await query(sql, [category_id, title, description, prompt_text, ai_tool, difficulty, tags])

    res.status(201).json({ prompt: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update prompt (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { category_id, title, description, prompt_text, ai_tool, difficulty, tags } = req.body

    const sql = `
      UPDATE prompts
      SET category_id = $1, title = $2, description = $3, prompt_text = $4,
          ai_tool = $5, difficulty = $6, tags = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `
    const result = await query(sql, [category_id, title, description, prompt_text, ai_tool, difficulty, tags, req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' })
    }

    res.json({ prompt: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete prompt (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sql = 'DELETE FROM prompts WHERE id = $1 RETURNING id'
    const result = await query(sql, [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' })
    }

    res.json({ message: 'Prompt deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
