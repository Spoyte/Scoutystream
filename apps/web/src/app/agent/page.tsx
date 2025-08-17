'use client'

import { useState } from 'react'
import api from '@/lib/api'

interface AnalysisResult {
  videoId: number
  frames: string[]
  actions: string[]
  insights: string[]
}

export default function AgentPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [selectedVideoId, setSelectedVideoId] = useState('1')

  const runAgentDemo = async () => {
    try {
      setIsRunning(true)
      setError('')
      setResult(null)

      console.log(`🤖 AI Agent Demo: Analyzing video ${selectedVideoId}`)

      // Step 1: Attempt to get manifest (expect 402)
      console.log('Step 1: Requesting video manifest...')
      
      let manifestUrl: string | undefined
      let provider: 'aws' | 'walrus' | 'youtube' | undefined
      let youtubeId: string | undefined
      try {
        const manifestResponse = await api.get(`/api/videos/${selectedVideoId}/manifest`)
        provider = manifestResponse.data.provider
        if (provider === 'youtube') {
          youtubeId = manifestResponse.data.youtubeId
          console.log('✅ Already have access, YouTube provider')
        } else {
          manifestUrl = manifestResponse.data.manifestUrl
          console.log('✅ Already have access, got manifest directly')
        }
      } catch (err: any) {
        if (err.isPaymentRequired) {
          console.log('💰 Payment required, processing...')
          
          // Step 2: Handle payment programmatically
          try {
            await api.post(`/api/videos/${selectedVideoId}/purchase`)
            console.log('✅ Payment processed successfully')
            
            // Step 3: Retry manifest request
            const manifestResponse = await api.get(`/api/videos/${selectedVideoId}/manifest`)
            provider = manifestResponse.data.provider
            if (provider === 'youtube') {
              youtubeId = manifestResponse.data.youtubeId
              console.log('✅ YouTube provider after payment')
            } else {
              manifestUrl = manifestResponse.data.manifestUrl
              console.log('✅ Got manifest after payment')
            }
          } catch (paymentErr: any) {
            throw new Error(`Payment failed: ${paymentErr.message}`)
          }
        } else {
          throw err
        }
      }

      // Step 4: Get frames for analysis (mock)
      console.log('Step 2: Extracting frames for AI analysis...')
      
      try {
        const framesResponse = await api.get(`/api/videos/${selectedVideoId}/frames?fps=1`, {
          responseType: 'blob'
        })
        
        // For demo, we'll simulate having frames
        const mockFrames = [
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
        ]
        
        console.log('✅ Extracted frames for analysis')

        // Step 5: Simulate AI analysis
        console.log('Step 3: Running AI analysis on frames...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        const mockAnalysis = {
          videoId: parseInt(selectedVideoId),
          frames: mockFrames,
          actions: [
            'Player dribbling with right foot (0:15)',
            'Defensive positioning adjustment (0:32)',
            'Sprint acceleration phase (0:48)',
            'Ball control under pressure (1:05)'
          ],
          insights: [
            '🏃‍♂️ High-intensity movement detected in 73% of frames',
            '⚽ Ball possession maintained for average 4.2 seconds',
            '🎯 Successful pass completion rate: 87%',
            '💪 Peak sprint speed estimated at 24.3 km/h',
            '🧠 Decision-making time averaged 1.8 seconds'
          ]
        }

        setResult(mockAnalysis)
        console.log('✅ AI analysis complete')

      } catch (framesErr: any) {
        console.warn('⚠️ Could not get frames, using mock data for demo')
        
        // Fallback to mock data for demo
        const mockAnalysis = {
          videoId: parseInt(selectedVideoId),
          frames: [
            'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Frame+1',
            'https://via.placeholder.com/320x180/7C3AED/FFFFFF?text=Frame+2',
            'https://via.placeholder.com/320x180/059669/FFFFFF?text=Frame+3'
          ],
          actions: [
            'Mock: Player dribbling detected (0:15)',
            'Mock: Defensive movement (0:32)',
            'Mock: Sprint phase identified (0:48)'
          ],
          insights: [
            '🤖 Mock AI Analysis Results',
            '⚽ Simulated ball tracking data',
            '🏃‍♂️ Estimated player movement patterns',
            '📊 Performance metrics calculated'
          ]
        }
        
        setResult(mockAnalysis)
      }

    } catch (err: any) {
      console.error('❌ Agent demo failed:', err)
      setError(err.message || 'Agent analysis failed')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🤖 AI Agent Demo
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">How it works:</h2>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. AI agent requests video access (may receive 402 Payment Required)</li>
            <li>2. Agent automatically handles payment via x402 protocol</li>
            <li>3. Agent extracts frames from video stream at 1 FPS</li>
            <li>4. AI analyzes frames for player movements and actions</li>
            <li>5. Agent generates scouting insights and recommendations</li>
          </ol>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <select
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Video 1 - Youth Training Session</option>
            <option value="2">Video 2 - Professional Scrimmage</option>
            <option value="3">Video 3 - Individual Skills Training</option>
          </select>

          <button
            onClick={runAgentDemo}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </>
            ) : (
              <>
                🚀 Run AI Agent Analysis
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Analysis Complete for Video {result.videoId}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Extracted Frames</h3>
                <div className="grid grid-cols-1 gap-3">
                  {result.frames.slice(0, 3).map((frame, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img 
                        src={frame} 
                        alt={`Frame ${index + 1}`}
                        className="w-full h-24 object-cover bg-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://via.placeholder.com/320x180/6B7280/FFFFFF?text=Frame+${index + 1}`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Detected Actions</h3>
                <div className="space-y-2">
                  {result.actions.map((action, index) => (
                    <div key={index} className="bg-gray-50 border rounded p-3">
                      <p className="text-sm text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">AI Insights</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="space-y-2">
                  {result.insights.map((insight, index) => (
                    <p key={index} className="text-purple-800">{insight}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Next Steps for Real Implementation:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Integrate computer vision models (YOLO, OpenPose)</li>
                <li>• Add player tracking and movement analysis</li>
                <li>• Implement performance metrics calculation</li>
                <li>• Build ML models for talent assessment</li>
                <li>• Create automated scouting reports</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
