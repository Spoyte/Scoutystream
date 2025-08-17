import { Router, Request, Response, type IRouter } from 'express'
import { storageService } from '../services/storage.js'

const router: IRouter = Router()

// Get current storage provider information
router.get('/info', async (req: Request, res: Response) => {
  try {
    const config = storageService.getConfig()
    
    res.json({
      success: true,
      storage: {
        provider: config.currentProvider,
        name: config.name,
        isConfigured: config.providerConfig.isConfigured,
        config: config.providerConfig
      }
    })
  } catch (error) {
    console.error('Error getting storage info:', error)
    res.status(500).json({ error: 'Failed to get storage information' })
  }
})

// YouTube OAuth flow - Get authorization URL
router.get('/youtube/auth-url', async (req: Request, res: Response) => {
  try {
    const authUrl = storageService.getYouTubeAuthUrl()
    
    res.json({
      success: true,
      authUrl,
      message: 'Visit this URL to authorize YouTube access'
    })
  } catch (error) {
    console.error('Error getting YouTube auth URL:', error)
    res.status(500).json({ 
      error: 'Failed to get YouTube authorization URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// YouTube OAuth flow - Exchange code for tokens
router.post('/youtube/tokens', async (req: Request, res: Response) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' })
    }
    
    const tokens = await storageService.getYouTubeTokens(code)
    
    res.json({
      success: true,
      tokens,
      message: 'Tokens obtained successfully. Save the refresh_token in your environment variables.'
    })
  } catch (error) {
    console.error('Error exchanging YouTube code for tokens:', error)
    res.status(500).json({ 
      error: 'Failed to exchange code for tokens',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Walrus network information
router.get('/walrus/info', async (req: Request, res: Response) => {
  try {
    const networkInfo = await storageService.getWalrusNetworkInfo()
    
    res.json({
      success: true,
      networkInfo,
      message: 'Walrus network information retrieved successfully'
    })
  } catch (error) {
    console.error('Error getting Walrus network info:', error)
    res.status(500).json({ 
      error: 'Failed to get Walrus network information',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Walrus blob information
router.get('/walrus/blob/:blobId', async (req: Request, res: Response) => {
  try {
    const { blobId } = req.params
    
    if (!blobId) {
      return res.status(400).json({ error: 'Blob ID is required' })
    }
    
    const blobInfo = await storageService.getWalrusBlobInfo(blobId)
    
    res.json({
      success: true,
      blobId,
      blobInfo,
      message: 'Blob information retrieved successfully'
    })
  } catch (error) {
    console.error('Error getting Walrus blob info:', error)
    res.status(500).json({ 
      error: 'Failed to get blob information',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Test storage provider connectivity
router.get('/test', async (req: Request, res: Response) => {
  try {
    const config = storageService.getConfig()
    const isConfigured = storageService.isConfigured()
    
    // Generate a test URL to verify connectivity
    const testVideoId = 'test-123'
    const testFilename = 'test-video.mp4'
    
    let testResults: any = {
      provider: config.currentProvider,
      name: config.name,
      isConfigured,
      tests: {}
    }
    
    try {
      // Test upload URL generation
      const uploadUrl = await storageService.generateUploadUrl(
        testVideoId, 
        testFilename, 
        'video/mp4'
      )
      testResults.tests.uploadUrl = {
        success: true,
        url: uploadUrl
      }
    } catch (error) {
      testResults.tests.uploadUrl = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    try {
      // Test thumbnail URL generation
      const thumbnailUrl = await storageService.generateThumbnailUrl(testVideoId)
      testResults.tests.thumbnailUrl = {
        success: true,
        url: thumbnailUrl
      }
    } catch (error) {
      testResults.tests.thumbnailUrl = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    // Provider-specific tests
    if (config.currentProvider === 'walrus') {
      try {
        const networkInfo = await storageService.getWalrusNetworkInfo()
        testResults.tests.walrusNetwork = {
          success: true,
          info: networkInfo
        }
      } catch (error) {
        testResults.tests.walrusNetwork = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    res.json({
      success: true,
      testResults,
      message: 'Storage provider test completed'
    })
  } catch (error) {
    console.error('Error testing storage provider:', error)
    res.status(500).json({ 
      error: 'Failed to test storage provider',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export { router as storageRoutes }