import { Router, Request, Response, type IRouter } from 'express'
import { z } from 'zod'
import { db } from '../services/database.js'
import { chilizService } from '../services/chiliz.js'
import { storageService } from '../services/storage.js'
import { paymentService } from '../services/payments.js'

const router: IRouter = Router()

// Get all videos (public metadata) with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { sport, team, player, search } = req.query
    
    const filters = {
      sport: sport as string,
      team: team as string,
      player: player as string,
      search: search as string
    }

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key as keyof typeof filters]) {
        delete filters[key as keyof typeof filters]
      }
    })

    const videos = db.getAllVideos(Object.keys(filters).length > 0 ? filters : undefined)
    
    // Return public metadata only
    const publicVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      price: video.price,
      tags: video.tags,
      sport: video.sport,
      team: video.team,
      player: video.player,
      thumbnail: video.thumbnail,
      status: video.status,
      createdAt: video.createdAt
    }))

    res.json(publicVideos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    res.status(500).json({ error: 'Failed to fetch videos' })
  }
})

// Get specific video with access status
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id)
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    // Get user address from query params or headers
    const userAddress = req.query.address as string || req.headers['x-user-address'] as string

    let hasAccess = false
    if (userAddress) {
      // Check both local database and blockchain
      const localAccess = db.checkAccess(userAddress, videoId)
      const blockchainAccess = await chilizService.checkAccess(userAddress, videoId)
      hasAccess = localAccess || blockchainAccess
    }

    const videoWithAccess = {
      ...video,
      hasAccess
    }

    res.json(videoWithAccess)
  } catch (error) {
    console.error('Error fetching video:', error)
    res.status(500).json({ error: 'Failed to fetch video' })
  }
})

// Get video manifest (protected endpoint)
router.get('/:id/manifest', async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id)
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    if (video.status !== 'ready') {
      return res.status(400).json({ error: 'Video not ready for streaming' })
    }

    // Get user address from query params or headers
    const userAddress = req.query.address as string || req.headers['x-user-address'] as string

    if (!userAddress) {
      return res.status(400).json({ error: 'User address required' })
    }

    // Check access
    const localAccess = db.checkAccess(userAddress, videoId)
    const blockchainAccess = await chilizService.checkAccess(userAddress, videoId)
    const hasAccess = localAccess || blockchainAccess

    if (!hasAccess) {
      // Return 402 Payment Required with challenge
      const challenge = paymentService.generate402Challenge(videoId, video.price)
      
      res.status(402)
      Object.entries(challenge.headers).forEach(([key, value]) => {
        res.setHeader(key, value)
      })
      
      return res.json({
        error: 'payment_required',
        message: 'Payment required to access this video',
        price: video.price,
        videoId: videoId
      })
    }

    // Provider-specific manifest/stream info
    if (video.provider === 'youtube' && video.youtubeId) {
      return res.json({
        provider: 'youtube',
        youtubeId: video.youtubeId,
        videoId,
      })
    }

    // Generate pre-signed URL for HLS manifest (AWS or Walrus)
    const manifestUrl = await storageService.generateHlsManifestUrl(videoId.toString())
    
    res.json({
      provider: storageService.getProvider(),
      manifestUrl,
      videoId,
      expiresIn: 300 // 5 minutes
    })
  } catch (error) {
    console.error('Error getting video manifest:', error)
    res.status(500).json({ error: 'Failed to get video manifest' })
  }
})

// Get video frames for AI analysis (protected endpoint)
router.get('/:id/frames', async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id)
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    // Get user address and check access
    const userAddress = req.query.address as string || req.headers['x-user-address'] as string
    if (!userAddress) {
      return res.status(400).json({ error: 'User address required' })
    }

    const localAccess = db.checkAccess(userAddress, videoId)
    const blockchainAccess = await chilizService.checkAccess(userAddress, videoId)
    const hasAccess = localAccess || blockchainAccess

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied. Purchase video first.' })
    }

    // For demo, return mock frame data
    // In production, this would extract actual frames using ffmpeg
    const fps = parseInt(req.query.fps as string) || 1
    const mockFrames = Array.from({ length: Math.min(10, Math.floor((video.duration || 60) / fps)) }, (_, i) => ({
      timestamp: i * fps,
      url: `https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Frame+${i + 1}`,
      frame_number: i + 1
    }))

    res.json({
      videoId,
      frames: mockFrames,
      fps,
      totalFrames: mockFrames.length
    })
  } catch (error) {
    console.error('Error getting video frames:', error)
    res.status(500).json({ error: 'Failed to get video frames' })
  }
})

// Get video captions (protected endpoint)
router.get('/:id/captions', async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id)
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    // Check access
    const userAddress = req.query.address as string || req.headers['x-user-address'] as string
    if (!userAddress) {
      return res.status(400).json({ error: 'User address required' })
    }

    const localAccess = db.checkAccess(userAddress, videoId)
    const blockchainAccess = await chilizService.checkAccess(userAddress, videoId)
    const hasAccess = localAccess || blockchainAccess

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied. Purchase video first.' })
    }

    // For demo, return mock captions
    // In production, this would serve actual WebVTT/SRT files
    const mockCaptions = `WEBVTT

00:00:00.000 --> 00:00:05.000
Training session begins with warm-up exercises

00:00:05.000 --> 00:00:10.000
Players focus on ball control fundamentals

00:00:10.000 --> 00:00:15.000
Coach demonstrates proper first touch technique`

    res.setHeader('Content-Type', 'text/vtt')
    res.send(mockCaptions)
  } catch (error) {
    console.error('Error getting video captions:', error)
    res.status(500).json({ error: 'Failed to get video captions' })
  }
})

// Mock purchase endpoint (for development)
router.post('/:id/purchase', async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id)
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    // Get user address
    const userAddress = req.body.userAddress || req.query.address as string || req.headers['x-user-address'] as string
    if (!userAddress) {
      return res.status(400).json({ error: 'User address required' })
    }

    // Simulate payment processing
    console.log(`💰 Processing mock purchase: ${userAddress} -> video ${videoId}`)
    
    // Grant access locally
    db.grantAccess(userAddress, videoId, 'mock_' + Date.now())
    
    // Grant access on blockchain
    await chilizService.grantAccess(userAddress, videoId)

    res.json({
      success: true,
      message: 'Purchase successful',
      videoId,
      userAddress,
      transactionId: 'mock_' + Date.now()
    })
  } catch (error) {
    console.error('Error processing purchase:', error)
    res.status(500).json({ error: 'Purchase failed' })
  }
})

// Get available filter options
router.get('/filters/sports', async (req: Request, res: Response) => {
  try {
    const sports = db.getAvailableSports()
    res.json(sports)
  } catch (error) {
    console.error('Error fetching sports:', error)
    res.status(500).json({ error: 'Failed to fetch sports' })
  }
})

router.get('/filters/teams', async (req: Request, res: Response) => {
  try {
    const { sport } = req.query
    const teams = db.getAvailableTeams(sport as string)
    res.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
})

router.get('/filters/players', async (req: Request, res: Response) => {
  try {
    const { sport, team } = req.query
    const players = db.getAvailablePlayers(sport as string, team as string)
    res.json(players)
  } catch (error) {
    console.error('Error fetching players:', error)
    res.status(500).json({ error: 'Failed to fetch players' })
  }
})

export { router as videoRoutes }
