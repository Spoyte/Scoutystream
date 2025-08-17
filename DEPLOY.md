# 🚀 ScoutyStream Complete Deployment Guide

This guide walks you through deploying the entire ScoutyStream platform from development to production.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 20+** installed
- [ ] **pnpm** package manager installed
- [ ] **Git** repository set up
- [ ] **Vercel account** for frontend hosting
- [ ] **Railway/Heroku account** for backend hosting (or alternative)

## 🔑 Required Accounts & Tokens

### Blockchain Accounts
1. **Chiliz Spicy Testnet**:
   - Create wallet with MetaMask
   - Add Chiliz Spicy network manually:
     - Network Name: `Chiliz Spicy Testnet`
     - RPC URL: `https://spicy-rpc.chiliz.com`
     - Chain ID: `88882`
     - Currency: `CHZ`
     - Explorer: `https://testnet.chiliscan.com`
   - Get CHZ tokens: https://spicy-faucet.chiliz.com/

2. **Flow Testnet**:
   - Install Flow CLI: `sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"`
   - Authenticate: `flow auth login`
   - Get FLOW tokens: https://testnet-faucet.onflow.org/

### Optional Services (for production features)
3. **AWS S3** (for real video storage):
   - Create S3 bucket
   - Generate access keys
   - Configure CORS for uploads

4. **Coinbase Developer Platform** (for real x402):
   - Sign up at https://developers.coinbase.com/
   - Get API keys for x402 integration

---

## 🏗️ Deployment Steps

### Step 1: Environment Setup

Create environment files for each component:

#### A. API Environment (`apps/api/.env`)
```bash
cd apps/api
cp env.example .env
```

Edit `.env` with your values:
```env
PORT=4000
CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
CHILIZ_CHAIN_ID=88882
CHILIZ_DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix

# Optional: Real S3 (use mock URLs if not configured)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET=your_bucket_name

# Payment (start with mock)
PAYMENT_PROVIDER=mock
COINBASE_X402_API_KEY=your_coinbase_key
COINBASE_WEBHOOK_SECRET=your_webhook_secret
```

#### B. Contracts Environment (`contracts/chiliz/.env`)
```bash
cd contracts/chiliz
cp env.example .env
```

Edit `.env`:
```env
CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
CHILIZ_CHAIN_ID=88882
CHILIZ_DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
```

### Step 2: Deploy Smart Contracts

#### A. Deploy Chiliz VideoAccessControl

```bash
# Navigate to Chiliz contracts
cd contracts/chiliz

# Install dependencies
pnpm install

# Compile contracts
pnpm compile

# Run tests (should show 19 passing)
pnpm test

# Deploy to Chiliz Spicy Testnet
pnpm deploy:spicy
```

**Expected Output:**
```
✅ VideoAccessControl deployed to: 0x1234567890abcdef...
📋 ABI copied to API directory
💾 Deployment info saved to: deployments/VideoAccessControl-chilizSpicy.json
```

**Important**: Copy the contract address - you'll need it for the API!

#### B. Deploy Flow ScoutCredential

```bash
# Navigate to Flow contracts
cd contracts/flow

# Ensure Flow CLI is authenticated
flow auth list

# Deploy to Flow Testnet
./deploy.sh
```

**Expected Output:**
```
✅ ScoutCredential deployed to: 0xabcdef1234567890...
```

**Important**: Copy this contract address for frontend configuration!

### Step 3: Update Configuration with Contract Addresses

#### A. Update API Configuration
Add the Chiliz contract address to `apps/api/.env`:
```env
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x1234567890abcdef...
```

#### B. Update Frontend Configuration
For local development, create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
NEXT_PUBLIC_CHILIZ_CHAIN_ID=88882
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_URL=https://fcl-discovery.onflow.org/testnet/authn
NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=0xabcdef1234567890...
NEXT_PUBLIC_PAYMENT_PROVIDER=mock
```

### Step 4: Test Local Integration

```bash
# From project root - start both services
pnpm dev

# This starts:
# - API server on http://localhost:4000
# - Frontend on http://localhost:3000
```

**Test the integration:**

1. **API Health Check**:
   ```bash
   curl http://localhost:4000/api/health | jq .services.chiliz.isConfigured
   # Should return: true
   ```

2. **Frontend**: Visit http://localhost:3000
   - Gallery should load with 8 demo videos
   - Filtering should work (try sport: basketball)
   - Video pages should show payment buttons

3. **End-to-End Flow**:
   - Connect MetaMask (Chiliz Spicy network)
   - Try to watch a video → should get payment prompt
   - Use mock purchase → should grant access
   - Video should show "ready to stream" state

### Step 5: Deploy Backend to Production

#### Option A: Railway (Recommended)

1. **Connect Repository**:
   - Go to https://railway.app/
   - Connect your GitHub repository
   - Select "Deploy from GitHub repo"

2. **Configure Service**:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm build`
   - **Start Command**: `pnpm start`

3. **Environment Variables**:
   Add all variables from your local `.env` file:
   ```
   PORT=4000
   CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
   CHILIZ_CHAIN_ID=88882
   CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x...
   CHILIZ_DEPLOYER_PRIVATE_KEY=your_key
   PAYMENT_PROVIDER=mock
   ```

4. **Deploy**: Railway will automatically build and deploy
5. **Note the URL**: e.g., `https://your-api.up.railway.app`

#### Option B: Heroku

```bash
# Install Heroku CLI
# Create app
heroku create scoutystream-api

# Set environment variables
heroku config:set CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x...
heroku config:set CHILIZ_DEPLOYER_PRIVATE_KEY=your_key
# ... add all other env vars

# Deploy
git subtree push --prefix apps/api heroku main
```

### Step 6: Deploy Frontend to Vercel

1. **Connect Repository**:
   - Go to https://vercel.com/
   - Import your GitHub repository
   - Select "Import Project"

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api.up.railway.app
   NEXT_PUBLIC_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
   NEXT_PUBLIC_CHILIZ_CHAIN_ID=88882
   NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
   NEXT_PUBLIC_FLOW_WALLET_URL=https://fcl-discovery.onflow.org/testnet/authn
   NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_PAYMENT_PROVIDER=mock
   ```

4. **Deploy**: Vercel will build and deploy automatically
5. **Note the URL**: e.g., `https://scoutystream.vercel.app`

---

## 🧪 Production Testing

### 1. Test Deployed API

```bash
# Replace with your actual API URL
API_URL="https://your-api.up.railway.app"

# Health check
curl $API_URL/api/health | jq .

# Videos list
curl $API_URL/api/videos | jq length

# Test 402 flow
curl "$API_URL/api/videos/1/manifest?address=0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"
# Should return 402 Payment Required

# Test mock purchase
curl -X POST $API_URL/api/videos/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"userAddress": "0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"}'

# Test access after purchase
curl "$API_URL/api/videos/1/manifest?address=0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"
# Should return manifest URL
```

### 2. Test Deployed Frontend

Visit your Vercel URL and verify:

- [ ] **Gallery loads** with video filtering
- [ ] **Wallet connections** work (both Chiliz and Flow)
- [ ] **Video pages** load and show payment buttons
- [ ] **Upload form** accepts files and metadata
- [ ] **Profile page** shows Flow wallet integration
- [ ] **Agent demo** runs programmatic flow

### 3. Test Smart Contracts

#### Chiliz Contract
```bash
# From contracts/chiliz directory
npx hardhat console --network chilizSpicy

# In console:
const contract = await ethers.getContractAt("VideoAccessControl", "YOUR_CONTRACT_ADDRESS");
await contract.getTotalSupply(); // Should work
```

#### Flow Contract
```bash
# From contracts/flow directory
flow scripts execute scripts/get_total_supply.cdc --network testnet
# Should return: 0 (or number of minted credentials)
```

---

## 🎬 Demo Preparation

### 5-Minute Judge Demo Script

**Minute 1: Platform Introduction**
- "ScoutyStream is a blockchain-powered sports scouting platform"
- Show gallery with diverse sports content
- Demonstrate filtering: "Let's find basketball content from the Lakers"

**Minute 2: Core Payment Flow**
- Connect MetaMask to Chiliz Spicy Testnet
- Select a locked video: "This premium training session costs $7.99"
- Trigger 402 payment flow: "The platform uses HTTP 402 for micropayments"
- Complete mock payment: "Payment processed, access granted on Chiliz blockchain"
- Video ready to stream: "Now we have HLS streaming access"

**Minute 3: AI Agent Capabilities**
- Switch to Agent Demo: "This platform is designed for AI agents too"
- Run programmatic flow: "Agent handles 402 payment automatically"
- Show frame extraction: "AI can analyze video frame-by-frame"
- Display mock insights: "Computer vision detects player movements"

**Minute 4: Multi-Chain Architecture**
- Go to Profile page: "We also use Flow for scout credentials"
- Connect Flow wallet: "Professional scouts can verify their identity"
- Mint Scout Credential NFT: "This creates an on-chain professional credential"
- Show transaction on Flow Explorer

**Minute 5: Technical Deep Dive**
- Show smart contracts on explorers
- Highlight key technical achievements:
  - "Real blockchain integration, not just mockups"
  - "Multi-chain architecture leveraging each platform's strengths"
  - "AI-first design for automated scouting"
  - "Production-ready with comprehensive testing"

### Key Demo URLs

Prepare these URLs for the demo:
- **Frontend**: https://scoutystream.vercel.app
- **API Health**: https://your-api.railway.app/api/health
- **Chiliz Contract**: https://testnet.chiliscan.com/address/YOUR_CONTRACT
- **Flow Contract**: https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.ScoutCredential

---

## 🐛 Troubleshooting

### Common Deployment Issues

#### 1. Frontend Build Fails on Vercel
**Problem**: TypeScript errors or missing environment variables
**Solution**:
```bash
# Test build locally first
cd apps/web
pnpm build

# Check environment variables in Vercel dashboard
# Ensure all NEXT_PUBLIC_ variables are set
```

#### 2. API Can't Connect to Contracts
**Problem**: Contract address not configured or invalid private key
**Solution**:
```bash
# Verify contract address
curl YOUR_API_URL/api/health | jq .services.chiliz

# Should show: "isConfigured": true
# If false, check CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS
```

#### 3. Wallet Connection Issues
**Problem**: MetaMask can't connect to Chiliz Spicy
**Solution**:
- Manually add network to MetaMask:
  - Network: Chiliz Spicy Testnet
  - RPC: https://spicy-rpc.chiliz.com
  - Chain ID: 88882
  - Currency: CHZ

#### 4. Flow Contract Deployment Fails
**Problem**: Insufficient FLOW tokens or authentication issues
**Solution**:
```bash
# Check authentication
flow auth list

# Check balance
flow accounts get YOUR_ADDRESS --network testnet

# Re-authenticate if needed
flow auth login
```

#### 5. 402 Payment Flow Not Working
**Problem**: Backend not granting access after payment
**Solution**:
```bash
# Test mock payment directly
curl -X POST YOUR_API_URL/api/videos/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"userAddress": "0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"}'

# Check if access was granted
curl "YOUR_API_URL/api/videos/1?address=0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"
```

---

## 🎯 Prize Submission Checklist

### Chiliz Prize ($5,000)
- [ ] VideoAccessControl deployed on Chiliz Spicy Testnet
- [ ] Contract address documented in README
- [ ] Application demonstrates clear sports/entertainment use case
- [ ] Platform shows meaningful Chiliz blockchain integration
- [ ] Explorer link works: `https://testnet.chiliscan.com/address/YOUR_CONTRACT`

### Coinbase CDP Prize ($20,000)
- [ ] HTTP 402/x402 payment flow implemented and demonstrated
- [ ] Platform handles 402 Payment Required responses correctly
- [ ] Payment verification system in place (mock or real)
- [ ] Developer feedback prepared on x402 experience
- [ ] Social media post ready with @CoinbaseDev tag

### Flow Prize ($10,000)
- [ ] ScoutCredential contract deployed on Flow Testnet
- [ ] Frontend allows users to send transactions (mint NFT)
- [ ] Contract address documented in README
- [ ] Explorer link works: `https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.ScoutCredential`
- [ ] At least one successful minting transaction demonstrated

---

## 📝 Quick Deployment Commands

For rapid deployment during the hackathon:

```bash
# 1. Deploy contracts (5-10 minutes)
cd contracts/chiliz && pnpm deploy:spicy
cd ../flow && ./deploy.sh

# 2. Update API config with contract address
echo "CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x..." >> apps/api/.env

# 3. Test local integration
pnpm dev
# Visit http://localhost:3000 and test the flow

# 4. Deploy to production
# - Push to GitHub (triggers Vercel deployment)
# - Deploy API to Railway/Heroku
# - Update frontend env vars in Vercel dashboard

# 5. Final verification
curl YOUR_API_URL/api/health
# Visit YOUR_FRONTEND_URL
```

---

## 🔍 Verification Steps

### Before Submission

1. **Contracts Deployed**:
   ```bash
   # Verify Chiliz
   curl "https://testnet.chiliscan.com/api/v2/addresses/YOUR_CONTRACT"
   
   # Verify Flow
   flow contracts get YOUR_ADDRESS.ScoutCredential --network testnet
   ```

2. **Services Running**:
   ```bash
   # API health
   curl YOUR_API_URL/api/health
   
   # Frontend loading
   curl -I YOUR_FRONTEND_URL
   ```

3. **End-to-End Flow**:
   - [ ] Gallery loads and filters work
   - [ ] Can connect both wallets
   - [ ] 402 payment flow triggers
   - [ ] Mock payment grants access
   - [ ] Video shows as "ready to stream"
   - [ ] Flow NFT minting works

### Documentation Links

Prepare these for submission:
- **Live Demo**: YOUR_FRONTEND_URL
- **API Documentation**: YOUR_API_URL/api/health
- **Chiliz Contract**: https://testnet.chiliscan.com/address/YOUR_CONTRACT
- **Flow Contract**: https://testnet.flowscan.org/contract/A.YOUR_ADDRESS.ScoutCredential
- **GitHub Repository**: https://github.com/YOUR_USERNAME/ScoutyStream

---

## ⚡ Speed Deployment (Hackathon Mode)

If you're running short on time:

### Minimal Viable Demo (30 minutes)

1. **Skip real contract deployment** - use mock mode:
   ```env
   # In API .env
   PAYMENT_PROVIDER=mock
   # Leave CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS empty
   ```

2. **Deploy frontend only**:
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Demo works without real blockchain

3. **Show contract code**:
   - Display `VideoAccessControl.sol` and test results
   - Show `ScoutCredential.cdc` implementation
   - Explain how integration would work

### Full Production Demo (60 minutes)

1. **Deploy contracts** (20 min)
2. **Deploy backend** (15 min)
3. **Deploy frontend** (10 min)
4. **Test integration** (10 min)
5. **Prepare demo** (5 min)

---

## 🏆 Success Criteria

Your deployment is successful when:

- ✅ **Frontend loads** at your Vercel URL
- ✅ **API responds** to health checks
- ✅ **Contracts deployed** on both testnets
- ✅ **Wallets connect** to both networks
- ✅ **Payment flow works** (mock or real)
- ✅ **Video access control** functions
- ✅ **Flow NFT minting** works
- ✅ **Agent demo** runs successfully

## 📞 Emergency Support

If you encounter issues during deployment:

### Quick Fixes
- **API not responding**: Check Railway/Heroku logs
- **Frontend not building**: Check Vercel build logs
- **Contracts failing**: Verify testnet tokens and private keys
- **Wallets not connecting**: Check network configurations

### Fallback Strategy
If blockchain deployment fails:
1. Use mock mode for all services
2. Show contract code and tests
3. Explain integration architecture
4. Demo the full UI/UX flow

The platform is designed to work in mock mode for demonstration purposes while being ready for real blockchain integration.

---

## 🎉 You're Ready!

Once deployed, you'll have:
- **Live demo** showcasing real blockchain integration
- **Professional presentation** with working smart contracts
- **Comprehensive documentation** for judges to review
- **Technical depth** demonstrating serious implementation

**Good luck with your hackathon submission! 🚀**
