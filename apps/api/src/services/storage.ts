import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../config/index.js'

class StorageService {
  private s3Client: S3Client | null = null
  private bucket: string | undefined
  private provider: 'aws' | 'youtube' | 'walrus'
  private walrusGatewayUrl?: string

  constructor() {
    this.provider = config.STORAGE_PROVIDER
    this.bucket = config.S3_BUCKET
    this.walrusGatewayUrl = config.WALRUS_GATEWAY_URL

    if (this.provider === 'aws' && config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
      this.s3Client = new S3Client({
        region: config.AWS_REGION,
        credentials: {
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        },
      })
    }
  }

  getProvider(): 'aws' | 'youtube' | 'walrus' {
    return this.provider
  }

  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (this.provider === 'youtube') {
      throw new Error('YouTube provider does not support direct uploads')
    }

    if (this.provider === 'walrus') {
      if (!this.walrusGatewayUrl) {
        throw new Error('Walrus gateway not configured')
      }
      // Assumes your Walrus gateway accepts direct PUT uploads at this path
      return `${this.walrusGatewayUrl.replace(/\/$/, '')}/videos/raw/${videoId}/${encodeURIComponent(filename)}`
    }

    if (!this.s3Client || !this.bucket) {
      console.warn('⚠️  S3 not configured, returning mock upload URL')
      return `https://mock-storage.example.com/upload/${videoId}/${filename}`
    }

    try {
      const key = `videos/raw/${videoId}/${filename}`
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      })

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn })
      return uploadUrl
    } catch (error) {
      console.error('❌ Error generating upload URL:', error)
      throw new Error('Failed to generate upload URL')
    }
  }

  async generateDownloadUrl(
    path: string,
    expiresIn: number = 300
  ): Promise<string> {
    if (this.provider === 'youtube') {
      throw new Error('YouTube provider does not support signed downloads')
    }

    if (this.provider === 'walrus') {
      if (!this.walrusGatewayUrl) {
        throw new Error('Walrus gateway not configured')
      }
      // Serve directly from the configured gateway
      return `${this.walrusGatewayUrl.replace(/\/$/, '')}/${path}`
    }

    if (!this.s3Client || !this.bucket) {
      console.warn('⚠️  S3 not configured, returning mock download URL')
      return `https://mock-storage.example.com/download/${path}?expires=${Date.now() + expiresIn * 1000}`
    }

    try {
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: path })
      const downloadUrl = await getSignedUrl(this.s3Client, command, { expiresIn })
      return downloadUrl
    } catch (error) {
      console.error('❌ Error generating download URL:', error)
      throw new Error('Failed to generate download URL')
    }
  }

  async generateHlsManifestUrl(videoId: string, expiresIn: number = 300): Promise<string> {
    if (this.provider === 'youtube') {
      throw new Error('YouTube provider does not support HLS manifests')
    }
    const manifestPath = `videos/hls/${videoId}/playlist.m3u8`
    return this.generateDownloadUrl(manifestPath, expiresIn)
  }

  getVideoPath(videoId: string, filename: string): string {
    return `videos/raw/${videoId}/${filename}`
  }

  getHlsPath(videoId: string): string {
    return `videos/hls/${videoId}/`
  }

  getThumbnailPath(videoId: string): string {
    return `videos/thumbnails/${videoId}/thumbnail.jpg`
  }

  async generateThumbnailUrl(videoId: string, expiresIn: number = 3600): Promise<string> {
    const thumbnailPath = this.getThumbnailPath(videoId)
    return this.generateDownloadUrl(thumbnailPath, expiresIn)
  }

  isConfigured(): boolean {
    if (this.provider === 'youtube') return true
    if (this.provider === 'walrus') return !!this.walrusGatewayUrl
    return !!(this.s3Client && this.bucket)
  }

  getConfig() {
    return {
      provider: this.provider,
      bucket: this.bucket,
      region: config.AWS_REGION,
      walrusGatewayUrl: this.walrusGatewayUrl,
      isConfigured: this.isConfigured(),
    }
  }
}

export const storageService = new StorageService()
