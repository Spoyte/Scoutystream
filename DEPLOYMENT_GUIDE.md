# ScoutyStream Deployment Guide

Complete guide for deploying the ScoutyStream platform to production.

## 🏗️ Architecture Overview

ScoutyStream consists of three main components:

1. **Frontend** (Next.js) → Deploy to Vercel
2. **Backend** (Express API) → Deploy to any Node.js hosting
3. **Smart Contracts** → Deploy to Chiliz Spicy Testnet & Flow Testnet

## 📋 Pre-Deployment Checklist

### Required Accounts & Tokens

- [ ] **Vercel Account** for frontend hosting
- [ ] **Chiliz Spicy Testnet wallet** with CHZ tokens ([Faucet](https://spicy-faucet.chiliz.com/))
- [ ] **Flow Testnet wallet** with FLOW tokens ([Faucet](https://testnet-faucet.onflow.org/))
- [ ] **AWS Account** for S3 storage (optional for demo)
- [ ] **Coinbase Developer Account** for x402 (optional for demo)

### Required Tools

- [ ] Node.js 20+ installed
- [ ] pnpm package manager
- [ ] Flow CLI ([Installation Guide](https://developers.flow.com/tools/flow-cli/install))
- [ ] Git repository connected to Vercel

## 🚀 Deployment Steps

### Step 1: Deploy Smart Contracts

#### A. Chiliz VideoAccessControl Contract

```bash
# Navigate to Chiliz contracts
cd contracts/chiliz

# Configure environment
cp env.example .env
# Edit .env with your CHILIZ_DEPLOYER_PRIVATE_KEY

# Install dependencies
pnpm install

# Compile and test
pnpm compile
pnpm test

# Deploy to Chiliz Spicy Testnet
pnpm deploy:spicy
```

**Expected Output:**
```
✅ VideoAccessControl deployed to: 0x1234567890abcdef...
📋 ABI copied to API directory
```

**Save the contract address** - you'll need it for the API configuration.

#### B. Flow ScoutCredential Contract

```bash
# Navigate to Flow contracts
cd contracts/flow

# Authenticate with Flow CLI
flow auth login

# Deploy to Flow Testnet
./deploy.sh
```

**Expected Output:**
```
✅ ScoutCredential deployed to: 0xabcdef1234567890...
```

**Save the contract address** - you'll need it for frontend configuration.

### Step 2: Deploy Backend API

The backend can be deployed to various platforms. Here are the most common options:

#### Option A: Railway (Recommended for hackathons)

1. Connect your GitHub repo to Railway
2. Select the `apps/api` directory as the root
3. Add environment variables:

```env
PORT=4000
CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
CHILIZ_CHAIN_ID=88882
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x... # From Step 1A
CHILIZ_DEPLOYER_PRIVATE_KEY=your_private_key

# Optional: Real S3 configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your_bucket

# Payment configuration
PAYMENT_PROVIDER=mock  # or x402 if configured
COINBASE_X402_API_KEY=your_key  # optional
COINBASE_WEBHOOK_SECRET=your_secret  # optional
```

4. Deploy and note the API URL (e.g., `https://your-api.railway.app`)

#### Option B: Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create scoutystream-api

# Add environment variables
heroku config:set CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x...
heroku config:set CHILIZ_DEPLOYER_PRIVATE_KEY=your_key
# ... add other env vars

# Deploy
git subtree push --prefix apps/api heroku main
```

#### Option C: Vercel (Serverless)

1. Create `vercel.json` in `apps/api`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

2. Deploy: `vercel --prod`

### Step 3: Deploy Frontend

#### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Go to Vercel dashboard
   - Import your GitHub repository
   - Select `apps/web` as the project root

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

3. **Add Environment Variables**:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.railway.app  # From Step 2
NEXT_PUBLIC_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHILIZ_CHAIN_ID=88882
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_URL=https://fcl-discovery.onflow.org/testnet/authn
NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=0x...  # From Step 1B
NEXT_PUBLIC_PAYMENT_PROVIDER=mock
```

4. **Deploy**: Click "Deploy" and wait for build completion

## 🧪 Post-Deployment Testing

### 1. Test Frontend

Visit your Vercel URL and verify:

- [ ] Gallery loads with videos
- [ ] Filtering works (sport, team, player)
- [ ] Video pages load correctly
- [ ] Wallet connections work (EVM + Flow)
- [ ] Upload form functions
- [ ] Agent demo page works

### 2. Test Backend API

```bash
# Health check
curl https://your-api.railway.app/api/health

# Videos endpoint
curl https://your-api.railway.app/api/videos

# 402 flow
curl "https://your-api.railway.app/api/videos/1/manifest?address=0x123..."
```

### 3. Test Smart Contracts

#### Chiliz Contract

```bash
# From contracts/chiliz directory
npx hardhat console --network chilizSpicy

# In console:
const contract = await ethers.getContractAt("VideoAccessControl", "0x...");
await contract.checkAccess("0x123...", 1);
```

#### Flow Contract

```bash
# From contracts/flow directory
flow scripts execute scripts/get_total_supply.cdc --network testnet
```

### 4. Test End-to-End Flow

1. **Connect Wallets**: Both EVM (Chiliz) and Flow
2. **Browse Gallery**: Filter by sport/team
3. **Purchase Video**: Use mock payment
4. **Watch Video**: Verify HLS playback
5. **Mint Credential**: Flow NFT minting
6. **Agent Demo**: Programmatic access

## 🔧 Configuration Summary

### Environment Variables

| Component | Variable | Description | Required |
|-----------|----------|-------------|----------|
| **API** | `CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS` | Deployed contract address | ✅ |
| **API** | `CHILIZ_DEPLOYER_PRIVATE_KEY` | Private key for granting access | ✅ |
| **Frontend** | `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | ✅ |
| **Frontend** | `NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS` | Flow contract address | ✅ |
| **Both** | AWS S3 credentials | For real video storage | ❌ |
| **Both** | Coinbase x402 keys | For real payments | ❌ |

### Contract Addresses

After deployment, you'll have:

- **Chiliz VideoAccessControl**: `0x...` (on Spicy Testnet)
- **Flow ScoutCredential**: `0x...` (on Flow Testnet)

## 📊 Monitoring & Analytics

### Health Endpoints

- **API Health**: `https://your-api.com/api/health`
- **Contract Analytics**: Available via API endpoints
- **Video Stats**: Built into admin dashboard

### Blockchain Explorers

- **Chiliz**: https://testnet.chiliscan.com/address/YOUR_CONTRACT
- **Flow**: https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.ScoutCredential

## 🐛 Troubleshooting

### Common Issues

1. **Frontend Build Fails**
   - Check all environment variables are set
   - Verify API URL is accessible
   - Check for TypeScript errors

2. **API Can't Connect to Contracts**
   - Verify contract addresses in environment
   - Check private key format (no 0x prefix)
   - Ensure sufficient gas tokens

3. **Wallet Connection Issues**
   - Add Chiliz Spicy network to MetaMask manually
   - Check RPC URL and Chain ID
   - Verify Flow FCL configuration

4. **Video Access Not Working**
   - Check contract deployment status
   - Verify API can call contract methods
   - Test with mock payment first

### Debug Commands

```bash
# Check API health
curl https://your-api.com/api/health | jq .

# Test contract connection
curl https://your-api.com/api/videos/1?address=0x123...

# Check deployment logs
vercel logs your-deployment-url
```

## 🎯 Prize Submission Checklist

### Chiliz Prize
- [ ] VideoAccessControl deployed on Chiliz Spicy Testnet
- [ ] Application demonstrates sports/entertainment use case
- [ ] README documents Chiliz integration
- [ ] Contract address documented and verified

### Coinbase Prize  
- [ ] HTTP 402/x402 integration implemented
- [ ] Payment flow demonstrated (even if mock)
- [ ] Developer feedback provided on x402 experience
- [ ] Social media post with @CoinbaseDev tag

### Flow Prize
- [ ] ScoutCredential contract deployed on Flow Testnet
- [ ] Frontend allows users to mint NFTs
- [ ] Contract address documented in README
- [ ] At least one successful transaction demonstrated

## 🚀 Go Live!

Once all components are deployed and tested:

1. **Update all documentation** with live URLs and addresses
2. **Record demo video** showing the complete flow
3. **Submit to ETHGlobal** with all required links
4. **Share on social media** with appropriate tags

## 📞 Support

For issues during deployment:

- **Chiliz**: [Documentation](https://docs.chiliz.com/) | [Discord](https://discord.gg/chiliz)
- **Flow**: [Documentation](https://developers.flow.com/) | [Discord](https://discord.gg/flow)
- **Vercel**: [Documentation](https://vercel.com/docs) | [Support](https://vercel.com/help)

---

**Happy Deploying! 🚀**
