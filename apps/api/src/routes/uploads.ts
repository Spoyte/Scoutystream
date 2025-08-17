import { Router, Request, Response, type IRouter } from 'express'
import { z } from 'zod'
import { db } from '../services/database.js'
import { storageService } from '../services/storage.js'

const router: IRouter = Router()

// Request upload URL
const uploadRequestSchema = z.object({
  filename: z.string().min(1),
  size: z.number().positive(),
  mimeType: z.string().startsWith('video/')
})

router.post('/request', async (req: Request, res: Response) => {
  try {
    if (storageService.getProvider() === 'youtube') {
      return res.status(400).json({ 
        error: 'unsupported',
        message: 'YouTube provider does not support direct uploads. Use /commit with youtubeId or youtubeUrl.'
      })
    }

    const { filename, size, mimeType } = uploadRequestSchema.parse(req.body)

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024
    if (size > maxSize) {
      return res.status(400).json({ 
        error: 'File too large', 
        message: 'Maximum file size is 500MB',
        maxSize 
      })
    }

    // Create video record
    const video = db.createVideo({
      title: filename.replace(/\.[^/.]+$/, ''), // Remove extension for default title
      description: '',
      filename,
      price: 5.99, // Default price
      tags: [],
      sport: 'other', // Default sport, will be updated during commit
      status: 'uploading',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      provider: storageService.getProvider(),
    })

    // Generate upload URL (AWS or Walrus)
    const uploadUrl = await storageService.generateUploadUrl(
      video.id.toString(),
      filename,
      mimeType,
      3600 // 1 hour expiry
    )

    res.json({
      videoId: video.id,
      uploadUrl,
      expiresIn: 3600
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.errors 
      })
    }

    console.error('Error creating upload request:', error)
    res.status(500).json({ error: 'Failed to create upload request' })
  }
})

// Commit upload and save metadata
const uploadCommitSchema = z.object({
  videoId: z.number().positive().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).optional(),
  sport: z.string().min(1).max(50),
  team: z.string().max(100).optional(),
  player: z.string().max(100).optional(),
  price: z.number().min(0).max(1000).optional(),
  // YouTube specific
  youtubeId: z.string().optional(),
  youtubeUrl: z.string().url().optional(),
})

function extractYoutubeIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1) || null
    }
    if (u.searchParams.get('v')) {
      return u.searchParams.get('v')
    }
    // Short embed or other formats
    const parts = u.pathname.split('/').filter(Boolean)
    const idx = parts.findIndex(p => p === 'embed' || p === 'shorts' || p === 'v')
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
  } catch {}
  return null
}

router.post('/commit', async (req: Request, res: Response) => {
  try {
    const body = uploadCommitSchema.parse(req.body)
    const provider = storageService.getProvider()

    if (provider === 'youtube') {
      // Allow creating without prior /request
      let youtubeId = body.youtubeId
      if (!youtubeId && body.youtubeUrl) {
        youtubeId = extractYoutubeIdFromUrl(body.youtubeUrl) || undefined
      }
      if (!youtubeId) {
        return res.status(400).json({ error: 'YouTube ID or URL required' })
      }

      const video = body.videoId ? db.getVideo(body.videoId) : undefined
      const now = Date.now()
      const baseData = {
        title: body.title,
        description: body.description || '',
        tags: body.tags || [],
        sport: body.sport,
        team: body.team,
        player: body.player,
        price: body.price ?? 5.99,
        status: 'ready' as const,
        createdAt: now,
        updatedAt: now,
        provider: 'youtube' as const,
        youtubeId,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      }

      let saved
      if (!video) {
        saved = db.createVideo(baseData)
      } else {
        saved = db.updateVideo(video.id, baseData)!
      }

      return res.json({
        success: true,
        message: 'YouTube video saved successfully',
        video: saved,
      })
    }

    // Non-YouTube flow requires a valid existing videoId created at /request
    if (!body.videoId) {
      return res.status(400).json({ error: 'videoId is required for non-YouTube providers' })
    }

    const video = db.getVideo(body.videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    if (video.status !== 'uploading') {
      return res.status(400).json({ 
        error: 'Invalid video status', 
        currentStatus: video.status 
      })
    }

    // Update video metadata
    const updatedVideo = db.updateVideo(body.videoId, {
      title: body.title,
      description: body.description,
      tags: body.tags || [],
      sport: body.sport,
      team: body.team,
      player: body.player,
      price: body.price ?? 5.99,
      provider,
      status: 'processing'
    })

    if (!updatedVideo) {
      return res.status(500).json({ error: 'Failed to update video' })
    }

    // Start background processing (HLS transcoding)
    setTimeout(async () => {
      try {
        console.log(`🎬 Starting HLS transcoding for video ${body.videoId}`)
        const processingTime = 2000 + Math.random() * 3000
        setTimeout(() => {
          db.updateVideo(body.videoId!, {
            status: 'ready',
            thumbnail: `https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Video+${body.videoId}`
          })
          console.log(`✅ Video ${body.videoId} processing complete`)
        }, processingTime)
      } catch (error) {
        console.error(`❌ Processing failed for video ${body.videoId}:`, error)
        db.updateVideo(body.videoId!, { status: 'failed' })
      }
    }, 1000)

    res.json({
      success: true,
      message: 'Upload committed successfully',
      video: updatedVideo
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: error.errors 
      })
    }

    console.error('Error committing upload:', error)
    res.status(500).json({ error: 'Failed to commit upload' })
  }
})

// Get upload status
router.get('/status/:videoId', async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.videoId)
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' })
    }

    const video = db.getVideo(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    res.json({
      videoId,
      status: video.status,
      title: video.title,
      updatedAt: video.updatedAt
    })
  } catch (error) {
    console.error('Error getting upload status:', error)
    res.status(500).json({ error: 'Failed to get upload status' })
  }
})

export { router as uploadRoutes }
