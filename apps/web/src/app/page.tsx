'use client'

import { useState } from 'react'
import { VideoGrid } from '@/components/VideoGrid'
import { VideoFilters } from '@/components/VideoFilters'
import { StatsOverview } from '@/components/StatsOverview'
import { useVideos } from '@/hooks/useApi'

export default function Home() {
  const [filters, setFilters] = useState<{
    sport?: string
    team?: string
    player?: string
    search?: string
  }>({})

  const { videos, isLoading, isError } = useVideos(filters)

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Failed to load videos</div>
        <p className="text-gray-500">Please check that the backend API is running</p>
      </div>
    )
  }

  // Calculate statistics
  const totalVideos = videos.length
  const footballVideos = videos.filter((v: any) => v.sport === 'football').length
  const basketballVideos = videos.filter((v: any) => v.sport === 'basketball').length
  const tennisVideos = videos.filter((v: any) => v.sport === 'tennis').length
  const totalDuration = videos.reduce((sum: number, v: any) => sum + (v.duration || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Training Session Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover and access premium sports training content with blockchain-powered access control
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <span>{footballVideos} Football</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏀</span>
              <span>{basketballVideos} Basketball</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎾</span>
              <span>{tennisVideos} Tennis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Overview */}
      <StatsOverview totalVideos={totalVideos} totalDuration={totalDuration} />

      {/* Filters */}
      <VideoFilters 
        onFiltersChange={setFilters}
        currentFilters={filters}
      />
      
      {/* Results Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Training Videos</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
              <span>
                {isLoading ? 'Loading...' : `${videos.length} video${videos.length !== 1 ? 's' : ''} found`}
              </span>
            </div>
          </div>
          
          {!isLoading && videos.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {videos.length} of {totalVideos} videos
            </div>
          )}
        </div>
      </div>
      
      {/* Video Grid */}
      <VideoGrid videos={videos} loading={isLoading} />
      
      {/* Empty State */}
      {!isLoading && videos.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🎥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters or search terms to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}