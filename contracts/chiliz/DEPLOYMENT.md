# VideoAccessControl Deployment Guide

This guide explains how to deploy the VideoAccessControl smart contract to Chiliz Spicy Testnet.

## Prerequisites

1. **Node.js 20+** (recommended, though 18+ works with warnings)
2. **pnpm** package manager
3. **Chiliz Spicy Testnet wallet** with CHZ tokens
4. **Private key** of the deployer wallet

## Setup

### 1. Get Testnet CHZ Tokens

Visit the Chiliz Spicy Faucet to get test CHZ tokens:
- **Faucet URL**: https://spicy-faucet.chiliz.com/
- Connect your wallet and request tokens
- You'll need CHZ for gas fees during deployment

### 2. Configure Environment

Create a `.env` file in the `contracts/chiliz` directory:

```bash
cd contracts/chiliz
cp env.example .env
```

Edit the `.env` file with your values:

```env
# Chiliz Network Configuration
CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
CHILIZ_CHAIN_ID=88882

# Deployer Private Key (without 0x prefix)
CHILIZ_DEPLOYER_PRIVATE_KEY=your_private_key_here

# Contract Addresses (filled after deployment)
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=
```

⚠️ **Security Note**: Never commit your private key to version control!

## Deployment

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Compile Contracts

```bash
pnpm compile
```

### 3. Run Tests (Optional)

```bash
pnpm test
```

### 4. Deploy to Chiliz Spicy Testnet

```bash
pnpm deploy:spicy
```

The deployment script will:
- ✅ Check your account balance
- 🚀 Deploy the VideoAccessControl contract
- ⏳ Wait for confirmations
- 🧪 Test basic functionality
- 💾 Save deployment info to `deployments/`
- 📋 Copy ABI to the API directory
- 📝 Display next steps

### 5. Verify Contract (Optional)

```bash
pnpm verify --network chilizSpicy <CONTRACT_ADDRESS>
```

## Post-Deployment

### 1. Update API Configuration

Add the deployed contract address to your API's `.env` file:

```env
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=0x...
```

### 2. Update Backend Service

The deployment script automatically copies the ABI to `apps/api/src/contracts/VideoAccessControl.json`.

Restart your API server to use the deployed contract:

```bash
# From the root directory
pnpm --filter api dev
```

### 3. Test Integration

Test the integration by:

1. **API Health Check**: Visit `http://localhost:4000/api/health`
   - Should show `chiliz.isConfigured: true`

2. **Grant Access**: Use the mock purchase endpoint
   ```bash
   curl -X POST http://localhost:4000/api/videos/1/purchase \
     -H "Content-Type: application/json" \
     -d '{"userAddress": "0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"}'
   ```

3. **Check Access**: Verify on-chain access
   ```bash
   curl "http://localhost:4000/api/videos/1?address=0x742d35Cc6634C0532925a3b8D6C9D6C8A5A3c5f5"
   ```

## Troubleshooting

### Common Issues

1. **Insufficient Balance**
   - Solution: Get more CHZ from the faucet
   - Check: https://spicy-faucet.chiliz.com/

2. **Invalid Private Key**
   - Ensure no `0x` prefix
   - Check the key format is correct

3. **Network Connection Issues**
   - Verify RPC URL: https://spicy-rpc.chiliz.com
   - Check internet connection

4. **Deployment Fails**
   - Check gas settings in `hardhat.config.ts`
   - Ensure sufficient CHZ balance
   - Try again (network might be congested)

### Useful Commands

```bash
# Check contract compilation
pnpm compile

# Run all tests
pnpm test

# Deploy to testnet
pnpm deploy:spicy

# Verify deployed contract
pnpm verify --network chilizSpicy <address>
```

## Contract Information

- **Network**: Chiliz Spicy Testnet
- **Chain ID**: 88882
- **RPC URL**: https://spicy-rpc.chiliz.com
- **Explorer**: https://testnet.chiliscan.com
- **Faucet**: https://spicy-faucet.chiliz.com

## Next Steps

After successful deployment:

1. ✅ Contract deployed and verified
2. ✅ API integration configured
3. ✅ Basic functionality tested
4. 🔄 Ready for frontend integration
5. 🔄 Ready for Flow module implementation

The deployed contract address will be saved in:
- `deployments/VideoAccessControl-chilizSpicy.json`
- `apps/api/src/contracts/VideoAccessControl.json`

You can view your deployed contract on the Chiliz testnet explorer at:
`https://testnet.chiliscan.com/address/<CONTRACT_ADDRESS>`
