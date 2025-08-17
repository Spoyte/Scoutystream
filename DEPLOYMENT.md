# ScoutyStream Deployment Guide

## Prerequisites

### 1. Node.js and pnpm
- Node.js 20+ (current: 18.20.5 - upgrade recommended)
- pnpm 9+

### 2. Blockchain Accounts

#### Chiliz Spicy Testnet
1. Create a wallet (MetaMask recommended)
2. Add Chiliz Spicy Testnet:
   - RPC URL: `https://spicy-rpc.chiliz.com`
   - Chain ID: `88882`
   - Currency: `CHZ`
   - Explorer: `https://testnet.chiliscan.com`
3. Get testnet CHZ from faucet: `https://spicy-faucet.chiliz.com/`

#### Flow Testnet
1. Install Flow CLI: `curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh | sh`
2. Create account: `flow accounts create --network testnet`
3. Fund account: https://testnet-faucet.onflow.org/

### 3. External Services (Optional)
- AWS S3 bucket for video storage
- Coinbase Developer Platform account for x402

## Deployment Steps

### 1. Environment Setup

Create environment files:

**apps/api/.env**:
```env
PORT=4000
CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
CHILIZ_CHAIN_ID=88882
CHILIZ_DEPLOYER_PRIVATE_KEY=your_private_key_here
PAYMENT_PROVIDER=mock
```

**apps/web/.env.local**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHILIZ_CHAIN_ID=88882
NEXT_PUBLIC_PAYMENT_PROVIDER=mock
```

### 2. Smart Contract Deployment

#### Deploy VideoAccessControl to Chiliz Spicy:
```bash
cd contracts/chiliz
cp env.example .env
# Edit .env with your private key
pnpm deploy:spicy
```

Copy the deployed contract address to your API .env file:
```env
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x...
```

#### Deploy ScoutCredential to Flow Testnet:
```bash
cd contracts/flow
# Edit flow.json with your account details
flow project deploy --network testnet
```

Copy the deployed contract address to your frontend .env.local:
```env
NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=0x...
```

### 3. Application Deployment

#### Frontend (Vercel):
1. Connect GitHub repo to Vercel
2. Set build settings:
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
3. Add environment variables in Vercel dashboard
4. Deploy

#### Backend (Railway/Heroku/Fly.io):
1. Create new app
2. Set build settings:
   - Root Directory: `apps/api`
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`
3. Add environment variables
4. Deploy

### 4. Testing

#### Local Development:
```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Test individual components
pnpm test                    # Smart contract tests
pnpm --filter web build     # Frontend build
pnpm --filter api build     # Backend build
```

#### Integration Testing:
1. Open http://localhost:3000
2. Connect MetaMask to Chiliz Spicy Testnet
3. Browse video gallery with filtering
4. Try purchasing a video (mock payment)
5. Test Flow wallet connection and NFT minting
6. Test agent demo functionality

## Verification

### Chiliz Contract Verification:
```bash
cd contracts/chiliz
pnpm verify CONTRACT_ADDRESS --network chilizSpicy
```

### Flow Contract Verification:
Check deployment on Flow explorer:
- Testnet: https://testnet.flowscan.org/

## Production Checklist

- [ ] Smart contracts deployed and verified
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed with environment variables
- [ ] S3 bucket configured for video storage
- [ ] Coinbase x402 integration (if using real payments)
- [ ] Domain configured and SSL enabled
- [ ] Error monitoring and logging set up

## Troubleshooting

### Common Issues:

1. **Node.js Version**: Hardhat requires Node 20+, current is 18.20.5
   - Upgrade: `nvm install 20 && nvm use 20`

2. **MetaMask Network**: Add Chiliz Spicy manually if auto-add fails
   - Use the network details above

3. **Flow Wallet**: Use FCL DevWallet for testing
   - Available at: https://fcl-discovery.onflow.org/testnet/authn

4. **CORS Issues**: Ensure API CORS is configured for your frontend domain

5. **Build Errors**: Clear Next.js cache if hot reload issues occur
   - `rm -rf apps/web/.next`

## Support

- Chiliz Documentation: https://docs.chiliz.com/
- Flow Documentation: https://developers.flow.com/
- Next.js Documentation: https://nextjs.org/docs
