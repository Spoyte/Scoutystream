import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../config/index.js'

class StorageService {
  private s3Client: S3Client | null = null
  private bucket: string
  private provider: 's3' | 'youtube' | 'walrus'

  constructor() {
    this.provider = (config.STORAGE_PROVIDER || 's3') as 's3' | 'youtube' | 'walrus'

    this.bucket = config.S3_BUCKET || 'scoutystream-dev'

    if (this.provider === 's3' || this.provider === 'walrus') {
      // Configure S3-compatible client (AWS or Walrus)
      const s3ClientConfig: any = {
        region: config.AWS_REGION,
        credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY ? {
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        } : undefined,
      }

      // Allow custom endpoint for Walrus (or any S3-compatible storage)
      if (config.S3_ENDPOINT) {
        s3ClientConfig.endpoint = config.S3_ENDPOINT
        s3ClientConfig.forcePathStyle = true
      }

      this.s3Client = new S3Client(s3ClientConfig)
    }
  }

  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (this.provider !== 's3' && this.provider !== 'walrus') {
      // Upload not supported for YouTube via this API
      throw new Error('Upload via YouTube is not supported. Please upload directly on YouTube Studio and register the video separately.')
    }

    if (!this.s3Client) {
      // Return a mock URL for development
      console.warn('⚠️  S3 not configured, returning mock upload URL')
      return `https://mock-s3.example.com/upload/${videoId}/${filename}`
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

      console.log(`📤 Generated upload URL for ${filename}`)
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
    if (!this.s3Client) {
      // Return a mock URL for development
      console.warn('⚠️  S3 not configured, returning mock download URL')
      return `https://mock-s3.example.com/download/${path}?expires=${Date.now() + expiresIn * 1000}`
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })

      const downloadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })

      console.log(`📥 Generated download URL for ${path} (expires in ${expiresIn}s)`)
      return downloadUrl
    } catch (error) {
      console.error('❌ Error generating download URL:', error)
      throw new Error('Failed to generate download URL')
    }
  }

  async generateHlsManifestUrl(videoKey: string, expiresIn: number = 300): Promise<string> {
    if (this.provider === 'youtube') {
      // For YouTube, treat videoKey as the YouTube video ID
      return `https://www.youtube.com/embed/${videoKey}`
    }

    const manifestPath = `videos/hls/${videoKey}/playlist.m3u8`
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
    if (this.provider === 'youtube') {
      return true
    }
    return !!(this.s3Client && config.S3_BUCKET)
  }

  getConfig() {
    return {
      bucket: this.bucket,
      region: config.AWS_REGION,
      provider: this.provider,
      isConfigured: this.isConfigured()
    }
  }
}

export const storageService = new StorageService()
