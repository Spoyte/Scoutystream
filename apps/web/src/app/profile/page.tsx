'use client'

import { useState, useEffect } from 'react'
import { currentUser } from '@/lib/fcl'
import * as fcl from '@/lib/fcl'

interface FlowUser {
  addr?: string
  loggedIn?: boolean
}

export default function ProfilePage() {
  const [user, setUser] = useState<FlowUser>({ loggedIn: false })
  const [isMinting, setIsMinting] = useState(false)
  const [mintResult, setMintResult] = useState<{ txId?: string; error?: string }>({})

  useEffect(() => {
    const unsubscribe = currentUser.subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const handleMintCredential = async () => {
    if (!user.loggedIn) {
      alert('Please connect your Flow wallet first')
      return
    }

    try {
      setIsMinting(true)
      setMintResult({})

      // Real Flow contract interaction
      const contractAddress = process.env.NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS
      
      if (contractAddress) {
        const transaction = `
          import ScoutCredential from ${contractAddress}
          import NonFungibleToken from 0x631e88ae7f1d7c20
          import MetadataViews from 0x631e88ae7f1d7c20
          
          transaction {
            prepare(signer: AuthAccount) {
              // Check if signer has a collection
              let collectionRef = signer
                .getCapability(ScoutCredential.CollectionPublicPath)
                .borrow<&{NonFungibleToken.CollectionPublic}>()

              if collectionRef == nil {
                // Create collection if they don't have one
                let collection <- ScoutCredential.createEmptyCollection()
                signer.save(<-collection, to: ScoutCredential.CollectionStoragePath)
                
                signer.link<&ScoutCredential.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
                  ScoutCredential.CollectionPublicPath,
                  target: ScoutCredential.CollectionStoragePath
                )
              }
            }

            execute {
              let id = ScoutCredential.mintScoutCredential(recipient: signer.address)
              log("Minted Scout Credential NFT with ID: ".concat(id.toString()))
            }
          }
        `
        
        const txId = await fcl.mutate({
          cadence: transaction,
          proposer: fcl.authz,
          payer: fcl.authz,
          authorizations: [fcl.authz],
          limit: 50
        })
        
        setMintResult({ txId })
      } else {
        // Fallback to mock for development
        const mockTxId = 'mock_tx_' + Date.now()
        setMintResult({ txId: mockTxId })
      }
      
    } catch (error: any) {
      console.error('Minting error:', error)
      setMintResult({ error: error.message || 'Minting failed' })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Scout Profile
        </h1>

        <div className="space-y-6">
          {/* Flow Wallet Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Flow Blockchain Integration
            </h2>
            
            {user.loggedIn ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Connected Flow Address:</p>
                    <p className="font-mono text-sm text-green-700">{user.addr}</p>
                  </div>
                  <button
                    onClick={fcl.logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 mb-3">
                  Connect your Flow wallet to mint Scout Credentials
                </p>
                <button
                  onClick={fcl.login}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Connect Flow Wallet
                </button>
              </div>
            )}
          </div>

          {/* Scout Credential Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Scout Credential NFT
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 mb-4">
                Mint a Scout Credential NFT to verify your identity as a professional scout on the Flow blockchain.
              </p>
              
              <button
                onClick={handleMintCredential}
                disabled={!user.loggedIn || isMinting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium mb-4"
              >
                {isMinting ? 'Minting...' : 'Mint Scout Credential'}
              </button>

              {mintResult.txId && (
                <div className="bg-green-100 border border-green-300 rounded p-3">
                  <p className="text-green-800 font-medium">✅ Credential Minted Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Transaction ID: <span className="font-mono">{mintResult.txId}</span>
                  </p>
                  <a
                    href={`https://testnet.flowscan.org/transaction/${mintResult.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                  >
                    View on Flow Explorer →
                  </a>
                </div>
              )}

              {mintResult.error && (
                <div className="bg-red-100 border border-red-300 rounded p-3">
                  <p className="text-red-800">❌ Minting Failed</p>
                  <p className="text-sm text-red-700">{mintResult.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">About Scout Credentials</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verifies your identity as a professional scout</li>
              <li>• Stored permanently on Flow blockchain</li>
              <li>• Can be used across the ScoutyStream ecosystem</li>
              <li>• Demonstrates commitment to transparent scouting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
