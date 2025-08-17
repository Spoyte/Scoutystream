// Mock data for frontend development and fallback scenarios

export interface MockUser {
  id: string
  name: string
  email: string
  avatar: string
  joinDate: string
  purchasedVideos: number[]
  favoriteTeams: string[]
  favoriteSports: string[]
}

export interface SportIcon {
  sport: string
  icon: string
  color: string
}

export interface TeamLogo {
  team: string
  sport: string
  logo: string
  primaryColor: string
  secondaryColor: string
}

// Mock user profiles with diverse avatars
export const mockUsers: MockUser[] = [
  {
    id: "user_1",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinDate: "2023-08-15",
    purchasedVideos: [1, 3, 5],
    favoriteTeams: ["Manchester United", "Los Angeles Lakers"],
    favoriteSports: ["football", "basketball"]
  },
  {
    id: "user_2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinDate: "2023-09-22",
    purchasedVideos: [2, 4, 6, 8],
    favoriteTeams: ["Barcelona Youth Academy", "England Women's Team"],
    favoriteSports: ["football", "tennis"]
  },
  {
    id: "user_3",
    name: "David Kim",
    email: "david.kim@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2023-07-10",
    purchasedVideos: [1, 2, 7, 9],
    favoriteTeams: ["Golden State Warriors", "Kansas City Chiefs"],
    favoriteSports: ["basketball", "american-football"]
  },
  {
    id: "user_4",
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinDate: "2023-06-05",
    purchasedVideos: [10, 11, 12],
    favoriteTeams: ["Tampa Bay Lightning", "New York Yankees"],
    favoriteSports: ["hockey", "baseball"]
  },
  {
    id: "user_5",
    name: "James Rodriguez",
    email: "james.rodriguez@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2023-10-01",
    purchasedVideos: [13, 14, 15],
    favoriteTeams: ["Real Madrid", "USA Beach Volleyball"],
    favoriteSports: ["football", "volleyball"]
  }
]

// Sport icons with colors
export const sportIcons: SportIcon[] = [
  {
    sport: "football",
    icon: "⚽",
    color: "#10B981" // green
  },
  {
    sport: "basketball",
    icon: "🏀",
    color: "#F59E0B" // amber
  },
  {
    sport: "tennis",
    icon: "🎾",
    color: "#EF4444" // red
  },
  {
    sport: "american-football",
    icon: "🏈",
    color: "#8B5CF6" // violet
  },
  {
    sport: "baseball",
    icon: "⚾",
    color: "#3B82F6" // blue
  },
  {
    sport: "hockey",
    icon: "🏒",
    color: "#06B6D4" // cyan
  },
  {
    sport: "volleyball",
    icon: "🏐",
    color: "#EC4899" // pink
  },
  {
    sport: "swimming",
    icon: "🏊",
    color: "#0EA5E9" // sky
  },
  {
    sport: "golf",
    icon: "⛳",
    color: "#84CC16" // lime
  }
]

// Team logos and colors
export const teamLogos: TeamLogo[] = [
  {
    team: "Manchester United",
    sport: "football",
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png",
    primaryColor: "#DA020E",
    secondaryColor: "#FFE500"
  },
  {
    team: "Barcelona Youth Academy",
    sport: "football", 
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png",
    primaryColor: "#004D98",
    secondaryColor: "#A50044"
  },
  {
    team: "Liverpool FC",
    sport: "football",
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png",
    primaryColor: "#C8102E",
    secondaryColor: "#00B2A9"
  },
  {
    team: "Real Madrid",
    sport: "football",
    logo: "https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png",
    primaryColor: "#FEBE10",
    secondaryColor: "#00529F"
  },
  {
    team: "England Women's Team",
    sport: "football",
    logo: "https://logos-world.net/wp-content/uploads/2020/07/England-National-Football-Team-Logo.png",
    primaryColor: "#FFFFFF",
    secondaryColor: "#012169"
  },
  {
    team: "Los Angeles Lakers",
    sport: "basketball",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Los-Angeles-Lakers-Logo.png",
    primaryColor: "#552583",
    secondaryColor: "#FDB927"
  },
  {
    team: "Golden State Warriors",
    sport: "basketball",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Golden-State-Warriors-Logo.png",
    primaryColor: "#1D428A",
    secondaryColor: "#FFC72C"
  },
  {
    team: "Boston Celtics",
    sport: "basketball",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Boston-Celtics-Logo.png",
    primaryColor: "#007A33",
    secondaryColor: "#BA9653"
  },
  {
    team: "Kansas City Chiefs",
    sport: "american-football",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Kansas-City-Chiefs-Logo.png",
    primaryColor: "#E31837",
    secondaryColor: "#FFB81C"
  },
  {
    team: "Pittsburgh Steelers",
    sport: "american-football",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Pittsburgh-Steelers-Logo.png",
    primaryColor: "#FFB612",
    secondaryColor: "#101820"
  },
  {
    team: "New York Yankees",
    sport: "baseball",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/New-York-Yankees-Logo.png",
    primaryColor: "#132448",
    secondaryColor: "#FFFFFF"
  },
  {
    team: "Los Angeles Dodgers",
    sport: "baseball",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Los-Angeles-Dodgers-Logo.png",
    primaryColor: "#005A9C",
    secondaryColor: "#FFFFFF"
  },
  {
    team: "Toronto Maple Leafs",
    sport: "hockey",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Toronto-Maple-Leafs-Logo.png",
    primaryColor: "#003E7E",
    secondaryColor: "#FFFFFF"
  },
  {
    team: "Tampa Bay Lightning",
    sport: "hockey",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Tampa-Bay-Lightning-Logo.png",
    primaryColor: "#002868",
    secondaryColor: "#FFFFFF"
  }
]

// Mock video data with thumbnails (fallback for when backend is unavailable)
export const mockVideos = [
  {
    id: 1,
    title: "Youth Training Session - Ball Control",
    description: "Professional youth training focusing on ball control techniques and first touch improvements.",
    duration: 1800,
    price: 5.99,
    tags: ["youth", "ball-control", "training", "fundamentals"],
    sport: "football",
    team: "Barcelona Youth Academy",
    thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=640&h=360&fit=crop&crop=center",
    status: "ready",
    hasAccess: false
  },
  {
    id: 2,
    title: "Professional Scrimmage - Tactical Analysis",
    description: "Full 90-minute scrimmage between professional teams with tactical breakdowns.",
    duration: 5400,
    price: 12.99,
    tags: ["professional", "tactics", "scrimmage", "analysis"],
    sport: "football",
    team: "Manchester United",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=640&h=360&fit=crop&crop=center",
    status: "ready",
    hasAccess: true
  },
  {
    id: 3,
    title: "Individual Skills Training - Dribbling",
    description: "One-on-one coaching session focusing on advanced dribbling techniques.",
    duration: 2700,
    price: 8.99,
    tags: ["individual", "dribbling", "skills", "advanced"],
    sport: "football",
    player: "Marcus Rashford",
    team: "Manchester United",
    thumbnail: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=640&h=360&fit=crop&crop=center",
    status: "ready",
    hasAccess: false
  },
  {
    id: 4,
    title: "Basketball Shooting Drills - 3-Point Training",
    description: "Intensive 3-point shooting session with NBA-level techniques and form analysis.",
    duration: 2100,
    price: 7.99,
    tags: ["shooting", "3-point", "technique", "professional"],
    sport: "basketball",
    team: "Los Angeles Lakers",
    player: "LeBron James",
    thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=640&h=360&fit=crop&crop=center",
    status: "ready",
    hasAccess: true
  },
  {
    id: 5,
    title: "Tennis Serve Masterclass",
    description: "Professional tennis serving techniques with slow-motion analysis and footwork breakdown.",
    duration: 3600,
    price: 15.99,
    tags: ["serve", "technique", "professional", "masterclass"],
    sport: "tennis",
    player: "Novak Djokovic",
    thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=640&h=360&fit=crop&crop=center",
    status: "ready",
    hasAccess: false
  }
]

// Helper functions
export function getMockUser(id: string): MockUser | undefined {
  return mockUsers.find(user => user.id === id)
}

export function getSportIcon(sport: string): SportIcon | undefined {
  return sportIcons.find(item => item.sport === sport)
}

export function getTeamLogo(team: string): TeamLogo | undefined {
  return teamLogos.find(item => item.team === team)
}

export function getRandomAvatar(): string {
  const avatars = mockUsers.map(user => user.avatar)
  return avatars[Math.floor(Math.random() * avatars.length)]
}

export function generateMockUserProfile(): MockUser {
  const names = ["Alex", "Maria", "David", "Sarah", "James", "Emma", "Michael", "Lisa", "Ryan", "Jessica"]
  const lastNames = ["Johnson", "Santos", "Kim", "Williams", "Rodriguez", "Brown", "Davis", "Wilson", "Garcia", "Martinez"]
  
  const firstName = names[Math.floor(Math.random() * names.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    avatar: getRandomAvatar(),
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchasedVideos: [],
    favoriteTeams: [],
    favoriteSports: []
  }
}