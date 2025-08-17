import { Router, Request, Response, type IRouter } from 'express'
import { z } from 'zod'
import { paymentService } from '../services/payments.js'
import { chilizService } from '../services/chiliz.js'
import { db } from '../services/database.js'

const router: IRouter = Router()

// Verify x402 payment receipt
const verifyPaymentSchema = z.object({
  videoId: z.number().positive(),
  receipt: z.string().min(1),
  userAddress: z.string().optional()
})

router.post('/x402/verify', async (req: Request, res: Response) => {
  try {
    const { videoId, receipt, userAddress } = verifyPaymentSchema.parse(req.body)

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    // Verify payment with payment service
    const paymentReceipt = await paymentService.verifyPayment({
      videoId,
      receipt,
      userAddress
    })

    if (!paymentReceipt) {
      return res.status(400).json({ 
        error: 'Payment verification failed',
        message: 'Invalid or expired payment receipt'
      })
    }

    // Grant access locally
    db.grantAccess(paymentReceipt.userAddress, videoId, paymentReceipt.transactionId)

    // Grant access on blockchain
    const blockchainSuccess = await chilizService.grantAccess(paymentReceipt.userAddress, videoId)
    if (!blockchainSuccess) {
      console.warn(`⚠️  Blockchain access grant failed for ${paymentReceipt.userAddress} -> video ${videoId}`)
    }

    res.json({
      success: true,
      message: 'Payment verified and access granted',
      payment: {
        videoId: paymentReceipt.videoId,
        userAddress: paymentReceipt.userAddress,
        amount: paymentReceipt.amount,
        transactionId: paymentReceipt.transactionId,
        timestamp: paymentReceipt.timestamp
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.errors 
      })
    }

    console.error('Error verifying payment:', error)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})

// Coinbase webhook handler
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string
    const payload = req.body

    console.log('📨 Received payment webhook')

    // Process webhook
    const paymentReceipt = await paymentService.processWebhook(payload, signature)
    
    if (!paymentReceipt) {
      console.warn('⚠️  Webhook processing failed or invalid payload')
      return res.status(400).json({ error: 'Invalid webhook payload' })
    }

    // Verify video exists
    const video = db.getVideo(paymentReceipt.videoId)
    if (!video) {
      console.warn(`⚠️  Webhook for non-existent video: ${paymentReceipt.videoId}`)
      return res.status(404).json({ error: 'Video not found' })
    }

    // Check if access already granted (idempotency)
    const existingAccess = db.checkAccess(paymentReceipt.userAddress, paymentReceipt.videoId)
    if (existingAccess) {
      console.log(`✅ Access already exists for ${paymentReceipt.userAddress} -> video ${paymentReceipt.videoId}`)
      return res.json({ success: true, message: 'Access already granted' })
    }

    // Grant access locally
    db.grantAccess(
      paymentReceipt.userAddress, 
      paymentReceipt.videoId, 
      paymentReceipt.transactionId
    )

    // Grant access on blockchain
    const blockchainSuccess = await chilizService.grantAccess(
      paymentReceipt.userAddress, 
      paymentReceipt.videoId
    )

    if (!blockchainSuccess) {
      console.warn(`⚠️  Blockchain access grant failed for webhook payment`)
    }

    res.json({
      success: true,
      message: 'Webhook processed and access granted',
      payment: paymentReceipt
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// Get payment status
router.get('/status/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params

    // For demo, we'll search through access records
    const accessRecords = db.getUserAccess('') // This is a simplified approach
    const paymentRecord = accessRecords.find(record => record.transactionId === transactionId)

    if (!paymentRecord) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    const video = db.getVideo(paymentRecord.videoId)

    res.json({
      transactionId,
      videoId: paymentRecord.videoId,
      videoTitle: video?.title,
      userAddress: paymentRecord.userId,
      grantedAt: paymentRecord.grantedAt,
      status: 'completed'
    })
  } catch (error) {
    console.error('Error getting payment status:', error)
    res.status(500).json({ error: 'Failed to get payment status' })
  }
})

// Get user's access history
router.get('/history/:userAddress', async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params

    if (!userAddress || !userAddress.startsWith('0x')) {
      return res.status(400).json({ error: 'Invalid user address' })
    }

    const accessRecords = db.getUserAccess(userAddress)
    
    const history = accessRecords.map(record => {
      const video = db.getVideo(record.videoId)
      return {
        videoId: record.videoId,
        videoTitle: video?.title,
        price: video?.price,
        grantedAt: record.grantedAt,
        transactionId: record.transactionId
      }
    })

    res.json({
      userAddress,
      totalPurchases: history.length,
      totalSpent: history.reduce((sum, item) => sum + (item.price || 0), 0),
      purchases: history.sort((a, b) => b.grantedAt - a.grantedAt)
    })
  } catch (error) {
    console.error('Error getting payment history:', error)
    res.status(500).json({ error: 'Failed to get payment history' })
  }
})

export { router as paymentRoutes }
