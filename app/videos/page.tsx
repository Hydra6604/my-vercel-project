import React from 'react'
import type { MediaFile } from '@/lib/media'

// Fetch videos on the server using a dynamic import to avoid build-time env checks
async function fetchVideos(): Promise<MediaFile[]> {
  // Dynamically import Supabase client at runtime
  const { supabase } = await import('@/lib/supabase')

  // Query public video files
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .eq('is_public', true)
    .ilike('mime_type', 'video/%')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export default async function VideosPage() {
  try {
    const videos = await fetchVideos()

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-semibold mb-4">Videos</h1>
        {videos.length === 0 ? (
          <p className="text-gray-600">No public videos found.</p>
        ) : (
          <ul className="space-y-3">
            {videos.map((v: MediaFile) => (
              <li key={v.id} className="p-4 bg-white rounded shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{v.title || v.file_name}</p>
                    <p className="text-sm text-gray-500">{v.mime_type} · {v.width || '—'}×{v.height || '—'}{v.duration ? ` · ${v.duration}s` : ''}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(v.created_at).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-semibold mb-4">Videos</h1>
        <div className="p-4 rounded bg-red-50 text-red-700 border border-red-200">
          Error fetching videos: {message}
        </div>
      </div>
    )
  }
}