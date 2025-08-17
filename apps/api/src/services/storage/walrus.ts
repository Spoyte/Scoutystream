import { StorageProvider } from './interface.js'
import { config } from '../../config/index.js'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class WalrusStorageProvider implements StorageProvider {
  private s3Client: S3Client | null = null
  private bucket: string
  private endpoint: string
  private region: string
  private useSSL: boolean

  constructor() {
    this.bucket = config.WALRUS_BUCKET || 'scoutystream-dev'
    this.endpoint = config.WALRUS_ENDPOINT || ''
    this.region = config.WALRUS_REGION
    this.useSSL = config.WALRUS_USE_SSL
    
    if (config.WALRUS_ACCESS_KEY_ID && config.WALRUS_SECRET_ACCESS_KEY && this.endpoint) {
      this.s3Client = new S3Client({
        region: this.region,
        endpoint: this.endpoint,
        forcePathStyle: true, // Required for MinIO/Walrus
        credentials: {
          accessKeyId: config.WALRUS_ACCESS_KEY_ID,
          secretAccessKey: config.WALRUS_SECRET_ACCESS_KEY,
        },
        ...(this.useSSL ? {} : { tls: false })
      })
    }
  }

  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.s3Client) {
      // Return a mock URL for development
      console.warn('⚠️  Walrus not configured, returning mock upload URL')
      return `https://mock-walrus.example.com/upload/${videoId}/${filename}`
    }

    try {
      const key = `videos/raw/${videoId}/${filename}`
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      })

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })

      console.log(`📤 Generated Walrus upload URL for ${filename}`)
      return uploadUrl
    } catch (error) {
      console.error('❌ Error generating Walrus upload URL:', error)
      throw new Error('Failed to generate Walrus upload URL')
    }
  }

  async generateDownloadUrl(
    path: string,
    expiresIn: number = 300
  ): Promise<string> {
    if (!this.s3Client) {
      // Return a mock URL for development
      console.warn('⚠️  Walrus not configured, returning mock download URL')
      return `https://mock-walrus.example.com/download/${path}?expires=${Date.now() + expiresIn * 1000}`
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })

      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })

      console.log(`📥 Generated Walrus download URL for ${path} (expires in ${expiresIn}s)`)
      return downloadUrl
    } catch (error) {
      console.error('❌ Error generating Walrus download URL:', error)
      throw new Error('Failed to generate Walrus download URL')
    }
  }

  async generateHlsManifestUrl(videoId: string, expiresIn: number = 300): Promise<string> {
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
    return !!(this.s3Client && this.endpoint && config.WALRUS_BUCKET)
  }

  getConfig(): Record<string, any> {
    return {
      provider: 'walrus',
      endpoint: this.endpoint || 'not configured',
      bucket: this.bucket,
      region: this.region,
      useSSL: this.useSSL,
      isConfigured: this.isConfigured()
    }
  }
}