import { google } from 'googleapis'
import { StorageProvider, StorageConfig, VideoMetadata } from './types.js'

export class YouTubeStorageProvider implements StorageProvider {
  name = 'YouTube'
  private youtube: any = null
  private oauth2Client: any = null
  private channelId: string | undefined

  constructor(config: StorageConfig['youtube']) {
    this.channelId = config?.channelId

    if (config?.clientId && config?.clientSecret && config?.refreshToken) {
      this.oauth2Client = new google.auth.OAuth2(
        config.clientId,
        config.clientSecret,
        config.redirectUri
      )

      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
      })

      this.youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client,
      })
    }
  }

  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.youtube) {
      console.warn('⚠️  YouTube not configured, returning mock upload URL')
      return `https://mock-youtube.example.com/upload/${videoId}/${filename}`
    }

    // For YouTube, we don't use pre-signed URLs. Instead, we'll return a placeholder
    // The actual upload will happen in the commit phase
    console.log(`📤 Preparing YouTube upload for ${filename}`)
    return `youtube://upload/${videoId}/${filename}`
  }

  async uploadToYouTube(
    videoPath: string,
    metadata: VideoMetadata,
    videoId: string
  ): Promise<string> {
    if (!this.youtube) {
      throw new Error('YouTube not configured')
    }

    try {
      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId || '17', // Sports category
            channelId: this.channelId,
          },
          status: {
            privacyStatus: metadata.privacyStatus,
            selfDeclaredMadeForKids: false,
          },
        },
        media: {
          body: videoPath, // This would be a stream in practice
        },
      })

      const youtubeVideoId = response.data.id
      console.log(`✅ Video uploaded to YouTube: ${youtubeVideoId}`)
      return youtubeVideoId
    } catch (error) {
      console.error('❌ Error uploading to YouTube:', error)
      throw new Error('Failed to upload video to YouTube')
    }
  }

  async generateDownloadUrl(
    path: string,
    expiresIn: number = 300
  ): Promise<string> {
    // For YouTube, we return the direct YouTube URL
    // Path should be in format: youtube://video/{youtubeVideoId}
    if (path.startsWith('youtube://video/')) {
      const youtubeVideoId = path.replace('youtube://video/', '')
      return `https://www.youtube.com/watch?v=${youtubeVideoId}`
    }

    console.warn('⚠️  Invalid YouTube path, returning mock URL')
    return `https://mock-youtube.example.com/watch?v=${path}`
  }

  async generateHlsManifestUrl(videoId: string, expiresIn: number = 300): Promise<string> {
    // For YouTube, we need to get the streaming URL
    // This is a simplified approach - in practice, you might need to extract the actual streaming URLs
    if (!this.youtube) {
      console.warn('⚠️  YouTube not configured, returning mock HLS URL')
      return `https://mock-youtube.example.com/hls/${videoId}/playlist.m3u8`
    }

    // In a real implementation, you would:
    // 1. Get the YouTube video ID from your database
    // 2. Use YouTube's streaming URLs or embed the player
    // For now, we'll return a YouTube embed URL
    const youtubeVideoId = await this.getYouTubeVideoId(videoId)
    return `https://www.youtube.com/embed/${youtubeVideoId}`
  }

  private async getYouTubeVideoId(videoId: string): Promise<string> {
    // This would typically fetch from your database
    // For demo purposes, we'll use the videoId as the YouTube ID
    return `demo_${videoId}`
  }

  getVideoPath(videoId: string, filename: string): string {
    return `youtube://video/${videoId}/${filename}`
  }

  getHlsPath(videoId: string): string {
    return `youtube://hls/${videoId}/`
  }

  getThumbnailPath(videoId: string): string {
    return `youtube://thumbnail/${videoId}`
  }

  async generateThumbnailUrl(videoId: string, expiresIn: number = 3600): Promise<string> {
    const youtubeVideoId = await this.getYouTubeVideoId(videoId)
    // YouTube provides standard thumbnail URLs
    return `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
  }

  isConfigured(): boolean {
    return !!(this.youtube && this.oauth2Client)
  }

  getConfig() {
    return {
      provider: 'youtube',
      channelId: this.channelId,
      isConfigured: this.isConfigured()
    }
  }

  // Helper method to get OAuth URL for initial setup
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not configured')
    }

    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  // Helper method to exchange authorization code for tokens
  async getTokens(code: string): Promise<any> {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not configured')
    }

    const { tokens } = await this.oauth2Client.getToken(code)
    return tokens
  }
}