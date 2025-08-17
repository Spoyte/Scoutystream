'use client'

import { VideoCard } from './VideoCard'

interface Video {
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

interface VideoGridProps {
  videos: Video[]
  loading?: boolean
}

export function VideoGrid({ videos, loading }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No videos available</div>
        <p className="text-gray-400 mt-2">Check back later for new content</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  )
}
