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

// Skeleton loading component
function VideoSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200 relative">
        <div className="absolute top-2 left-2 w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-16 h-6 bg-gray-300 rounded"></div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-1">
          <div className="h-6 bg-gray-200 rounded-full w-12"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export function VideoGrid({ videos, loading }: VideoGridProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Loading training videos...</span>
          </div>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
        <p className="text-gray-500 mb-6">
          We couldn&apos;t find any videos matching your criteria.
        </p>
        <div className="text-sm text-gray-400">
          Try adjusting your filters or search terms
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
      
      {/* Results summary */}
      <div className="text-center py-4 text-sm text-gray-500">
        <span>Showing {videos.length} training video{videos.length !== 1 ? 's' : ''}</span>
        {videos.length > 0 && (
          <>
            <span className="mx-2">•</span>
            <span>
              {videos.filter(v => v.sport === 'football').length} Football • 
              {videos.filter(v => v.sport === 'basketball').length} Basketball • 
              {videos.filter(v => v.sport === 'tennis').length} Tennis
            </span>
          </>
        )}
      </div>
    </div>
  )
}
