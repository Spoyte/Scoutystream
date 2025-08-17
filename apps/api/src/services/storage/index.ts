import { config } from '../../config/index.js'
import { StorageProvider, StorageConfig } from './types.js'
import { AWSStorageProvider } from './aws-provider.js'
import { YouTubeStorageProvider } from './youtube-provider.js'
import { WalrusStorageProvider } from './walrus-provider.js'

class StorageService {
  private provider: StorageProvider

  constructor() {
    const storageConfig: StorageConfig = {
      provider: config.STORAGE_PROVIDER,
      aws: {
        region: config.AWS_REGION,
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        bucket: config.S3_BUCKET,
      },
      youtube: {
        clientId: config.YOUTUBE_CLIENT_ID,
        clientSecret: config.YOUTUBE_CLIENT_SECRET,
        redirectUri: config.YOUTUBE_REDIRECT_URI,
        refreshToken: config.YOUTUBE_REFRESH_TOKEN,
        channelId: config.YOUTUBE_CHANNEL_ID,
      },
      walrus: {
        publisherUrl: config.WALRUS_PUBLISHER_URL,
        aggregatorUrl: config.WALRUS_AGGREGATOR_URL,
        epochs: config.WALRUS_EPOCHS,
      },
    }

    // Initialize the appropriate provider based on configuration
    switch (config.STORAGE_PROVIDER) {
      case 'youtube':
        this.provider = new YouTubeStorageProvider(storageConfig.youtube)
        break
      case 'walrus':
        this.provider = new WalrusStorageProvider(storageConfig.walrus)
        break
      case 'aws':
      default:
        this.provider = new AWSStorageProvider(storageConfig.aws)
        break
    }

    console.log(`📦 Storage service initialized with provider: ${this.provider.name}`)
    
    if (!this.provider.isConfigured()) {
      console.warn(`⚠️  Storage provider ${this.provider.name} is not fully configured. Some features may not work.`)
    }
  }

  // Delegate all methods to the current provider
  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn?: number
  ): Promise<string> {
    return this.provider.generateUploadUrl(videoId, filename, contentType, expiresIn)
  }

  async generateDownloadUrl(path: string, expiresIn?: number): Promise<string> {
    return this.provider.generateDownloadUrl(path, expiresIn)
  }

  async generateHlsManifestUrl(videoId: string, expiresIn?: number): Promise<string> {
    return this.provider.generateHlsManifestUrl(videoId, expiresIn)
  }

  async generateThumbnailUrl(videoId: string, expiresIn?: number): Promise<string> {
    return this.provider.generateThumbnailUrl(videoId, expiresIn)
  }

  getVideoPath(videoId: string, filename: string): string {
    return this.provider.getVideoPath(videoId, filename)
  }

  getHlsPath(videoId: string): string {
    return this.provider.getHlsPath(videoId)
  }

  getThumbnailPath(videoId: string): string {
    return this.provider.getThumbnailPath(videoId)
  }

  isConfigured(): boolean {
    return this.provider.isConfigured()
  }

  getConfig() {
    return {
      currentProvider: config.STORAGE_PROVIDER,
      providerConfig: this.provider.getConfig(),
      name: this.provider.name,
    }
  }

  // Provider-specific methods
  getProvider(): StorageProvider {
    return this.provider
  }

  getProviderName(): string {
    return this.provider.name
  }

  // YouTube-specific methods
  getYouTubeAuthUrl(): string {
    if (this.provider instanceof YouTubeStorageProvider) {
      return this.provider.getAuthUrl()
    }
    throw new Error('YouTube provider not active')
  }

  async getYouTubeTokens(code: string): Promise<any> {
    if (this.provider instanceof YouTubeStorageProvider) {
      return this.provider.getTokens(code)
    }
    throw new Error('YouTube provider not active')
  }

  // Walrus-specific methods
  async getWalrusNetworkInfo(): Promise<any> {
    if (this.provider instanceof WalrusStorageProvider) {
      return this.provider.getNetworkInfo()
    }
    throw new Error('Walrus provider not active')
  }

  async getWalrusBlobInfo(blobId: string): Promise<any> {
    if (this.provider instanceof WalrusStorageProvider) {
      return this.provider.getBlobInfo(blobId)
    }
    throw new Error('Walrus provider not active')
  }

  // Helper method to check if provider supports direct uploads
  supportsDirectUpload(): boolean {
    return this.provider instanceof AWSStorageProvider
  }

  // Helper method to check if provider needs special handling for uploads
  needsSpecialUploadHandling(): boolean {
    return this.provider instanceof YouTubeStorageProvider || 
           this.provider instanceof WalrusStorageProvider
  }
}

export const storageService = new StorageService()
export * from './types.js'