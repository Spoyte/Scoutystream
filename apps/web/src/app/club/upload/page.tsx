'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [sport, setSport] = useState('football')
  const [team, setTeam] = useState('')
  const [player, setPlayer] = useState('')
  const [price, setPrice] = useState('5.00')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [storageInfo, setStorageInfo] = useState<any>(null)

  useEffect(() => {
    // Fetch storage provider information
    const fetchStorageInfo = async () => {
      try {
        const response = await api.get('/storage/info')
        setStorageInfo(response.data.storage)
      } catch (error) {
        console.error('Failed to fetch storage info:', error)
      }
    }
    
    fetchStorageInfo()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a video file')
        return
      }
      // Validate file size (max 500MB)
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('File size must be less than 500MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !title.trim()) {
      setError('Please provide a file and title')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Step 1: Request upload URL
      const { data: uploadData } = await api.post('/api/uploads/request', {
        filename: file.name,
        size: file.size,
        mimeType: file.type
      })

      const { uploadUrl, videoId } = uploadData

      // Step 2: Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      setUploadProgress(100)

      // Step 3: Commit upload and save metadata
      await api.post('/api/uploads/commit', {
        videoId,
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        sport: sport.trim(),
        team: team.trim() || undefined,
        player: player.trim() || undefined,
        price: parseFloat(price)
      })

      // Redirect to the new video
      router.push(`/video/${videoId}`)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Upload Training Session
        </h1>

        {/* Storage Provider Info */}
        {storageInfo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {storageInfo.provider === 'youtube' && (
                    <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">YT</span>
                    </div>
                  )}
                  {storageInfo.provider === 'walrus' && (
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                  )}
                  {storageInfo.provider === 'aws' && (
                    <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S3</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Storage Provider: {storageInfo.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    storageInfo.isConfigured ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs ${
                    storageInfo.isConfigured ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {storageInfo.isConfigured ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
              </div>
            </div>
            {storageInfo.provider === 'youtube' && (
              <p className="text-xs text-gray-500 mt-2">
                Videos will be uploaded to YouTube. Ensure your account has proper permissions.
              </p>
            )}
            {storageInfo.provider === 'walrus' && (
              <p className="text-xs text-gray-500 mt-2">
                Videos will be stored on the Walrus decentralized network (Sui blockchain).
              </p>
            )}
            {storageInfo.provider === 'aws' && (
              <p className="text-xs text-gray-500 mt-2">
                Videos will be stored in AWS S3 with secure access controls.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  {file ? file.name : 'Click to upload video file'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  MP4, MOV, AVI up to 500MB
                </span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Training session title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the training session content"
            />
          </div>

          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
              Sport *
            </label>
            <select
              id="sport"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="soccer">Soccer</option>
              <option value="baseball">Baseball</option>
              <option value="volleyball">Volleyball</option>
              <option value="hockey">Hockey</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-2">
              Team/Club
            </label>
            <input
              type="text"
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Manchester United, Lakers, etc."
            />
          </div>

          <div>
            <label htmlFor="player" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Player
            </label>
            <input
              type="text"
              id="player"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Marcus Rashford, LeBron James, etc."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="training, defense, youth (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {uploading && (
            <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-blue-700 mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file || !title.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  )
}
