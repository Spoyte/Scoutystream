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

// Sport icons mapping
const sportIcons: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾'
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
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter Videos</h3>
        <p className="text-sm text-gray-600">Find the perfect training content for your needs</p>
      </div>
      
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search videos, teams, players..."
              value={currentFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Sport Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
          <select
            value={currentFilters.sport || ''}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Sports</option>
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sportIcons[sport] || '🏃'} {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div className="min-w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
          <select
            value={currentFilters.team || ''}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
          <select
            value={currentFilters.player || ''}
            onChange={(e) => handleFilterChange('player', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
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
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentFilters.search && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                &quot;{currentFilters.search}&quot;
              </span>
            )}
            {currentFilters.sport && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                {sportIcons[currentFilters.sport] || '🏃'}
                {currentFilters.sport.charAt(0).toUpperCase() + currentFilters.sport.slice(1)}
              </span>
            )}
            {currentFilters.team && (
              <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {currentFilters.team}
              </span>
            )}
            {currentFilters.player && (
              <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {currentFilters.player}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
