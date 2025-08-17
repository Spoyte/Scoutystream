import { StorageProvider } from './interface.js'
import { AWSStorageProvider } from './aws.js'
import { YouTubeStorageProvider } from './youtube.js'
import { WalrusStorageProvider } from './walrus.js'
import { MockStorageProvider } from './mock.js'
import { config } from '../../config/index.js'

export class StorageFactory {
  private static instance: StorageProvider | null = null

  static getStorageProvider(): StorageProvider {
    if (this.instance) {
      return this.instance
    }

    const provider = config.STORAGE_PROVIDER

    switch (provider) {
      case 'aws':
        this.instance = new AWSStorageProvider()
        console.log('🔧 Using AWS S3 storage provider')
        break
        
      case 'youtube':
        this.instance = new YouTubeStorageProvider()
        console.log('🔧 Using YouTube storage provider')
        break
        
      case 'walrus':
        this.instance = new WalrusStorageProvider()
        console.log('🔧 Using Walrus/MinIO storage provider')
        break
        
      case 'mock':
      default:
        this.instance = new MockStorageProvider()
        console.log('🔧 Using Mock storage provider')
        break
    }

    return this.instance
  }

  static getStorageConfig(): Record<string, any> {
    const provider = this.getStorageProvider()
    return provider.getConfig()
  }

  static isStorageConfigured(): boolean {
    const provider = this.getStorageProvider()
    return provider.isConfigured()
  }
}