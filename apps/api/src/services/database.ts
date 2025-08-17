// Simple in-memory database for demo purposes
// In production, this would be replaced with a real database

export interface Video {
  id: number
  title: string
  description?: string
  filename?: string
  duration?: number
  price: number
  tags: string[]
  thumbnail?: string
  status: 'uploading' | 'processing' | 'ready' | 'failed'
  createdAt: number
  updatedAt: number
}

export interface AccessRecord {
  userId: string
  videoId: number
  grantedAt: number
  transactionId?: string
}

class DatabaseService {
  private videos: Map<number, Video> = new Map()
  private accessRecords: AccessRecord[] = []
  private nextVideoId = 1

  constructor() {
    // Initialize with some demo data
    this.seedData()
  }

  private seedData() {
    const demoVideos: Omit<Video, 'id'>[] = [
      {
        title: "Youth Training Session - Ball Control",
        description: "Professional youth training focusing on ball control techniques and first touch improvements.",
        duration: 1800, // 30 minutes
        price: 5.99,
        tags: ["youth", "ball-control", "training", "fundamentals"],
        status: "ready",
        createdAt: Date.now() - 86400000, // 1 day ago
        updatedAt: Date.now() - 86400000,
      },
      {
        title: "Professional Scrimmage - Tactical Analysis",
        description: "Full 90-minute scrimmage between professional teams with tactical breakdowns.",
        duration: 5400, // 90 minutes
        price: 12.99,
        tags: ["professional", "tactics", "scrimmage", "analysis"],
        status: "ready",
        createdAt: Date.now() - 172800000, // 2 days ago
        updatedAt: Date.now() - 172800000,
      },
      {
        title: "Individual Skills Training - Dribbling",
        description: "One-on-one coaching session focusing on advanced dribbling techniques.",
        duration: 2700, // 45 minutes
        price: 8.99,
        tags: ["individual", "dribbling", "skills", "advanced"],
        status: "ready",
        createdAt: Date.now() - 259200000, // 3 days ago
        updatedAt: Date.now() - 259200000,
      }
    ]

    demoVideos.forEach(video => {
      this.createVideo(video)
    })

    console.log(`🗄️  Initialized database with ${this.videos.size} demo videos`)
  }

  // Video operations
  createVideo(videoData: Omit<Video, 'id'>): Video {
    const video: Video = {
      id: this.nextVideoId++,
      ...videoData,
    }
    
    this.videos.set(video.id, video)
    console.log(`📝 Created video: ${video.title} (ID: ${video.id})`)
    return video
  }

  getVideo(id: number): Video | undefined {
    return this.videos.get(id)
  }

  getAllVideos(): Video[] {
    return Array.from(this.videos.values()).sort((a, b) => b.createdAt - a.createdAt)
  }

  updateVideo(id: number, updates: Partial<Video>): Video | undefined {
    const video = this.videos.get(id)
    if (!video) return undefined

    const updatedVideo = {
      ...video,
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: Date.now()
    }

    this.videos.set(id, updatedVideo)
    console.log(`📝 Updated video: ${updatedVideo.title} (ID: ${id})`)
    return updatedVideo
  }

  deleteVideo(id: number): boolean {
    const deleted = this.videos.delete(id)
    if (deleted) {
      // Also remove access records
      this.accessRecords = this.accessRecords.filter(record => record.videoId !== id)
      console.log(`🗑️  Deleted video ID: ${id}`)
    }
    return deleted
  }

  // Access control operations
  grantAccess(userId: string, videoId: number, transactionId?: string): void {
    // Remove existing access record if any
    this.accessRecords = this.accessRecords.filter(
      record => !(record.userId === userId && record.videoId === videoId)
    )

    // Add new access record
    const accessRecord: AccessRecord = {
      userId,
      videoId,
      grantedAt: Date.now(),
      transactionId
    }

    this.accessRecords.push(accessRecord)
    console.log(`🔓 Granted access: ${userId} -> video ${videoId}`)
  }

  checkAccess(userId: string, videoId: number): boolean {
    const hasAccess = this.accessRecords.some(
      record => record.userId === userId && record.videoId === videoId
    )
    return hasAccess
  }

  revokeAccess(userId: string, videoId: number): boolean {
    const initialLength = this.accessRecords.length
    this.accessRecords = this.accessRecords.filter(
      record => !(record.userId === userId && record.videoId === videoId)
    )
    
    const revoked = this.accessRecords.length < initialLength
    if (revoked) {
      console.log(`🔒 Revoked access: ${userId} -> video ${videoId}`)
    }
    return revoked
  }

  getUserAccess(userId: string): AccessRecord[] {
    return this.accessRecords.filter(record => record.userId === userId)
  }

  getVideoAccess(videoId: number): AccessRecord[] {
    return this.accessRecords.filter(record => record.videoId === videoId)
  }

  // Statistics
  getStats() {
    return {
      totalVideos: this.videos.size,
      totalAccessRecords: this.accessRecords.length,
      videosByStatus: {
        ready: Array.from(this.videos.values()).filter(v => v.status === 'ready').length,
        processing: Array.from(this.videos.values()).filter(v => v.status === 'processing').length,
        uploading: Array.from(this.videos.values()).filter(v => v.status === 'uploading').length,
        failed: Array.from(this.videos.values()).filter(v => v.status === 'failed').length,
      }
    }
  }
}

export const db = new DatabaseService()
