import React from 'react'

interface YouTubePlayerProps {
  embedUrl: string
  className?: string
}

/**
 * Lightweight YouTube embed component.
 * Assumes the provided URL is already the full embed URL (https://www.youtube.com/embed/{id}).
 */
export function YouTubePlayer({ embedUrl, className = '' }: YouTubePlayerProps) {
  if (!embedUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No video source</p>
      </div>
    )
  }

  return (
    <iframe
      className={`w-full h-full ${className}`}
      src={embedUrl}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  )
}