'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface VideoFiltersProps {
  onFiltersChange: (filters: {
    sport?: string
    team?: string
    player?: string
    search?: string
  }) => void
  currentFilters: {
    sport?: string
    team?: string
    player?: string
    search?: string
  }
}

export function VideoFilters({ onFiltersChange, currentFilters }: VideoFiltersProps) {
  const [sports, setSports] = useState<string[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [players, setPlayers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch sports on component mount
  useEffect(() => {
    fetchSports()
  }, [])

  // Fetch teams when sport changes
  useEffect(() => {
    if (currentFilters.sport) {
      fetchTeams(currentFilters.sport)
    } else {
      fetchTeams()
    }
  }, [currentFilters.sport])

  // Fetch players when sport or team changes
  useEffect(() => {
    fetchPlayers(currentFilters.sport, currentFilters.team)
  }, [currentFilters.sport, currentFilters.team])

  const fetchSports = async () => {
    try {
      const response = await api.get('/api/videos/filters/sports')
      setSports(response.data)
    } catch (error) {
      console.error('Error fetching sports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async (sport?: string) => {
    try {
      const url = sport ? `/api/videos/filters/teams?sport=${encodeURIComponent(sport)}` : '/api/videos/filters/teams'
      const response = await api.get(url)
      setTeams(response.data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchPlayers = async (sport?: string, team?: string) => {
    try {
      const params = new URLSearchParams()
      if (sport) params.append('sport', sport)
      if (team) params.append('team', team)
      
      const url = `/api/videos/filters/players${params.toString() ? '?' + params.toString() : ''}`
      const response = await api.get(url)
      setPlayers(response.data)
    } catch (error) {
      console.error('Error fetching players:', error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters }
    
    if (value === '') {
      delete newFilters[key as keyof typeof newFilters]
    } else {
      newFilters[key as keyof typeof newFilters] = value
    }

    // Reset dependent filters when parent filter changes
    if (key === 'sport') {
      delete newFilters.team
      delete newFilters.player
    } else if (key === 'team') {
      delete newFilters.player
    }

    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(currentFilters).some(key => currentFilters[key as keyof typeof currentFilters])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search videos, teams, players..."
            value={currentFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sport Filter */}
        <div className="min-w-40">
          <select
            value={currentFilters.sport || ''}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sports</option>
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div className="min-w-40">
          <select
            value={currentFilters.team || ''}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={teams.length === 0}
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Player Filter */}
        <div className="min-w-40">
          <select
            value={currentFilters.player || ''}
            onChange={(e) => handleFilterChange('player', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={players.length === 0}
          >
            <option value="">All Players</option>
            {players.map(player => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {currentFilters.search && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              Search: &quot;{currentFilters.search}&quot;
            </span>
          )}
          {currentFilters.sport && (
            <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
              Sport: {currentFilters.sport}
            </span>
          )}
          {currentFilters.team && (
            <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
              Team: {currentFilters.team}
            </span>
          )}
          {currentFilters.player && (
            <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
              Player: {currentFilters.player}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
