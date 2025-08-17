'use client'

import { mockSports, mockTeams, mockPlayers } from '@/lib/mockData'

interface StatsOverviewProps {
  totalVideos: number
  totalDuration: number
}

export function StatsOverview({ totalVideos, totalDuration }: StatsOverviewProps) {
  const totalHours = Math.round(totalDuration / 3600 * 10) / 10
  const totalTeams = mockTeams.length
  const totalPlayers = mockPlayers.length

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-blue-600 mb-2">{totalVideos}</div>
          <div className="text-sm text-gray-600">Training Videos</div>
          <div className="text-xs text-gray-400 mt-1">Premium content</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-green-600 mb-2">{totalHours}h</div>
          <div className="text-sm text-gray-600">Total Content</div>
          <div className="text-xs text-gray-400 mt-1">Hours of training</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-purple-600 mb-2">{totalTeams}</div>
          <div className="text-sm text-gray-600">Professional Teams</div>
          <div className="text-xs text-gray-400 mt-1">From top leagues</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-orange-600 mb-2">{totalPlayers}</div>
          <div className="text-sm text-gray-600">Star Players</div>
          <div className="text-xs text-gray-400 mt-1">Elite athletes</div>
        </div>
      </div>

      {/* Sports Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sports Coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockSports.map((sport) => (
            <div key={sport.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="text-2xl">{sport.icon}</div>
              <div>
                <div className="font-medium text-gray-900">{sport.name}</div>
                <div className="text-sm text-gray-600">{sport.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Teams Preview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Teams</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockTeams.slice(0, 10).map((team) => (
            <div key={team.id} className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100 group-hover:scale-110 transition-transform">
                <img 
                  src={team.logo} 
                  alt={team.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">{team.name}</div>
              <div className="text-xs text-gray-500">{team.league}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Players */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Players</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockPlayers.slice(0, 8).map((player) => (
            <div key={player.id} className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100 group-hover:scale-110 transition-transform">
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm font-medium text-gray-900 truncate">{player.name}</div>
              <div className="text-xs text-gray-500">{player.position}</div>
              <div className="text-xs text-gray-400">{player.team}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}