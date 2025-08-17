import { Router } from 'express'
import { StorageFactory } from '../services/storage/factory.js'

const router: Router = Router()

// GET /api/storage/config - Get current storage configuration
router.get('/config', (req, res) => {
  try {
    const config = StorageFactory.getStorageConfig()
    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error getting storage config:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get storage configuration'
    })
  }
})

// GET /api/storage/status - Get storage provider status
router.get('/status', (req, res) => {
  try {
    const isConfigured = StorageFactory.isStorageConfigured()
    const provider = StorageFactory.getStorageProvider()
    
    res.json({
      success: true,
      data: {
        isConfigured,
        provider: provider.constructor.name,
        config: provider.getConfig()
      }
    })
  } catch (error) {
    console.error('❌ Error getting storage status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get storage status'
    })
  }
})

// POST /api/storage/test - Test storage provider connectivity
router.post('/test', async (req, res) => {
  try {
    const provider = StorageFactory.getStorageProvider()
    
    if (!provider.isConfigured()) {
      return res.status(400).json({
        success: false,
        error: 'Storage provider not configured'
      })
    }

    // Test basic functionality
    const testVideoId = 'test-' + Date.now()
    const testFilename = 'test.txt'
    
    try {
      const uploadUrl = await provider.generateUploadUrl(
        testVideoId,
        testFilename,
        'text/plain',
        300
      )
      
      res.json({
        success: true,
        data: {
          message: 'Storage provider test successful',
          uploadUrl,
          provider: provider.constructor.name
        }
      })
    } catch (testError) {
      res.status(500).json({
        success: false,
        error: 'Storage provider test failed',
        details: testError instanceof Error ? testError.message : 'Unknown error'
      })
    }
  } catch (error) {
    console.error('❌ Error testing storage provider:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to test storage provider'
    })
  }
})

export default router