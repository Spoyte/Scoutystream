import { z } from 'zod'

const configSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.string().default('development'),
  
  // Chiliz Configuration
  CHILIZ_RPC_URL: z.string().url().default('https://spicy-rpc.chiliz.com'),
  CHILIZ_CHAIN_ID: z.string().default('88882'),
  CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS: z.string().optional(),
  CHILIZ_DEPLOYER_PRIVATE_KEY: z.string().optional(),
  
  // Storage Configuration
  STORAGE_PROVIDER: z.enum(['aws', 'youtube', 'walrus', 'mock']).default('mock'),
  
  // AWS Configuration
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  
  // YouTube Configuration
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),
  YOUTUBE_PLAYLIST_ID: z.string().optional(),
  
  // Walrus/MinIO Configuration
  WALRUS_ENDPOINT: z.string().optional(),
  WALRUS_ACCESS_KEY_ID: z.string().optional(),
  WALRUS_SECRET_ACCESS_KEY: z.string().optional(),
  WALRUS_BUCKET: z.string().optional(),
  WALRUS_REGION: z.string().default('us-east-1'),
  WALRUS_USE_SSL: z.string().transform(val => val === 'true').default('true'),
  
  // Payment Configuration
  PAYMENT_PROVIDER: z.enum(['mock', 'x402']).default('mock'),
  COINBASE_X402_API_KEY: z.string().optional(),
  COINBASE_WEBHOOK_SECRET: z.string().optional(),
  COINBASE_ENV: z.string().default('test'),
  
  // Frontend URL
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
})

function loadConfig() {
  try {
    return configSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid configuration:', error)
    process.exit(1)
  }
}

export const config = loadConfig()

export type Config = z.infer<typeof configSchema>
