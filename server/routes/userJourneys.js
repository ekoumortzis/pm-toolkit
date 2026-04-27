import express from 'express'
import { query } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user's journeys
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT id, title, user_journey_data, updated_at
      FROM briefs
      WHERE user_id = $1 AND user_journey_data IS NOT NULL
      ORDER BY updated_at DESC
    `
    const result = await query(sql, [req.user.id])
    res.json({ journeys: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Save user journey
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { brief_id, user_journey_data } = req.body

    if (brief_id) {
      // Update existing brief
      const sql = `
        UPDATE briefs
        SET user_journey_data = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *
      `
      const result = await query(sql, [JSON.stringify(user_journey_data), brief_id, req.user.id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Brief not found' })
      }

      res.json({ journey: result.rows[0] })
    } else {
      // Create new brief with user journey
      const sql = `
        INSERT INTO briefs (user_id, title, user_journey_data, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `
      const result = await query(sql, [
        req.user.id,
        'Untitled User Journey',
        JSON.stringify(user_journey_data),
        'draft'
      ])

      res.status(201).json({ journey: result.rows[0] })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
