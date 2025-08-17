import { ethers } from 'ethers'
import { config } from '../config/index.js'

// VideoAccessControl ABI (will be populated when contract is deployed)
const VIDEO_ACCESS_CONTROL_ABI = [
  "function checkAccess(address user, uint256 videoId) external view returns (bool)",
  "function grantAccess(address user, uint256 videoId) external",
  "function grantAccessBatch(address[] calldata users, uint256 videoId) external",
  "function revokeAccess(address user, uint256 videoId) external",
  "event AccessGranted(address indexed user, uint256 indexed videoId)",
  "event AccessRevoked(address indexed user, uint256 indexed videoId)"
]

class ChilizService {
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Wallet | null = null
  private contract: ethers.Contract | null = null

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.CHILIZ_RPC_URL)
    
    if (config.CHILIZ_DEPLOYER_PRIVATE_KEY) {
      this.signer = new ethers.Wallet(config.CHILIZ_DEPLOYER_PRIVATE_KEY, this.provider)
    }
    
    if (config.CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS && this.signer) {
      this.contract = new ethers.Contract(
        config.CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS,
        VIDEO_ACCESS_CONTROL_ABI,
        this.signer
      )
    }
  }

  async checkAccess(userAddress: string, videoId: number): Promise<boolean> {
    if (!this.contract) {
      console.warn('⚠️  No contract configured, defaulting to no access')
      return false
    }

    try {
      const hasAccess = await this.contract.checkAccess(userAddress, videoId)
      console.log(`🔍 Access check: ${userAddress} -> video ${videoId} = ${hasAccess}`)
      return hasAccess
    } catch (error) {
      console.error('❌ Error checking access:', error)
      return false
    }
  }

  async grantAccess(userAddress: string, videoId: number): Promise<boolean> {
    if (!this.contract) {
      console.warn('⚠️  No contract configured, simulating access grant')
      return true
    }

    try {
      // Check if user already has access to avoid unnecessary transactions
      const hasAccess = await this.checkAccess(userAddress, videoId)
      if (hasAccess) {
        console.log(`✅ User ${userAddress} already has access to video ${videoId}`)
        return true
      }

      console.log(`🔐 Granting access: ${userAddress} -> video ${videoId}`)
      const tx = await this.contract.grantAccess(userAddress, videoId)
      const receipt = await tx.wait()
      
      console.log(`✅ Access granted! Tx: ${receipt.hash}`)
      return true
    } catch (error) {
      console.error('❌ Error granting access:', error)
      return false
    }
  }

  async grantAccessBatch(userAddresses: string[], videoId: number): Promise<boolean> {
    if (!this.contract) {
      console.warn('⚠️  No contract configured, simulating batch access grant')
      return true
    }

    try {
      console.log(`🔐 Granting batch access to video ${videoId} for ${userAddresses.length} users`)
      const tx = await this.contract.grantAccessBatch(userAddresses, videoId)
      const receipt = await tx.wait()
      
      console.log(`✅ Batch access granted! Tx: ${receipt.hash}`)
      return true
    } catch (error) {
      console.error('❌ Error granting batch access:', error)
      return false
    }
  }

  async revokeAccess(userAddress: string, videoId: number): Promise<boolean> {
    if (!this.contract) {
      console.warn('⚠️  No contract configured, simulating access revocation')
      return true
    }

    try {
      console.log(`🚫 Revoking access: ${userAddress} -> video ${videoId}`)
      const tx = await this.contract.revokeAccess(userAddress, videoId)
      const receipt = await tx.wait()
      
      console.log(`✅ Access revoked! Tx: ${receipt.hash}`)
      return true
    } catch (error) {
      console.error('❌ Error revoking access:', error)
      return false
    }
  }

  isConfigured(): boolean {
    return !!(this.contract && config.CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS)
  }

  getNetworkInfo() {
    return {
      rpcUrl: config.CHILIZ_RPC_URL,
      chainId: config.CHILIZ_CHAIN_ID,
      contractAddress: config.CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS,
      isConfigured: this.isConfigured()
    }
  }
}

export const chilizService = new ChilizService()
