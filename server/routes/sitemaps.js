import express from 'express'
import { query } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user's site-maps
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT id, title, sitemap_data, updated_at
      FROM briefs
      WHERE user_id = $1 AND sitemap_data IS NOT NULL
      ORDER BY updated_at DESC
    `
    const result = await query(sql, [req.user.id])
    res.json({ sitemaps: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Save site-map
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { brief_id, sitemap_data } = req.body

    if (brief_id) {
      // Update existing brief
      const sql = `
        UPDATE briefs
        SET sitemap_data = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *
      `
      const result = await query(sql, [JSON.stringify(sitemap_data), brief_id, req.user.id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Brief not found' })
      }

      res.json({ sitemap: result.rows[0] })
    } else {
      // Create new brief with site-map
      const sql = `
        INSERT INTO briefs (user_id, title, sitemap_data, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `
      const result = await query(sql, [
        req.user.id,
        'Untitled Site-Map',
        JSON.stringify(sitemap_data),
        'draft'
      ])

      res.status(201).json({ sitemap: result.rows[0] })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
