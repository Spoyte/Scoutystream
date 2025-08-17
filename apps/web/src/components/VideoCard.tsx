'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getSportIcon, getTeamLogo } from '@/lib/mockData'

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

  const sportIcon = getSportIcon(sport)
  const teamLogo = team ? getTeamLogo(team) : null

  return (
    <Link href={`/video/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="relative aspect-video bg-gray-200">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">No thumbnail</div>
            </div>
          )}
          
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(duration)}
            </div>
          )}
          
          {hasAccess && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              ✓ Access
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
              style={{ 
                backgroundColor: sportIcon?.color + '20',
                color: sportIcon?.color 
              }}
            >
              {sportIcon?.icon} {sport}
            </span>
            {team && (
              <span 
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: teamLogo?.primaryColor + '20',
                  color: teamLogo?.primaryColor
                }}
              >
                {teamLogo && (
                  <Image
                    src={teamLogo.logo}
                    alt={team}
                    width={12}
                    height={12}
                    className="rounded-full"
                  />
                )}
                {team}
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
            {title}
          </h3>
          
          {player && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Player:</span> {player}
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {price !== undefined && (
            <div className="text-lg font-bold text-green-600">
              ${price.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
