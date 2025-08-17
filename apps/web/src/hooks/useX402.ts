'use client'

import { useState, useCallback } from 'react'
import api from '@/lib/api'

interface PaymentRequiredError {
  isPaymentRequired: true
  response: {
    headers: Record<string, string>
    data: any
  }
}

interface UseX402Options {
  onPaymentSuccess?: () => void
  onPaymentError?: (error: any) => void
}

export function useX402(options: UseX402Options = {}) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handlePaymentRequired = useCallback(async (error: PaymentRequiredError, videoId: number) => {
    try {
      setIsProcessingPayment(true)
      setPaymentError(null)

      // Check if we're in mock mode
      const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'mock'
      
      if (paymentProvider === 'mock') {
        // Mock payment flow - directly call purchase endpoint
        await api.post(`/api/videos/${videoId}/purchase`)
        options.onPaymentSuccess?.()
        return
      }

      // Real x402 flow would go here
      // For now, we'll implement a simplified version
      console.log('x402 challenge headers:', error.response.headers)
      
      // TODO: Implement actual Coinbase x402 SDK integration
      // This would involve:
      // 1. Parse x402 challenge headers
      // 2. Initialize Coinbase payment modal
      // 3. Handle payment completion
      // 4. Verify receipt with backend
      
      // For demo purposes, simulate payment after delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful payment verification
      await api.post('/api/payments/x402/verify', {
        videoId,
        receipt: 'mock_receipt_' + Date.now()
      })
      
      options.onPaymentSuccess?.()
      
    } catch (err: any) {
      console.error('Payment processing error:', err)
      setPaymentError(err.message || 'Payment failed')
      options.onPaymentError?.(err)
    } finally {
      setIsProcessingPayment(false)
    }
  }, [options])

  return {
    handlePaymentRequired,
    isProcessingPayment,
    paymentError,
    clearPaymentError: () => setPaymentError(null)
  }
}
