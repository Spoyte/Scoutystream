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
      status: 'uploading',
      createdAt: Date.now(),
      updatedAt: Date.now()
    })

    // Generate pre-signed upload URL
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
  videoId: z.number().positive(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).optional(),
  price: z.number().min(0).max(1000).optional()
})

router.post('/commit', async (req: Request, res: Response) => {
  try {
    const { videoId, title, description, tags = [], price = 5.99 } = uploadCommitSchema.parse(req.body)

    const video = db.getVideo(videoId)
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
    const updatedVideo = db.updateVideo(videoId, {
      title,
      description,
      tags,
      price,
      status: 'processing'
    })

    if (!updatedVideo) {
      return res.status(500).json({ error: 'Failed to update video' })
    }

    // Start background processing (HLS transcoding)
    // For demo, we'll simulate this with a timeout
    setTimeout(async () => {
      try {
        console.log(`🎬 Starting HLS transcoding for video ${videoId}`)
        
        // Simulate transcoding time (2-5 seconds for demo)
        const processingTime = 2000 + Math.random() * 3000
        
        setTimeout(() => {
          // Generate thumbnail URL for demo
          const thumbnailUrl = storageService.generateThumbnailUrl(videoId.toString())
          
          db.updateVideo(videoId, {
            status: 'ready',
            thumbnail: `https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Video+${videoId}`
          })
          
          console.log(`✅ Video ${videoId} processing complete`)
        }, processingTime)
        
      } catch (error) {
        console.error(`❌ Processing failed for video ${videoId}:`, error)
        db.updateVideo(videoId, { status: 'failed' })
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
