'use client'

import useSWR from 'swr'
import api from '@/lib/api'

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useVideos(filters?: {
  sport?: string
  team?: string
  player?: string
  search?: string
}) {
  // Build query string from filters
  const queryParams = new URLSearchParams()
  if (filters?.sport) queryParams.append('sport', filters.sport)
  if (filters?.team) queryParams.append('team', filters.team)
  if (filters?.player) queryParams.append('player', filters.player)
  if (filters?.search) queryParams.append('search', filters.search)
  
  const queryString = queryParams.toString()
  const url = `/api/videos${queryString ? '?' + queryString : ''}`
  
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  
  return {
    videos: data || [],
    isLoading,
    isError: error,
    refresh: mutate
  }
}

export function useVideo(id: number | string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/videos/${id}` : null,
    fetcher
  )
  
  return {
    video: data,
    isLoading,
    isError: error,
    refresh: mutate
  }
}

export function useVideoManifest(id: number | string, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled && id ? `/api/videos/${id}/manifest` : null,
    fetcher,
    {
      shouldRetryOnError: false, // Don't retry on 402 errors
      revalidateOnFocus: false,
    }
  )
  
  return {
    manifestUrl: data?.manifestUrl,
    isLoading,
    isError: error,
    refresh: mutate
  }
}
