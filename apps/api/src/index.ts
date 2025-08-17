import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { videoRoutes } from './routes/videos.js'
import { uploadRoutes } from './routes/uploads.js'
import { paymentRoutes } from './routes/payments.js'
import { healthRoutes } from './routes/health.js'
import storageRoutes from './routes/storage.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/storage', storageRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`💰 Payment provider: ${process.env.PAYMENT_PROVIDER || 'mock'}`)
  console.log(`📦 Storage provider: ${process.env.STORAGE_PROVIDER || 'mock'}`)
  console.log(`⛓️  Chiliz RPC: ${process.env.CHILIZ_RPC_URL}`)
})
