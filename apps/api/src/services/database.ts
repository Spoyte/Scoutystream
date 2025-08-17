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
  sport: string
  team?: string
  player?: string
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
        sport: "football",
        team: "Barcelona Youth Academy",
        thumbnail: "https://images.unsplash.com/photo-1518085250887-2f903c200fee?auto=format&fit=crop&w=400&q=60",
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
        sport: "football",
        team: "Manchester United",
        thumbnail: "https://images.unsplash.com/photo-1461896836934-196e2c97256b?auto=format&fit=crop&w=400&q=60",
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
        sport: "football",
        player: "Marcus Rashford",
        team: "Manchester United",
        thumbnail: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 259200000, // 3 days ago
        updatedAt: Date.now() - 259200000,
      },
      {
        title: "Basketball Shooting Drills - 3-Point Training",
        description: "Intensive 3-point shooting session with NBA-level techniques and form analysis.",
        duration: 2100, // 35 minutes
        price: 7.99,
        tags: ["shooting", "3-point", "technique", "professional"],
        sport: "basketball",
        team: "Los Angeles Lakers",
        player: "LeBron James",
        thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 345600000, // 4 days ago
        updatedAt: Date.now() - 345600000,
      },
      {
        title: "Tennis Serve Masterclass",
        description: "Professional tennis serving techniques with slow-motion analysis and footwork breakdown.",
        duration: 3600, // 60 minutes
        price: 15.99,
        tags: ["serve", "technique", "professional", "masterclass"],
        sport: "tennis",
        player: "Novak Djokovic",
        thumbnail: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 432000000, // 5 days ago
        updatedAt: Date.now() - 432000000,
      },
      {
        title: "Football Defense Strategies - Premier League",
        description: "Defensive positioning and tactics used in Premier League matches.",
        duration: 4500, // 75 minutes
        price: 11.99,
        tags: ["defense", "tactics", "premier-league", "professional"],
        sport: "football",
        team: "Liverpool FC",
        thumbnail: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 518400000, // 6 days ago
        updatedAt: Date.now() - 518400000,
      },
      {
        title: "Basketball Fast Break Offense",
        description: "High-speed offensive plays and transition basketball strategies.",
        duration: 1950, // 32.5 minutes
        price: 6.99,
        tags: ["offense", "fast-break", "transition", "strategy"],
        sport: "basketball",
        team: "Golden State Warriors",
        thumbnail: "https://images.unsplash.com/photo-1521412690861-2ddd0a74fe1b?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 604800000, // 7 days ago
        updatedAt: Date.now() - 604800000,
      },
      {
        title: "Tennis Backhand Technique - Clay Court",
        description: "Advanced backhand techniques specifically for clay court play.",
        duration: 2400, // 40 minutes
        price: 9.99,
        tags: ["backhand", "clay-court", "technique", "advanced"],
        sport: "tennis",
        player: "Rafael Nadal",
        thumbnail: "https://images.unsplash.com/photo-1521412644187-123456789abc?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 691200000, // 8 days ago
        updatedAt: Date.now() - 691200000,
      },
      {
        title: "Soccer Goalkeeping Drills - Shot Stopping",
        description: "Focused session on improving reflexes and shot-stopping techniques for goalkeepers.",
        duration: 2700,
        price: 6.49,
        tags: ["goalkeeping", "shot-stopping", "training", "youth"],
        sport: "football",
        player: "Gianluigi Buffon",
        team: "Juventus FC",
        thumbnail: "https://images.unsplash.com/photo-1510853675132-58241c35a47a?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 777600000,
        updatedAt: Date.now() - 777600000,
      },
      {
        title: "Basketball Defense Clinic - Perimeter Lockdown",
        description: "Comprehensive drills to enhance footwork and defensive positioning on the perimeter.",
        duration: 2400,
        price: 7.49,
        tags: ["defense", "perimeter", "clinic", "basketball"],
        sport: "basketball",
        team: "Chicago Bulls",
        thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 820800000,
        updatedAt: Date.now() - 820800000,
      },
      {
        title: "Tennis Volley Drills - Net Dominance",
        description: "High-intensity volley drills to master net play and quick reactions.",
        duration: 2100,
        price: 8.49,
        tags: ["volley", "net-play", "drills", "tennis"],
        sport: "tennis",
        player: "Serena Williams",
        thumbnail: "https://images.unsplash.com/photo-1517960413843-0aee8e2d4898?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 950400000,
        updatedAt: Date.now() - 950400000,
      },
      {
        title: "Football Midfield Passing Patterns",
        description: "Structured drills focusing on triangular passing and movement off the ball.",
        duration: 3000,
        price: 8.99,
        tags: ["passing", "midfield", "patterns", "football"],
        sport: "football",
        team: "FC Barcelona",
        thumbnail: "https://images.unsplash.com/photo-1522621770018-3053653724bf?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 1036800000,
        updatedAt: Date.now() - 1036800000,
      },
      {
        title: "Basketball Free Throw Focus",
        description: "Techniques and mental approach to improve free throw consistency.",
        duration: 1500,
        price: 4.99,
        tags: ["free-throw", "shooting", "focus", "basketball"],
        sport: "basketball",
        team: "San Antonio Spurs",
        thumbnail: "https://images.unsplash.com/photo-1516594798944-bdd6cebb0133?auto=format&fit=crop&w=400&q=60",
        status: "ready",
        createdAt: Date.now() - 1123200000,
        updatedAt: Date.now() - 1123200000,
      },
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

  getAllVideos(filters?: {
    sport?: string
    team?: string
    player?: string
    search?: string
  }): Video[] {
    let videos = Array.from(this.videos.values())

    if (filters) {
      if (filters.sport) {
        videos = videos.filter(video => 
          video.sport.toLowerCase() === filters.sport!.toLowerCase()
        )
      }

      if (filters.team) {
        videos = videos.filter(video => 
          video.team?.toLowerCase().includes(filters.team!.toLowerCase())
        )
      }

      if (filters.player) {
        videos = videos.filter(video => 
          video.player?.toLowerCase().includes(filters.player!.toLowerCase())
        )
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        videos = videos.filter(video => 
          video.title.toLowerCase().includes(searchTerm) ||
          video.description?.toLowerCase().includes(searchTerm) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          video.team?.toLowerCase().includes(searchTerm) ||
          video.player?.toLowerCase().includes(searchTerm)
        )
      }
    }

    return videos.sort((a, b) => b.createdAt - a.createdAt)
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

  // Filter options
  getAvailableSports(): string[] {
    const sports = new Set<string>()
    Array.from(this.videos.values()).forEach(video => {
      if (video.sport) {
        sports.add(video.sport)
      }
    })
    return Array.from(sports).sort()
  }

  getAvailableTeams(sport?: string): string[] {
    const teams = new Set<string>()
    let videos = Array.from(this.videos.values())
    
    if (sport) {
      videos = videos.filter(video => video.sport.toLowerCase() === sport.toLowerCase())
    }
    
    videos.forEach(video => {
      if (video.team) {
        teams.add(video.team)
      }
    })
    return Array.from(teams).sort()
  }

  getAvailablePlayers(sport?: string, team?: string): string[] {
    const players = new Set<string>()
    let videos = Array.from(this.videos.values())
    
    if (sport) {
      videos = videos.filter(video => video.sport.toLowerCase() === sport.toLowerCase())
    }
    
    if (team) {
      videos = videos.filter(video => 
        video.team?.toLowerCase().includes(team.toLowerCase())
      )
    }
    
    videos.forEach(video => {
      if (video.player) {
        players.add(video.player)
      }
    })
    return Array.from(players).sort()
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
      },
      videosBySport: this.getAvailableSports().reduce((acc, sport) => {
        acc[sport] = this.getAllVideos({ sport }).length
        return acc
      }, {} as Record<string, number>)
    }
  }
}

export const db = new DatabaseService()
