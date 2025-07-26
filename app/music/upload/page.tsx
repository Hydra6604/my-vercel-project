'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Music, X, ArrowLeft, FileAudio } from 'lucide-react'
import { useMusic } from '@/hooks/useMusic'

export default function UploadPage() {
  const router = useRouter()
  const { uploadSong } = useMusic()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    description: '',
    isPublic: false
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file)
        if (!formData.title) {
          setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }))
        }
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !formData.title.trim()) return

    setUploading(true)
    try {
      const tags = [formData.artist, formData.album].filter(Boolean)
      await uploadSong(
        selectedFile,
        formData.title,
        formData.description,
        tags,
        formData.isPublic
      )
      router.push('/music')
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Upload Music</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Select Audio File</h2>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/20 hover:border-white/40'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                    <FileAudio className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-lg font-medium">
                      Drop your audio file here, or click to browse
                    </p>
                    <p className="text-white/70 text-sm mt-2">
                      Supports MP3, WAV, FLAC, and other audio formats
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-white/70 text-sm">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Metadata Form */}
          {selectedFile && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Song Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="Song title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Artist
                  </label>
                  <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="Artist name"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Album
                  </label>
                  <input
                    type="text"
                    value={formData.album}
                    onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                    placeholder="Album name"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Song description"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 bg-black/20 border-white/20 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPublic" className="text-white text-sm">
                  Make this song public (others can discover and listen to it)
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedFile && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !formData.title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Song</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}