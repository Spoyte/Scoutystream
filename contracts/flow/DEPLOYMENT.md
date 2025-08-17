# Flow ScoutCredential Deployment Guide

This guide explains how to deploy the ScoutCredential NFT contract to Flow Testnet.

## Prerequisites

1. **Flow CLI** installed
2. **Flow Testnet account** with FLOW tokens
3. **Authentication** with Flow CLI

## Setup

### 1. Install Flow CLI

```bash
# Install Flow CLI (if not already installed)
sh -ci "$(curl -fsSL https://raw.githubusercontent.com/onflow/flow-cli/master/install.sh)"

# Verify installation
flow version
```

### 2. Authenticate with Flow

```bash
# Login to Flow CLI
flow auth login

# This will open a browser for authentication
# Follow the instructions to connect your wallet
```

### 3. Get Testnet FLOW Tokens

- Visit the Flow Testnet Faucet: https://testnet-faucet.onflow.org/
- Connect your wallet and request FLOW tokens
- You'll need FLOW for deployment gas fees

### 4. Configure Account

The `flow.json` file contains the project configuration. Update it with your account details:

```json
{
  "accounts": {
    "testnet-account": {
      "address": "0xYOUR_ADDRESS_HERE",
      "key": {
        "type": "hex",
        "index": 0,
        "signatureAlgorithm": "ECDSA_P256",
        "hashAlgorithm": "SHA3_256",
        "privateKey": "$FLOW_PRIVATE_KEY"
      }
    }
  }
}
```

## Deployment

### 1. Deploy the Contract

```bash
cd contracts/flow
./deploy.sh
```

Or manually:

```bash
flow project deploy --network testnet
```

### 2. Note the Contract Address

After deployment, note the contract address from the output. It will look like:
```
ScoutCredential deployed to: 0x1234567890abcdef
```

### 3. Update Frontend Configuration

Add the contract address to your frontend environment:

```env
NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS=0x1234567890abcdef
```

### 4. Update Transaction Files

Replace the placeholder address in:
- `transactions/mint_scout_credential.cdc`
- `scripts/get_total_supply.cdc`

Change `0x...` to your deployed contract address.

## Testing

### 1. Check Total Supply

```bash
flow scripts execute scripts/get_total_supply.cdc --network testnet
```

### 2. Mint a Credential

```bash
flow transactions send transactions/mint_scout_credential.cdc --network testnet --signer testnet-account
```

### 3. Verify on Explorer

Visit the Flow Testnet Explorer to view your contract:
- **Explorer URL**: https://testnet.flowscan.org
- **Contract URL**: https://testnet.flowscan.org/contract/A.{ADDRESS}.ScoutCredential

## Frontend Integration

The ScoutCredential contract is designed to work with the Profile page in the frontend:

1. **Connect Flow Wallet**: Users connect via FCL
2. **Mint Button**: Triggers the minting transaction
3. **Display Result**: Shows transaction ID and explorer link

### Example FCL Integration

```javascript
import * as fcl from '@onflow/fcl'

const mintCredential = async () => {
  const transactionId = await fcl.mutate({
    cadence: `
      import ScoutCredential from 0x${CONTRACT_ADDRESS}
      import NonFungibleToken from 0x631e88ae7f1d7c20
      
      transaction {
        prepare(acct: AuthAccount) {
          // Setup collection if needed
          if acct.borrow<&ScoutCredential.Collection>(from: ScoutCredential.CollectionStoragePath) == nil {
            let collection <- ScoutCredential.createEmptyCollection()
            acct.save(<-collection, to: ScoutCredential.CollectionStoragePath)
            acct.link<&ScoutCredential.Collection{NonFungibleToken.CollectionPublic}>(
              ScoutCredential.CollectionPublicPath,
              target: ScoutCredential.CollectionStoragePath
            )
          }
          
          let collectionRef = acct.borrow<&ScoutCredential.Collection>(from: ScoutCredential.CollectionStoragePath)!
          ScoutCredential.mintNFT(recipient: collectionRef)
        }
      }
    `,
    proposer: fcl.authz,
    payer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50
  })
  
  return transactionId
}
```

## Troubleshooting

### Common Issues

1. **Flow CLI Not Found**
   - Install from: https://developers.flow.com/tools/flow-cli/install

2. **Authentication Failed**
   - Run: `flow auth login`
   - Follow browser authentication flow

3. **Insufficient FLOW Tokens**
   - Get tokens from: https://testnet-faucet.onflow.org/

4. **Deployment Fails**
   - Check account balance
   - Verify network connectivity
   - Ensure proper authentication

### Useful Commands

```bash
# Check authentication
flow auth list

# Check account info
flow accounts get 0xYOUR_ADDRESS --network testnet

# View contract
flow contracts get 0xYOUR_ADDRESS.ScoutCredential --network testnet

# Execute script
flow scripts execute scripts/get_total_supply.cdc --network testnet
```

## Contract Features

- **Simple NFT**: Basic Non-Fungible Token implementation
- **One-Click Minting**: Easy minting process for users
- **Metadata Views**: Full metadata support for wallets and marketplaces
- **Professional Identity**: Represents scout credentials on-chain
- **Flow Standards**: Follows Flow NFT standards and best practices

This minimal implementation satisfies the Flow prize requirements while providing a meaningful feature for the ScoutyStream platform.
