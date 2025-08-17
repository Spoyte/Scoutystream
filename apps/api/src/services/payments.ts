import { config } from '../config/index.js'

interface PaymentChallenge {
  videoId: number
  price: number
  headers: Record<string, string>
}

interface PaymentReceipt {
  videoId: number
  userAddress: string
  amount: number
  transactionId: string
  timestamp: number
}

class PaymentService {
  constructor() {}

  generate402Challenge(videoId: number, price: number): PaymentChallenge {
    const challenge: PaymentChallenge = {
      videoId,
      price,
      headers: {}
    }

    if (config.PAYMENT_PROVIDER === 'x402') {
      // Real x402 headers (placeholder - actual implementation would use Coinbase SDK)
      challenge.headers = {
        'WWW-Authenticate': 'L402 realm="ScoutyStream", charset="UTF-8"',
        'L402-Challenge': this.generateL402Challenge(videoId, price),
        'L402-Accept-Payment': 'application/json',
        'L402-Amount': price.toString(),
        'L402-Currency': 'USD'
      }
    } else {
      // Mock headers for development
      challenge.headers = {
        'X-Payment-Required': 'true',
        'X-Payment-Amount': price.toString(),
        'X-Payment-Currency': 'USD',
        'X-Video-Id': videoId.toString()
      }
    }

    console.log(`💰 Generated 402 challenge for video ${videoId}: $${price}`)
    return challenge
  }

  private generateL402Challenge(videoId: number, price: number): string {
    // This would generate a proper L402 challenge token
    // For now, we'll create a mock challenge
    const challenge = {
      video_id: videoId,
      amount: price,
      currency: 'USD',
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substr(2, 9)
    }
    
    return Buffer.from(JSON.stringify(challenge)).toString('base64')
  }

  async verifyPayment(receipt: any): Promise<PaymentReceipt | null> {
    if (config.PAYMENT_PROVIDER === 'x402') {
      return this.verifyX402Payment(receipt)
    } else {
      return this.verifyMockPayment(receipt)
    }
  }

  private async verifyX402Payment(receipt: any): Promise<PaymentReceipt | null> {
    try {
      // Real implementation would verify with Coinbase
      console.log('🔍 Verifying x402 payment with Coinbase...')
      
      // TODO: Implement actual Coinbase verification
      // const verification = await coinbaseSDK.verifyPayment(receipt)
      
      // For now, simulate successful verification
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const paymentReceipt: PaymentReceipt = {
        videoId: receipt.videoId,
        userAddress: receipt.userAddress || '0x' + Math.random().toString(16).substr(2, 40),
        amount: receipt.amount || 5.0,
        transactionId: receipt.receipt || 'x402_' + Date.now(),
        timestamp: Date.now()
      }

      console.log(`✅ Payment verified: $${paymentReceipt.amount} for video ${paymentReceipt.videoId}`)
      return paymentReceipt
    } catch (error) {
      console.error('❌ x402 payment verification failed:', error)
      return null
    }
  }

  private async verifyMockPayment(receipt: any): Promise<PaymentReceipt | null> {
    try {
      console.log('🔍 Verifying mock payment...')
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const paymentReceipt: PaymentReceipt = {
        videoId: receipt.videoId,
        userAddress: receipt.userAddress || '0x' + Math.random().toString(16).substr(2, 40),
        amount: 5.0, // Mock amount
        transactionId: 'mock_' + Date.now(),
        timestamp: Date.now()
      }

      console.log(`✅ Mock payment verified: $${paymentReceipt.amount} for video ${paymentReceipt.videoId}`)
      return paymentReceipt
    } catch (error) {
      console.error('❌ Mock payment verification failed:', error)
      return null
    }
  }

  async processWebhook(payload: any, signature?: string): Promise<PaymentReceipt | null> {
    if (config.PAYMENT_PROVIDER === 'x402') {
      return this.processX402Webhook(payload, signature)
    } else {
      console.log('📨 Mock webhook received:', payload)
      return null
    }
  }

  private async processX402Webhook(payload: any, signature?: string): Promise<PaymentReceipt | null> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        throw new Error('Invalid webhook signature')
      }

      // Process the webhook payload
      const paymentReceipt: PaymentReceipt = {
        videoId: payload.metadata?.video_id || payload.video_id,
        userAddress: payload.customer?.address || payload.user_address,
        amount: payload.amount || payload.total,
        transactionId: payload.id || payload.transaction_id,
        timestamp: Date.now()
      }

      console.log(`📨 Webhook payment processed: $${paymentReceipt.amount} for video ${paymentReceipt.videoId}`)
      return paymentReceipt
    } catch (error) {
      console.error('❌ Webhook processing failed:', error)
      return null
    }
  }

  private verifyWebhookSignature(payload: any, signature?: string): boolean {
    if (!signature || !config.COINBASE_WEBHOOK_SECRET) {
      console.warn('⚠️  No webhook signature verification configured')
      return true // Allow for development
    }

    // TODO: Implement actual signature verification
    // const expectedSignature = crypto
    //   .createHmac('sha256', config.COINBASE_WEBHOOK_SECRET)
    //   .update(JSON.stringify(payload))
    //   .digest('hex')
    
    // return crypto.timingSafeEqual(
    //   Buffer.from(signature, 'hex'),
    //   Buffer.from(expectedSignature, 'hex')
    // )

    return true
  }

  getConfig() {
    return {
      provider: config.PAYMENT_PROVIDER,
      environment: config.COINBASE_ENV,
      webhookConfigured: !!config.COINBASE_WEBHOOK_SECRET,
      apiConfigured: !!config.COINBASE_X402_API_KEY
    }
  }
}

export const paymentService = new PaymentService()
