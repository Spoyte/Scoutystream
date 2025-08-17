// This file is kept for backward compatibility
// New code should use the storage factory directly

import { StorageFactory } from './storage/factory.js'

// Re-export the storage service methods for backward compatibility
const storageProvider = StorageFactory.getStorageProvider()

export const storageService = {
  generateUploadUrl: (videoId: string, filename: string, contentType: string, expiresIn?: number) =>
    storageProvider.generateUploadUrl(videoId, filename, contentType, expiresIn),
    
  generateDownloadUrl: (path: string, expiresIn?: number) =>
    storageProvider.generateDownloadUrl(path, expiresIn),
    
  generateHlsManifestUrl: (videoId: string, expiresIn?: number) =>
    storageProvider.generateHlsManifestUrl(videoId, expiresIn),
    
  generateThumbnailUrl: (videoId: string, expiresIn?: number) =>
    storageProvider.generateThumbnailUrl(videoId, expiresIn),
    
  getVideoPath: (videoId: string, filename: string) =>
    storageProvider.getVideoPath(videoId, filename),
    
  getHlsPath: (videoId: string) =>
    storageProvider.getHlsPath(videoId),
    
  getThumbnailPath: (videoId: string) =>
    storageProvider.getThumbnailPath(videoId),
    
  isConfigured: () => StorageFactory.isStorageConfigured(),
  
  getConfig: () => StorageFactory.getStorageConfig()
}
