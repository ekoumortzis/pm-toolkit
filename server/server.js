import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import database connection (establishes Neon connection)
import { pool } from './config/database.js'

// Import routes
import promptsRouter from './routes/prompts.js'
import briefsRouter from './routes/briefs.js'
import sitemapsRouter from './routes/sitemaps.js'
import userJourneysRouter from './routes/userJourneys.js'
import guidelinesRouter from './routes/guidelines.js'
import userRouter from './routes/user.js'
import usersRouter from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const corsOpts = {
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://pmtoolkit-puce.vercel.app'
    ].filter(Boolean)
    // Allow requests with no origin (mobile apps, curl) or matching origins
    if (!origin || allowed.some(o => origin === o || origin.endsWith('.vercel.app'))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Handle preflight OPTIONS requests explicitly (required for PUT/DELETE with custom headers)
app.options('*', cors(corsOpts))
app.use(cors(corsOpts))
// Increase payload limit for base64 images
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PM Toolkit API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/prompts', promptsRouter)
app.use('/api/briefs', briefsRouter)
app.use('/api/sitemaps', sitemapsRouter)
app.use('/api/user-journeys', userJourneysRouter)
app.use('/api/guidelines', guidelinesRouter)
app.use('/api/user', userRouter)
app.use('/api/users', usersRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server (skip on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  })
}

export default app
