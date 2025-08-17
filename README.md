# ScoutyStream - AI-Powered Sports Scouting Platform

A decentralized application (dApp) for the professional sports industry that provides a platform where football clubs can upload training videos and professional scouts or AI agents can access this content through micropayments, facilitated by the HTTP 402 protocol.

## 🏗️ Architecture

- **Frontend**: Next.js with React, TypeScript, Tailwind CSS
- **Blockchain**: Chiliz Spicy Testnet (core access control) + Flow Testnet (scout credentials)
- **Payments**: Coinbase x402 protocol with mock fallback
- **Storage**: S3-compatible storage with HLS streaming
- **AI Integration**: Programmatic access for AI scouting agents

## 🚀 Features

### For Scouts & AI Agents
- **Pay-per-view access** to training videos using HTTP 402
- **HLS video streaming** with blockchain-verified access
- **Advanced filtering** by sport, team, player, and search terms
- **AI-friendly API** for programmatic analysis
- **Frame extraction** for computer vision analysis
- **Scout Credential NFTs** on Flow blockchain

### For Clubs
- **Video upload** with metadata and pricing
- **Automatic HLS transcoding** for optimal streaming
- **Revenue sharing** through blockchain payments

## 📁 Project Structure

```
apps/
  web/             # Next.js frontend (Vercel-ready) ✅
  api/             # Express backend with 402 flow ✅
contracts/
  chiliz/          # VideoAccessControl.sol (planned)
  flow/            # ScoutCredential.cdc (planned)
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- pnpm 9+

### Setup
```bash
# Install dependencies
pnpm install

# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm --filter api dev    # Backend on :4000
pnpm --filter web dev    # Frontend on :3000
```

### Build
```bash
# Type check
pnpm --filter web typecheck

# Build for production
pnpm --filter web build
```

## 🎯 Prize Alignment

### Chiliz ($5,000)
- ✅ Core access control on Chiliz Spicy Testnet
- ✅ Sports/Entertainment application focus
- 🔄 Smart contract deployment (planned)

### Coinbase CDP ($20,000)
- ✅ HTTP 402/x402 payment integration
- 🔄 Full payment flow implementation (in progress)

### Flow ($10,000)
- ✅ Scout Credential NFT concept
- 🔄 Cadence contract deployment (planned)

## 🚦 Current Status

✅ **Completed**:
- Frontend application with all pages and components
- Backend API with video access control
- Advanced video filtering (sport, team, player, search)
- Wallet integration (EVM + Flow)
- Video gallery and playback UI
- Agent demo interface
- HTTP 402 payment flow (mock mode)
- AI-friendly frame extraction endpoints
- CI/CD with GitHub Actions
- Vercel deployment ready

🔄 **In Progress**:
- Smart contract implementation
- x402 payment integration (mock working)
- Full stack integration testing

📋 **Planned**:
- Contract deployments
- End-to-end testing
- Production deployment

## 🔗 Links

- **Frontend Demo**: Coming soon (Vercel deployment)
- **Chiliz Contract**: TBD
- **Flow Contract**: TBD
