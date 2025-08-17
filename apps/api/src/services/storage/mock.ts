import { StorageProvider } from './interface.js'

export class MockStorageProvider implements StorageProvider {
  async generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    console.log(`📤 Mock upload URL requested for ${filename}`)
    return `https://mock-storage.example.com/upload/${videoId}/${filename}?expires=${Date.now() + expiresIn * 1000}`
  }

  async generateDownloadUrl(
    path: string,
    expiresIn: number = 300
  ): Promise<string> {
    console.log(`📥 Mock download URL requested for ${path}`)
    return `https://mock-storage.example.com/download/${path}?expires=${Date.now() + expiresIn * 1000}`
  }

  async generateHlsManifestUrl(
    videoId: string,
    expiresIn: number = 300
  ): Promise<string> {
    console.log(`📺 Mock HLS manifest URL requested for ${videoId}`)
    return `https://mock-storage.example.com/hls/${videoId}/playlist.m3u8?expires=${Date.now() + expiresIn * 1000}`
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

  async generateThumbnailUrl(
    videoId: string,
    expiresIn: number = 3600
  ): Promise<string> {
    console.log(`🖼️  Mock thumbnail URL requested for ${videoId}`)
    return `https://mock-storage.example.com/thumbnails/${videoId}/thumbnail.jpg?expires=${Date.now() + expiresIn * 1000}`
  }

  isConfigured(): boolean {
    return true // Mock is always configured
  }

  getConfig(): Record<string, any> {
    return {
      provider: 'mock',
      isConfigured: true,
      note: 'This is a mock storage provider for development'
    }
  }
}