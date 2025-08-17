import { z } from 'zod'

const configSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.string().default('development'),
  
  // Chiliz Configuration
  CHILIZ_RPC_URL: z.string().url().default('https://spicy-rpc.chiliz.com'),
  CHILIZ_CHAIN_ID: z.string().default('88882'),
  CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS: z.string().optional(),
  CHILIZ_DEPLOYER_PRIVATE_KEY: z.string().optional(),
  
  // AWS Configuration
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  
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
