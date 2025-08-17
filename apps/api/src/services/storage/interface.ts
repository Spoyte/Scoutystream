export interface StorageProvider {
  generateUploadUrl(
    videoId: string,
    filename: string,
    contentType: string,
    expiresIn?: number
  ): Promise<string>
  
  generateDownloadUrl(
    path: string,
    expiresIn?: number
  ): Promise<string>
  
  generateHlsManifestUrl(
    videoId: string,
    expiresIn?: number
  ): Promise<string>
  
  generateThumbnailUrl(
    videoId: string,
    expiresIn?: number
  ): Promise<string>
  
  getVideoPath(videoId: string, filename: string): string
  getHlsPath(videoId: string): string
  getThumbnailPath(videoId: string): string
  
  isConfigured(): boolean
  getConfig(): Record<string, any>
  
  // YouTube-specific methods
  uploadToYouTube?(videoId: string, filePath: string, metadata: any): Promise<string>
  getYouTubeVideoUrl?(videoId: string): Promise<string>
}