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
  STORAGE_PROVIDER: z.enum(['aws', 'youtube', 'walrus']).default('aws'),
  
  // AWS Configuration
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  
  // YouTube Configuration
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  YOUTUBE_REDIRECT_URI: z.string().optional(),
  YOUTUBE_REFRESH_TOKEN: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),
  
  // Walrus Configuration
  WALRUS_PUBLISHER_URL: z.string().url().optional(),
  WALRUS_AGGREGATOR_URL: z.string().url().optional(),
  WALRUS_EPOCHS: z.number().default(5),
  
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
