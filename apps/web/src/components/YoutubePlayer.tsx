'use client'

import React from 'react'

interface YoutubePlayerProps {
  youtubeId: string
  className?: string
}

export function YoutubePlayer({ youtubeId, className = '' }: YoutubePlayerProps) {
  const src = `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?rel=0&modestbranding=1`
  return (
    <iframe
      className={`w-full h-full ${className}`}
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  )
}