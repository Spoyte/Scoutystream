#!/bin/bash

echo "🚀 Deploying ScoutCredential to Flow Testnet..."

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI not found. Please install it first:"
    echo "💡 Visit: https://developers.flow.com/tools/flow-cli/install"
    echo "📦 Or run: sh -ci \"\$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)\""
    exit 1
fi

# Check if we're logged in
echo "🔍 Checking Flow CLI authentication..."
if ! flow auth list &> /dev/null; then
    echo "❌ Not authenticated with Flow CLI"
    echo "🔑 Please run: flow auth login"
    exit 1
fi

# Create account if needed (for testnet)
echo "👤 Setting up testnet account..."
flow accounts create --network testnet --key-name default || echo "Account may already exist"

# Deploy the contract
echo "📦 Deploying ScoutCredential contract..."
flow project deploy --network testnet

if [ $? -eq 0 ]; then
    echo "✅ ScoutCredential deployed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Note the contract address from the output above"
    echo "2. Add it to your frontend .env file:"
    echo "   NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=0x..."
    echo "3. Test minting from the frontend Profile page"
    echo "4. View on Flow Explorer: https://testnet.flowscan.org"
    echo ""
    echo "🧪 Test the contract:"
    echo "flow scripts execute --network testnet \"import ScoutCredential from ADDRESS; pub fun main(): UInt64 { return ScoutCredential.getTotalSupply() }\""
else
    echo "❌ Deployment failed!"
    echo "💡 Common issues:"
    echo "   - Insufficient FLOW tokens (get from testnet faucet)"
    echo "   - Network connectivity issues"
    echo "   - Authentication problems"
    exit 1
fi
