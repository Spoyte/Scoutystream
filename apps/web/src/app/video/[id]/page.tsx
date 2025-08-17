'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { HlsPlayer } from '@/components/HlsPlayer'
import { YoutubePlayer } from '@/components/YoutubePlayer'
import { useVideo, useVideoManifest } from '@/hooks/useApi'
import { useX402 } from '@/hooks/useX402'
import { useAccount } from 'wagmi'

export default function VideoPage() {
  const params = useParams()
  const videoId = params.id as string
  const { address, isConnected } = useAccount()
  
  const [hasTriedAccess, setHasTriedAccess] = useState(false)
  const [manifestUrl, setManifestUrl] = useState<string>()
  const [youtubeId, setYoutubeId] = useState<string>()
  
  const { video, isLoading: videoLoading, refresh: refreshVideo } = useVideo(videoId)
  const { 
    manifestUrl: fetchedManifestUrl, 
    isError: manifestError, 
    refresh: refreshManifest 
  } = useVideoManifest(videoId, hasTriedAccess)
  
  const { handlePaymentRequired, isProcessingPayment, paymentError } = useX402({
    onPaymentSuccess: () => {
      refreshVideo()
      refreshManifest()
    }
  })

  const handleWatchClick = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setHasTriedAccess(true)
  }

  useEffect(() => {
    if (manifestError?.isPaymentRequired && videoId) {
      handlePaymentRequired(manifestError, parseInt(videoId))
    } else if (fetchedManifestUrl) {
      setManifestUrl(fetchedManifestUrl)
    } else if ((fetchedManifestUrl === undefined) && (manifestError === undefined) && video?.provider === 'youtube' && video?.youtubeId) {
      // In YouTube mode, the manifest hook returns nothing; we can play via youtubeId
      setYoutubeId(video.youtubeId)
    }
  }, [manifestError, fetchedManifestUrl, videoId, handlePaymentRequired, video])

  if (videoLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-300 aspect-video rounded-lg mb-6"></div>
        <div className="h-8 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Video not found</div>
      </div>
    )
  }

  const canRenderPlayer = !!manifestUrl || !!youtubeId

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-900">
          {canRenderPlayer ? (
            youtubeId ? (
              <YoutubePlayer youtubeId={youtubeId} />
            ) : (
              <HlsPlayer
                manifestUrl={manifestUrl}
                poster={video.thumbnail}
                className="rounded-t-lg"
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              {video.hasAccess ? (
                <div className="text-white">Loading video...</div>
              ) : (
                <div className="text-center text-white">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Premium Content</h3>
                  <p className="text-gray-300 mb-4">
                    This video requires payment to access
                  </p>
                  {!isConnected ? (
                    <p className="text-yellow-300">Please connect your wallet first</p>
                  ) : (
                    <button
                      onClick={handleWatchClick}
                      disabled={isProcessingPayment}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      {isProcessingPayment ? 'Processing Payment...' : `Pay $${video.price?.toFixed(2) || '0.00'} to Watch`}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {video.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {video.tags?.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            {video.duration && (
              <div>
                <span className="font-medium">Duration:</span> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </div>
            )}
            {video.price !== undefined && (
              <div>
                <span className="font-medium">Price:</span> ${video.price.toFixed(2)}
              </div>
            )}
            <div>
              <span className="font-medium">Access:</span> {video.hasAccess ? '✅ Granted' : '🔒 Locked'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
