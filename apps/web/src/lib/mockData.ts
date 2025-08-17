// Mock data service for frontend development
// This provides additional visual content and mock assets

export interface MockTeam {
  id: string
  name: string
  sport: string
  logo: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  country: string
  league: string
}

export interface MockPlayer {
  id: string
  name: string
  position: string
  team: string
  avatar: string
  stats: {
    goals?: number
    assists?: number
    points?: number
    wins?: number
  }
}

export interface MockSport {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

// Mock team data
export const mockTeams: MockTeam[] = [
  {
    id: 'man-utd',
    name: 'Manchester United',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#DA291C', secondary: '#FBE122', accent: '#000000' },
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'barcelona',
    name: 'Barcelona Youth Academy',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#A50044', secondary: '#004D98', accent: '#EDBB00' },
    country: 'Spain',
    league: 'La Liga'
  },
  {
    id: 'liverpool',
    name: 'Liverpool FC',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#C8102E', secondary: '#F6EB61', accent: '#00A398' },
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#FFFFFF', secondary: '#00529F', accent: '#FDB913' },
    country: 'Spain',
    league: 'La Liga'
  },
  {
    id: 'psg',
    name: 'Paris Saint-Germain',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#004170', secondary: '#DA291C', accent: '#FFFFFF' },
    country: 'France',
    league: 'Ligue 1'
  },
  {
    id: 'bayern',
    name: 'Bayern Munich',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#DC052C', secondary: '#0066B1', accent: '#FFFFFF' },
    country: 'Germany',
    league: 'Bundesliga'
  },
  {
    id: 'lakers',
    name: 'Los Angeles Lakers',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#552583', secondary: '#FDB927', accent: '#000000' },
    country: 'USA',
    league: 'NBA'
  },
  {
    id: 'warriors',
    name: 'Golden State Warriors',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#1D428A', secondary: '#FFC72C', accent: '#FFFFFF' },
    country: 'USA',
    league: 'NBA'
  },
  {
    id: 'celtics',
    name: 'Boston Celtics',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#007A33', secondary: '#BA9653', accent: '#FFFFFF' },
    country: 'USA',
    league: 'NBA'
  },
  {
    id: 'heat',
    name: 'Miami Heat',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#98002E', secondary: '#F9A01B', accent: '#FFFFFF' },
    country: 'USA',
    league: 'NBA'
  },
  {
    id: 'nets',
    name: 'Brooklyn Nets',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    colors: { primary: '#000000', secondary: '#FFFFFF', accent: '#000000' },
    country: 'USA',
    league: 'NBA'
  }
]

// Mock player data
export const mockPlayers: MockPlayer[] = [
  {
    id: 'rashford',
    name: 'Marcus Rashford',
    position: 'Forward',
    team: 'Manchester United',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    stats: { goals: 15, assists: 8 }
  },
  {
    id: 'james',
    name: 'LeBron James',
    position: 'Forward',
    team: 'Los Angeles Lakers',
    avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    stats: { points: 25.7, assists: 7.3 }
  },
  {
    id: 'djokovic',
    name: 'Novak Djokovic',
    position: 'Singles',
    team: 'Independent',
    avatar: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=64&h=64&fit=crop&crop=center',
    stats: { wins: 24 }
  },
  {
    id: 'courtois',
    name: 'Thibaut Courtois',
    position: 'Goalkeeper',
    team: 'Real Madrid',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    stats: { goals: 0, assists: 0 }
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    position: 'Forward',
    team: 'Paris Saint-Germain',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop&crop=center',
    stats: { goals: 22, assists: 12 }
  },
  {
    id: 'federer',
    name: 'Roger Federer',
    position: 'Singles',
    team: 'Independent',
    avatar: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=64&h=64&fit=crop&crop=center',
    stats: { wins: 20 }
  },
  {
    id: 'williams',
    name: 'Serena Williams',
    position: 'Singles',
    team: 'Independent',
    avatar: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=64&h=64&fit=crop&crop=center',
    stats: { wins: 23 }
  },
  {
    id: 'irving',
    name: 'Kyrie Irving',
    position: 'Guard',
    team: 'Brooklyn Nets',
    avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=64&h=64&fit=crop&crop=center',
    stats: { points: 27.1, assists: 5.8 }
  }
]

// Mock sports data
export const mockSports: MockSport[] = [
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    color: '#22C55E',
    description: 'The beautiful game - soccer training and tactics'
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    color: '#F97316',
    description: 'Fast-paced court action and shooting skills'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    color: '#EAB308',
    description: 'Precision and power on the court'
  }
]

// Mock thumbnail URLs for different sports
export const mockThumbnails = {
  football: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1553778263-73a3ebf2b0dd?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&crop=center'
  ],
  basketball: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=225&fit=crop&crop=center'
  ],
  tennis: [
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=225&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=225&fit=crop&crop=center'
  ]
}

// Helper functions
export function getTeamByName(name: string): MockTeam | undefined {
  return mockTeams.find(team => team.name === name)
}

export function getPlayerByName(name: string): MockPlayer | undefined {
  return mockPlayers.find(player => player.name === name)
}

export function getSportByName(name: string): MockSport | undefined {
  return mockSports.find(sport => sport.id === name)
}

export function getRandomThumbnail(sport: string): string {
  const thumbnails = mockThumbnails[sport as keyof typeof mockThumbnails]
  if (thumbnails) {
    return thumbnails[Math.floor(Math.random() * thumbnails.length)]
  }
  return mockThumbnails.football[0] // fallback
}