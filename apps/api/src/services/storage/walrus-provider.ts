import axios from 'axios'
import FormData from 'form-data'
import { StorageProvider, StorageConfig } from './types.js'

export class WalrusStorageProvider implements StorageProvider {
  name = 'Walrus'
  private publisherUrl: string | undefined
  private aggregatorUrl: string | undefined
  private epochs: number

  constructor(config: StorageConfig['walrus']) {
    this.publisherUrl = config?.publisherUrl
    this.aggregatorUrl = config?.aggregatorUrl
    this.epochs = config?.epochs || 5
  }

  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.publisherUrl) {
      console.warn('⚠️  Walrus not configured, returning mock upload URL')
      return `https://mock-walrus.example.com/upload/${videoId}/${filename}`
    }

    // For Walrus, we return the publisher endpoint
    // The actual upload will be handled in the commit phase
    console.log(`📤 Preparing Walrus upload for ${filename}`)
    return `${this.publisherUrl}/v1/store?epochs=${this.epochs}`
  }

  async uploadToWalrus(videoBuffer: Buffer, filename: string): Promise<string> {
    if (!this.publisherUrl) {
      throw new Error('Walrus publisher URL not configured')
    }

    try {
      const formData = new FormData()
      formData.append('file', videoBuffer, {
        filename,
        contentType: 'video/mp4'
      })

      const response = await axios.post(
        `${this.publisherUrl}/v1/store?epochs=${this.epochs}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 300000, // 5 minutes timeout for large video files
        }
      )

      if (response.data.newlyCreated) {
        const blobId = response.data.newlyCreated.blobObject.blobId
        console.log(`✅ Video uploaded to Walrus: ${blobId}`)
        return blobId
      } else if (response.data.alreadyCertified) {
        const blobId = response.data.alreadyCertified.blobId
        console.log(`✅ Video already exists in Walrus: ${blobId}`)
        return blobId
      } else {
        throw new Error('Unexpected Walrus response format')
      }
    } catch (error) {
      console.error('❌ Error uploading to Walrus:', error)
      throw new Error('Failed to upload video to Walrus')
    }
  }

  async generateDownloadUrl(
    path: string,
    expiresIn: number = 300
  ): Promise<string> {
    if (!this.aggregatorUrl) {
      console.warn('⚠️  Walrus aggregator not configured, returning mock download URL')
      return `https://mock-walrus.example.com/download/${path}`
    }

    // For Walrus, path should be the blob ID
    if (path.startsWith('walrus://blob/')) {
      const blobId = path.replace('walrus://blob/', '')
      return `${this.aggregatorUrl}/v1/${blobId}`
    }

    // If it's already a blob ID, use it directly
    if (path.length === 43 && path.startsWith('0x')) { // Typical Sui object ID format
      return `${this.aggregatorUrl}/v1/${path}`
    }

    console.warn('⚠️  Invalid Walrus blob ID format')
    return `${this.aggregatorUrl}/v1/${path}`
  }

  async generateHlsManifestUrl(videoId: string, expiresIn: number = 300): Promise<string> {
    // For Walrus, we would need to store the HLS segments separately
    // This is a simplified implementation
    if (!this.aggregatorUrl) {
      console.warn('⚠️  Walrus not configured, returning mock HLS URL')
      return `https://mock-walrus.example.com/hls/${videoId}/playlist.m3u8`
    }

    // In practice, you would:
    // 1. Get the HLS manifest blob ID from your database
    // 2. Return the Walrus URL for that blob
    const manifestBlobId = await this.getHlsBlobId(videoId)
    return `${this.aggregatorUrl}/v1/${manifestBlobId}`
  }

  private async getHlsBlobId(videoId: string): Promise<string> {
    // This would typically fetch from your database
    // For demo purposes, we'll generate a mock blob ID
    return `0x${'0'.repeat(40)}${videoId.padStart(3, '0')}`
  }

  getVideoPath(videoId: string, filename: string): string {
    return `walrus://blob/${videoId}/${filename}`
  }

  getHlsPath(videoId: string): string {
    return `walrus://hls/${videoId}/`
  }

  getThumbnailPath(videoId: string): string {
    return `walrus://thumbnail/${videoId}`
  }

  async generateThumbnailUrl(videoId: string, expiresIn: number = 3600): Promise<string> {
    if (!this.aggregatorUrl) {
      console.warn('⚠️  Walrus not configured, returning placeholder thumbnail')
      return `https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Walrus+Video+${videoId}`
    }

    // Get thumbnail blob ID from database
    const thumbnailBlobId = await this.getThumbnailBlobId(videoId)
    return `${this.aggregatorUrl}/v1/${thumbnailBlobId}`
  }

  private async getThumbnailBlobId(videoId: string): Promise<string> {
    // This would typically fetch from your database
    // For demo purposes, we'll generate a mock blob ID
    return `0x${'1'.repeat(40)}${videoId.padStart(3, '0')}`
  }

  async getBlobInfo(blobId: string): Promise<any> {
    if (!this.aggregatorUrl) {
      throw new Error('Walrus aggregator URL not configured')
    }

    try {
      const response = await axios.head(`${this.aggregatorUrl}/v1/${blobId}`)
      return {
        exists: response.status === 200,
        size: response.headers['content-length'],
        contentType: response.headers['content-type'],
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { exists: false }
      }
      throw error
    }
  }

  isConfigured(): boolean {
    return !!(this.publisherUrl && this.aggregatorUrl)
  }

  getConfig() {
    return {
      provider: 'walrus',
      publisherUrl: this.publisherUrl,
      aggregatorUrl: this.aggregatorUrl,
      epochs: this.epochs,
      isConfigured: this.isConfigured()
    }
  }

  // Helper method to check Walrus network status
  async getNetworkInfo(): Promise<any> {
    if (!this.aggregatorUrl) {
      throw new Error('Walrus aggregator URL not configured')
    }

    try {
      const response = await axios.get(`${this.aggregatorUrl}/v1/info`)
      return response.data
    } catch (error) {
      console.error('❌ Error getting Walrus network info:', error)
      throw new Error('Failed to get Walrus network information')
    }
  }
}