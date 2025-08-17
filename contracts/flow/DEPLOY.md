# Flow Contract Deployment Guide

## Prerequisites

1. Install Flow CLI:
```bash
curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh | sh
```

2. Create Flow Testnet account:
```bash
flow accounts create --network testnet
```

3. Fund your account with testnet FLOW tokens:
- Visit: https://testnet-faucet.onflow.org/
- Enter your account address

## Deployment Steps

1. Update `flow.json` with your account address and private key

2. Deploy the contract:
```bash
flow project deploy --network testnet
```

3. Test the deployment:
```bash
flow scripts execute scripts/mint_credential.cdc --network testnet
```

## Contract Features

- **ScoutCredential NFT**: Simple NFT representing scout credentials
- **Public Minting**: Anyone can mint their own credential
- **Metadata Support**: Standard Flow NFT metadata views
- **Collection Management**: Standard Flow NFT collection interface

## Integration

After deployment, update your frontend environment variables:
```
NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=your_deployed_address_here
```

The frontend Profile page will automatically use this address for minting.
