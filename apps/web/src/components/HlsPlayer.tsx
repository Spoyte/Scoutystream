'use client'

import { useRef, useEffect } from 'react'
import Hls from 'hls.js'

interface HlsPlayerProps {
  manifestUrl?: string
  poster?: string
  onError?: (error: any) => void
  className?: string
}

export function HlsPlayer({ manifestUrl, poster, onError, className = '' }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    if (!manifestUrl || !videoRef.current) return

    const video = videoRef.current

    // Check if browser supports native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = manifestUrl
      return
    }

    // Use hls.js for other browsers
    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }

      const hls = new Hls({
        enableWorker: false,
      })
      hlsRef.current = hls

      hls.loadSource(manifestUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data)
        if (onError) {
          onError(data)
        }
      })

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }
      }
    } else {
      console.error('HLS is not supported in this browser')
      if (onError) {
        onError(new Error('HLS not supported'))
      }
    }
  }, [manifestUrl, onError])

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [])

  if (!manifestUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No video source</p>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      controls
      poster={poster}
      className={`w-full ${className}`}
      onError={(e) => {
        console.error('Video error:', e)
        if (onError) {
          onError(e)
        }
      }}
    />
  )
}
