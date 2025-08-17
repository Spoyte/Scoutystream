import { Router, type IRouter } from 'express'
import { config } from '../config/index.js'
import { chilizService } from '../services/chiliz.js'
import { storageService } from '../services/storage.js'
import { paymentService } from '../services/payments.js'
import { db } from '../services/database.js'

const router: IRouter = Router()

router.get('/', (req, res) => {
  const stats = db.getStats()
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.NODE_ENV,
    services: {
      chiliz: chilizService.getNetworkInfo(),
      storage: storageService.getConfig(),
      payments: paymentService.getConfig(),
    },
    database: stats
  })
})

export { router as healthRoutes }
