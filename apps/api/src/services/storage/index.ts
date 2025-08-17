export { StorageFactory } from './factory.js'
export { StorageProvider } from './interface.js'
export { AWSStorageProvider } from './aws.js'
export { YouTubeStorageProvider } from './youtube.js'
export { WalrusStorageProvider } from './walrus.js'
export { MockStorageProvider } from './mock.js'

// Legacy export for backward compatibility
export { StorageFactory as storageService } from './factory.js'