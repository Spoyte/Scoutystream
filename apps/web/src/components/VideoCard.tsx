'use client'

import Link from 'next/link'
import Image from 'next/image'

interface VideoCardProps {
  id: number
  title: string
  thumbnail?: string
  price?: number
  duration?: number
  tags?: string[]
  sport: string
  team?: string
  player?: string
  hasAccess?: boolean
}

// Sport-specific icons and colors
const sportConfig = {
  football: {
    icon: '⚽',
    color: 'bg-green-100 text-green-800',
    fallbackBg: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  basketball: {
    icon: '🏀',
    color: 'bg-orange-100 text-orange-800',
    fallbackBg: 'bg-gradient-to-br from-orange-400 to-orange-600'
  },
  tennis: {
    icon: '🎾',
    color: 'bg-yellow-100 text-yellow-800',
    fallbackBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  }
}

// Team-specific color schemes
const teamColors: Record<string, { primary: string; secondary: string }> = {
  'Manchester United': { primary: 'bg-red-600', secondary: 'bg-red-700' },
  'Barcelona Youth Academy': { primary: 'bg-blue-600', secondary: 'bg-blue-700' },
  'Liverpool FC': { primary: 'bg-red-500', secondary: 'bg-red-600' },
  'Real Madrid': { primary: 'bg-white', secondary: 'bg-gray-100' },
  'Paris Saint-Germain': { primary: 'bg-blue-500', secondary: 'bg-blue-600' },
  'Bayern Munich': { primary: 'bg-red-600', secondary: 'bg-red-700' },
  'Los Angeles Lakers': { primary: 'bg-purple-600', secondary: 'bg-purple-700' },
  'Golden State Warriors': { primary: 'bg-blue-500', secondary: 'bg-blue-600' },
  'Boston Celtics': { primary: 'bg-green-600', secondary: 'bg-green-700' },
  'Miami Heat': { primary: 'bg-red-500', secondary: 'bg-red-600' },
  'Brooklyn Nets': { primary: 'bg-black', secondary: 'bg-gray-800' }
}

export function VideoCard({ 
  id, 
  title, 
  thumbnail, 
  price, 
  duration, 
  tags = [], 
  sport,
  team,
  player,
  hasAccess = false 
}: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentSportConfig = sportConfig[sport as keyof typeof sportConfig] || sportConfig.football
  const teamColor = team ? teamColors[team] : null

  return (
    <Link href={`/video/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`flex items-center justify-center h-full ${currentSportConfig.fallbackBg} text-white`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{currentSportConfig.icon}</div>
                <div className="text-sm font-medium">{sport.toUpperCase()}</div>
                <div className="text-xs opacity-80">Training Session</div>
              </div>
            </div>
          )}
          
          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {formatDuration(duration)}
            </div>
          )}
          
          {/* Access badge */}
          {hasAccess && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
              ✓ Access
            </div>
          )}
          
          {/* Sport icon overlay */}
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-gray-700 text-lg p-1 rounded-full shadow-sm">
            {currentSportConfig.icon}
          </div>
        </div>
        
        <div className="p-4">
          {/* Sport and Team badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`${currentSportConfig.color} text-xs px-2 py-1 rounded-full font-medium`}>
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </span>
            {team && (
              <span className={`${teamColor ? teamColor.primary : 'bg-purple-100'} ${teamColor ? 'text-white' : 'text-purple-800'} text-xs px-2 py-1 rounded-full font-medium`}>
                {team}
              </span>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
          
          {/* Player info */}
          {player && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {player.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="font-medium">{player}</span>
            </div>
          )}
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Price */}
          {price !== undefined && (
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-green-600">
                ${price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                One-time access
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
