import express from 'express'
import { query } from '../config/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get briefs (admins and viewers see all, PMs see only their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let sql;
    let params;

    // Only fetch columns needed for the list view (exclude heavy JSON blobs)
    const selectCols = `
      b.id, b.user_id, b.project_name, b.what_building, b.why_building,
      b.who_using, b.success_goals, b.created_at, b.updated_at,
      u.first_name || ' ' || u.last_name as creator_name,
      u.role as creator_role
    `

    if (req.user.role === 'admin' || req.user.role === 'viewer') {
      sql = `
        SELECT ${selectCols}
        FROM briefs b
        LEFT JOIN users u ON b.user_id = u.id
        ORDER BY b.updated_at DESC
      `
      params = []
    } else {
      sql = `
        SELECT ${selectCols}
        FROM briefs b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.user_id = $1
        ORDER BY b.updated_at DESC
      `
      params = [req.user.id]
    }

    const result = await query(sql, params)
    res.json({ briefs: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single brief
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT b.*,
             u.first_name || ' ' || u.last_name as creator_name,
             u.role as creator_role
      FROM briefs b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = $1 AND b.user_id = $2
    `
    const result = await query(sql, [req.params.id, req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brief not found' })
    }

    res.json({ brief: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new brief
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      projectName,
      whatBuilding,
      whyBuilding,
      whoUsing,
      successGoals,
      siteMap,
      userJourneys,
      pageContent,
      generalAssets
    } = req.body

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' })
    }

    const sql = `
      INSERT INTO briefs (
        user_id, project_name, what_building, why_building,
        who_using, success_goals, site_map, user_journeys, page_content, general_assets
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `
    const result = await query(sql, [
      req.user.id,
      projectName,
      whatBuilding || '',
      whyBuilding || '',
      whoUsing || '',
      successGoals || '',
      JSON.stringify(siteMap || { pages: [] }),
      JSON.stringify(userJourneys || []),
      JSON.stringify(pageContent || {}),
      JSON.stringify(generalAssets || { images: [], files: [] })
    ])

    res.status(201).json({ success: true, brief: result.rows[0] })
  } catch (error) {
    console.error('❌ Error creating brief:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update brief
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      projectName,
      whatBuilding,
      whyBuilding,
      whoUsing,
      successGoals,
      siteMap,
      userJourneys,
      pageContent,
      generalAssets
    } = req.body

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' })
    }

    const sql = `
      UPDATE briefs
      SET project_name = $1, what_building = $2, why_building = $3,
          who_using = $4, success_goals = $5, site_map = $6,
          user_journeys = $7, page_content = $8, general_assets = $9, updated_at = NOW()
      WHERE id = $10 AND user_id = $11
      RETURNING *
    `
    const result = await query(sql, [
      projectName,
      whatBuilding || '',
      whyBuilding || '',
      whoUsing || '',
      successGoals || '',
      JSON.stringify(siteMap || { pages: [] }),
      JSON.stringify(userJourneys || []),
      JSON.stringify(pageContent || {}),
      JSON.stringify(generalAssets || { images: [], files: [] }),
      req.params.id,
      req.user.id
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brief not found' })
    }

    res.json({ success: true, brief: result.rows[0] })
  } catch (error) {
    console.error('❌ Error updating brief:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete brief
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Admins can delete any brief; PMs/viewers only their own
    const sql = req.user.role === 'admin'
      ? 'DELETE FROM briefs WHERE id = $1 RETURNING id'
      : 'DELETE FROM briefs WHERE id = $1 AND user_id = $2 RETURNING id'

    const params = req.user.role === 'admin'
      ? [req.params.id]
      : [req.params.id, req.user.id]

    const result = await query(sql, params)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brief not found' })
    }

    res.json({ message: 'Brief deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export brief as PDF (placeholder)
router.get('/:id/export', authenticateToken, async (req, res) => {
  try {
    const sql = 'SELECT * FROM briefs WHERE id = $1 AND user_id = $2'
    const result = await query(sql, [req.params.id, req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Brief not found' })
    }

    // TODO: Implement PDF generation
    res.json({
      message: 'PDF export coming soon',
      brief: result.rows[0]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
