import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../config/index.js'

class StorageService {
  private s3Client: S3Client | null = null
  private bucket: string

  constructor() {
    this.bucket = config.S3_BUCKET || 'scoutystream-dev'
    
    if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
      this.s3Client = new S3Client({
        region: config.AWS_REGION,
        credentials: {
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        },
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
    return !!(this.s3Client && config.S3_BUCKET)
  }

  getConfig() {
    return {
      bucket: this.bucket,
      region: config.AWS_REGION,
      isConfigured: this.isConfigured()
    }
  }
}

export const storageService = new StorageService()
