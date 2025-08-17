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
      // Football/Soccer Videos
      {
        title: "Youth Training Session - Ball Control",
        description: "Professional youth training focusing on ball control techniques and first touch improvements.",
        duration: 1800, // 30 minutes
        price: 5.99,
        tags: ["youth", "ball-control", "training", "fundamentals"],
        sport: "football",
        team: "Barcelona Youth Academy",
        thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=640&h=360&fit=crop&crop=center",
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
        thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=640&h=360&fit=crop&crop=center",
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
        thumbnail: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 259200000, // 3 days ago
        updatedAt: Date.now() - 259200000,
      },
      {
        title: "Football Defense Strategies - Premier League",
        description: "Defensive positioning and tactics used in Premier League matches.",
        duration: 4500, // 75 minutes
        price: 11.99,
        tags: ["defense", "tactics", "premier-league", "professional"],
        sport: "football",
        team: "Liverpool FC",
        thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 518400000, // 6 days ago
        updatedAt: Date.now() - 518400000,
      },
      {
        title: "Champions League Final Preparation",
        description: "Exclusive behind-the-scenes footage of team preparation for the Champions League final.",
        duration: 3200, // 53 minutes
        price: 18.99,
        tags: ["champions-league", "preparation", "exclusive", "behind-the-scenes"],
        sport: "football",
        team: "Real Madrid",
        player: "Karim Benzema",
        thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 345600000, // 4 days ago
        updatedAt: Date.now() - 345600000,
      },
      {
        title: "Women's Football - Attacking Strategies",
        description: "Modern attacking formations and strategies from the Women's World Cup.",
        duration: 2800, // 46 minutes
        price: 9.99,
        tags: ["womens-football", "attacking", "world-cup", "strategy"],
        sport: "football",
        team: "England Women's Team",
        player: "Lucy Bronze",
        thumbnail: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 432000000, // 5 days ago
        updatedAt: Date.now() - 432000000,
      },
      
      // Basketball Videos
      {
        title: "Basketball Shooting Drills - 3-Point Training",
        description: "Intensive 3-point shooting session with NBA-level techniques and form analysis.",
        duration: 2100, // 35 minutes
        price: 7.99,
        tags: ["shooting", "3-point", "technique", "professional"],
        sport: "basketball",
        team: "Los Angeles Lakers",
        player: "LeBron James",
        thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 604800000, // 7 days ago
        updatedAt: Date.now() - 604800000,
      },
      {
        title: "Basketball Fast Break Offense",
        description: "High-speed offensive plays and transition basketball strategies.",
        duration: 1950, // 32.5 minutes
        price: 6.99,
        tags: ["offense", "fast-break", "transition", "strategy"],
        sport: "basketball",
        team: "Golden State Warriors",
        thumbnail: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 691200000, // 8 days ago
        updatedAt: Date.now() - 691200000,
      },
      {
        title: "NBA Playoffs - Clutch Performance Analysis",
        description: "Breaking down clutch moments and decision-making in high-pressure playoff situations.",
        duration: 4200, // 70 minutes
        price: 14.99,
        tags: ["playoffs", "clutch", "analysis", "pressure"],
        sport: "basketball",
        team: "Boston Celtics",
        player: "Jayson Tatum",
        thumbnail: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 777600000, // 9 days ago
        updatedAt: Date.now() - 777600000,
      },
      {
        title: "Youth Basketball Fundamentals",
        description: "Essential basketball skills for young players: dribbling, passing, and basic footwork.",
        duration: 2400, // 40 minutes
        price: 4.99,
        tags: ["youth", "fundamentals", "basics", "development"],
        sport: "basketball",
        team: "Duke Blue Devils",
        thumbnail: "https://images.unsplash.com/photo-1627627256672-027a4613d028?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 864000000, // 10 days ago
        updatedAt: Date.now() - 864000000,
      },
      
      // Tennis Videos
      {
        title: "Tennis Serve Masterclass",
        description: "Professional tennis serving techniques with slow-motion analysis and footwork breakdown.",
        duration: 3600, // 60 minutes
        price: 15.99,
        tags: ["serve", "technique", "professional", "masterclass"],
        sport: "tennis",
        player: "Novak Djokovic",
        thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 950400000, // 11 days ago
        updatedAt: Date.now() - 950400000,
      },
      {
        title: "Tennis Backhand Technique - Clay Court",
        description: "Advanced backhand techniques specifically for clay court play.",
        duration: 2400, // 40 minutes
        price: 9.99,
        tags: ["backhand", "clay-court", "technique", "advanced"],
        sport: "tennis",
        player: "Rafael Nadal",
        thumbnail: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1036800000, // 12 days ago
        updatedAt: Date.now() - 1036800000,
      },
      {
        title: "Wimbledon Grass Court Strategies",
        description: "Adapting your game for grass court tennis - serve and volley tactics.",
        duration: 3300, // 55 minutes
        price: 12.99,
        tags: ["grass-court", "wimbledon", "serve-volley", "strategy"],
        sport: "tennis",
        player: "Roger Federer",
        thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1123200000, // 13 days ago
        updatedAt: Date.now() - 1123200000,
      },
      
      // American Football Videos
      {
        title: "NFL Quarterback Training - Pocket Presence",
        description: "Elite quarterback training focusing on pocket awareness and decision-making under pressure.",
        duration: 3900, // 65 minutes
        price: 16.99,
        tags: ["quarterback", "pocket-presence", "nfl", "decision-making"],
        sport: "american-football",
        team: "Kansas City Chiefs",
        player: "Patrick Mahomes",
        thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1209600000, // 14 days ago
        updatedAt: Date.now() - 1209600000,
      },
      {
        title: "NFL Defensive Line Techniques",
        description: "Pass rush techniques and run stopping fundamentals from NFL defensive coordinators.",
        duration: 2700, // 45 minutes
        price: 10.99,
        tags: ["defense", "pass-rush", "run-stopping", "nfl"],
        sport: "american-football",
        team: "Pittsburgh Steelers",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1296000000, // 15 days ago
        updatedAt: Date.now() - 1296000000,
      },
      
      // Baseball Videos
      {
        title: "MLB Pitching Mechanics - Fastball & Curveball",
        description: "Professional pitching instruction covering fastball velocity and curveball grip techniques.",
        duration: 4800, // 80 minutes
        price: 13.99,
        tags: ["pitching", "fastball", "curveball", "mlb"],
        sport: "baseball",
        team: "New York Yankees",
        player: "Gerrit Cole",
        thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1382400000, // 16 days ago
        updatedAt: Date.now() - 1382400000,
      },
      {
        title: "Baseball Hitting Fundamentals - Power & Contact",
        description: "Batting techniques for both power hitting and making consistent contact.",
        duration: 3600, // 60 minutes
        price: 11.99,
        tags: ["hitting", "power", "contact", "batting"],
        sport: "baseball",
        team: "Los Angeles Dodgers",
        player: "Mookie Betts",
        thumbnail: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1468800000, // 17 days ago
        updatedAt: Date.now() - 1468800000,
      },
      
      // Hockey Videos
      {
        title: "NHL Skating Techniques - Speed & Agility",
        description: "Advanced skating drills used by NHL players to improve speed, agility, and edge work.",
        duration: 2700, // 45 minutes
        price: 8.99,
        tags: ["skating", "speed", "agility", "nhl"],
        sport: "hockey",
        team: "Toronto Maple Leafs",
        player: "Auston Matthews",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1555200000, // 18 days ago
        updatedAt: Date.now() - 1555200000,
      },
      {
        title: "Hockey Goaltending Masterclass",
        description: "Professional goaltending techniques including positioning, rebound control, and mental preparation.",
        duration: 5400, // 90 minutes
        price: 17.99,
        tags: ["goaltending", "positioning", "mental-game", "professional"],
        sport: "hockey",
        team: "Tampa Bay Lightning",
        player: "Andrei Vasilevskiy",
        thumbnail: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1641600000, // 19 days ago
        updatedAt: Date.now() - 1641600000,
      },
      
      // Volleyball Videos
      {
        title: "Beach Volleyball - Serving & Spiking",
        description: "Olympic-level beach volleyball techniques for powerful serves and aggressive spikes.",
        duration: 2100, // 35 minutes
        price: 7.99,
        tags: ["beach-volleyball", "serving", "spiking", "olympic"],
        sport: "volleyball",
        team: "USA Beach Volleyball",
        player: "Kerri Walsh Jennings",
        thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1728000000, // 20 days ago
        updatedAt: Date.now() - 1728000000,
      },
      
      // Swimming Videos
      {
        title: "Olympic Swimming - Freestyle Technique",
        description: "World-class freestyle swimming technique breakdown with underwater analysis.",
        duration: 3000, // 50 minutes
        price: 12.99,
        tags: ["swimming", "freestyle", "olympic", "technique"],
        sport: "swimming",
        player: "Katie Ledecky",
        thumbnail: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1814400000, // 21 days ago
        updatedAt: Date.now() - 1814400000,
      },
      
      // Golf Videos
      {
        title: "PGA Tour - Driver Swing Analysis",
        description: "Professional golf instruction focusing on driver technique and distance optimization.",
        duration: 4200, // 70 minutes
        price: 19.99,
        tags: ["golf", "driver", "pga-tour", "distance"],
        sport: "golf",
        player: "Tiger Woods",
        thumbnail: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=640&h=360&fit=crop&crop=center",
        status: "ready",
        createdAt: Date.now() - 1900800000, // 22 days ago
        updatedAt: Date.now() - 1900800000,
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
