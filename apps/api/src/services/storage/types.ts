export interface StorageProvider {
  name: string
  generateUploadUrl(videoId: string, filename: string, contentType: string, expiresIn?: number): Promise<string>
  generateDownloadUrl(path: string, expiresIn?: number): Promise<string>
  generateHlsManifestUrl(videoId: string, expiresIn?: number): Promise<string>
  generateThumbnailUrl(videoId: string, expiresIn?: number): Promise<string>
  getVideoPath(videoId: string, filename: string): string
  getHlsPath(videoId: string): string
  getThumbnailPath(videoId: string): string
  isConfigured(): boolean
  getConfig(): Record<string, any>
}

export interface VideoMetadata {
  title: string
  description: string
  tags: string[]
  categoryId?: string
  privacyStatus: 'public' | 'private' | 'unlisted'
}

export interface UploadResult {
  videoId: string
  url: string
  externalId?: string // For YouTube video ID, Walrus blob ID, etc.
}

export interface StorageConfig {
  provider: 'aws' | 'youtube' | 'walrus'
  aws?: {
    region: string
    accessKeyId?: string
    secretAccessKey?: string
    bucket?: string
  }
  youtube?: {
    clientId?: string
    clientSecret?: string
    redirectUri?: string
    refreshToken?: string
    channelId?: string
  }
  walrus?: {
    publisherUrl?: string
    aggregatorUrl?: string
    epochs: number
  }
}