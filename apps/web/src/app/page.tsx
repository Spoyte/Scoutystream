'use client'

import { useState } from 'react'
import { VideoGrid } from '@/components/VideoGrid'
import { VideoFilters } from '@/components/VideoFilters'
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Training Session Gallery
        </h1>
        <p className="text-gray-600">
          Discover and access premium sports training content with blockchain-powered access control
        </p>
      </div>

      <VideoFilters 
        onFiltersChange={setFilters}
        currentFilters={filters}
      />
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${videos.length} video${videos.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>
      
      <VideoGrid videos={videos} loading={isLoading} />
    </div>
  )
}