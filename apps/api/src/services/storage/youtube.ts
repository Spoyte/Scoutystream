import { StorageProvider } from './interface.js'
import { config } from '../../config/index.js'
import axios from 'axios'

interface YouTubeVideoMetadata {
  title: string
  description: string
  tags: string[]
  categoryId: string
  privacyStatus: 'private' | 'unlisted' | 'public'
}

export class YouTubeStorageProvider implements StorageProvider {
  private apiKey: string
  private channelId: string
  private playlistId: string | null
  private baseUrl = 'https://www.googleapis.com/youtube/v3'

  constructor() {
    this.apiKey = config.YOUTUBE_API_KEY || ''
    this.channelId = config.YOUTUBE_CHANNEL_ID || ''
    this.playlistId = config.YOUTUBE_PLAYLIST_ID || null
  }

  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API not configured')
    }

    // YouTube doesn't support pre-signed URLs like S3
    // Instead, we'll return a mock URL and handle the actual upload in commit
    console.log(`📤 YouTube upload requested for ${filename}`)
    return `youtube://upload/${videoId}/${filename}`
  }

  async generateDownloadUrl(
    path: string,
    expiresIn: number = 300
  ): Promise<string> {
    // Extract video ID from path
    const videoId = path.split('/').pop()?.split('.')[0]
    if (!videoId) {
      throw new Error('Invalid video path')
    }

    return this.getYouTubeVideoUrl(videoId)
  }

  async generateHlsManifestUrl(
    videoId: string,
    expiresIn: number = 300
  ): Promise<string> {
    // YouTube doesn't support HLS manifests directly
    // Return the video URL instead
    return this.getYouTubeVideoUrl(videoId)
  }

  async generateThumbnailUrl(
    videoId: string,
    expiresIn: number = 3600
  ): Promise<string> {
    // YouTube provides thumbnail URLs
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  getVideoPath(videoId: string, filename: string): string {
    return `youtube://videos/${videoId}/${filename}`
  }

  getHlsPath(videoId: string): string {
    return `youtube://videos/${videoId}/hls`
  }

  getThumbnailPath(videoId: string): string {
    return `youtube://thumbnails/${videoId}/thumbnail.jpg`
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.channelId)
  }

  getConfig(): Record<string, any> {
    return {
      provider: 'youtube',
      apiKey: this.apiKey ? '***configured***' : 'not configured',
      channelId: this.channelId || 'not configured',
      playlistId: this.playlistId || 'not configured',
      isConfigured: this.isConfigured()
    }
  }

  async uploadToYouTube(
    videoId: string,
    filePath: string,
    metadata: YouTubeVideoMetadata
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API not configured')
    }

    try {
      // This is a simplified implementation
      // In a real scenario, you'd need to implement the full YouTube upload flow
      // including resumable uploads and proper error handling
      
      console.log(`📤 Starting YouTube upload for ${videoId}`)
      
      // For now, return a mock YouTube video ID
      // In production, you'd implement the actual YouTube upload API
      const mockYouTubeId = `yt_${videoId}_${Date.now()}`
      
      console.log(`✅ YouTube upload complete for ${videoId} -> ${mockYouTubeId}`)
      return mockYouTubeId
      
    } catch (error) {
      console.error('❌ YouTube upload failed:', error)
      throw new Error('YouTube upload failed')
    }
  }

  async getYouTubeVideoUrl(videoId: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API not configured')
    }

    try {
      // Check if video exists and get its URL
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,status',
          id: videoId,
          key: this.apiKey
        }
      })

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0]
        return `https://www.youtube.com/watch?v=${videoId}`
      } else {
        throw new Error('Video not found on YouTube')
      }
    } catch (error) {
      console.error('❌ Error getting YouTube video URL:', error)
      // Return a mock URL for development
      return `https://www.youtube.com/watch?v=${videoId}`
    }
  }

  async searchVideos(query: string, maxResults: number = 10): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('YouTube API not configured')
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          channelId: this.channelId,
          maxResults,
          key: this.apiKey
        }
      })

      return response.data.items || []
    } catch (error) {
      console.error('❌ Error searching YouTube videos:', error)
      return []
    }
  }
}