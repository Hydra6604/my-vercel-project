import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Song {
  id: string
  user_id: string
  title: string
  description?: string | null
  file_name: string
  file_path: string
  file_size?: number | null
  mime_type?: string | null
  duration?: number | null
  thumbnail_url?: string | null
  tags?: string[] | null
  is_public: boolean
  created_at: string
  updated_at: string
  // Computed fields
  artist?: string
  album?: string
  is_liked?: boolean
}

export interface Playlist {
  id: string
  user_id: string
  title: string
  description?: string | null
  thumbnail_url?: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  // Computed fields
  song_count?: number
  songs?: Song[]
}

export interface PlaylistItem {
  id: string
  playlist_id: string
  media_file_id: string
  position: number
  created_at: string
}

export function useMusic() {
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Fetch user's songs
  const fetchSongs = async (userId?: string) => {
    try {
      setLoading(true)
      let query = supabase
        .from('media_files')
        .select('*')
        .eq('mime_type', 'audio/mpeg')
        .or('mime_type.like.audio/%')

      if (userId) {
        query = query.eq('user_id', userId)
      } else {
        query = query.eq('is_public', true)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to include artist/album from tags or description
      const transformedSongs: Song[] = data?.map(song => ({
        ...song,
        artist: song.tags?.[0] || 'Unknown Artist',
        album: song.tags?.[1] || 'Unknown Album',
        is_liked: false // This would be computed from likes table
      })) || []

      setSongs(transformedSongs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch songs')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's playlists
  const fetchPlaylists = async (userId?: string) => {
    try {
      let query = supabase
        .from('playlists')
        .select(`
          *,
          playlist_items(count)
        `)

      if (userId) {
        query = query.eq('user_id', userId)
      } else {
        query = query.eq('is_public', true)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const transformedPlaylists: Playlist[] = data?.map(playlist => ({
        ...playlist,
        song_count: playlist.playlist_items?.[0]?.count || 0
      })) || []

      setPlaylists(transformedPlaylists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlists')
    }
  }

  // Create a new playlist
  const createPlaylist = async (title: string, description?: string, isPublic = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          title,
          description,
          is_public: isPublic
        })
        .select()
        .single()

      if (error) throw error

      setPlaylists(prev => [{ ...data, song_count: 0 }, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist')
      throw err
    }
  }

  // Add song to playlist
  const addToPlaylist = async (playlistId: string, songId: string) => {
    try {
      // Get current max position
      const { data: items, error: fetchError } = await supabase
        .from('playlist_items')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1)

      if (fetchError) throw fetchError

      const nextPosition = (items?.[0]?.position || 0) + 1

      const { error } = await supabase
        .from('playlist_items')
        .insert({
          playlist_id: playlistId,
          media_file_id: songId,
          position: nextPosition
        })

      if (error) throw error

      // Update playlist song count
      setPlaylists(prev => prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, song_count: (playlist.song_count || 0) + 1 }
          : playlist
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add song to playlist')
      throw err
    }
  }

  // Toggle like on a song
  const toggleLike = async (songId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if already liked
      const { data: existingLike, error: fetchError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('media_file_id', songId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)

        if (error) throw error

        setSongs(prev => prev.map(song => 
          song.id === songId ? { ...song, is_liked: false } : song
        ))
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            media_file_id: songId
          })

        if (error) throw error

        setSongs(prev => prev.map(song => 
          song.id === songId ? { ...song, is_liked: true } : song
        ))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like')
      throw err
    }
  }

  // Upload a new song
  const uploadSong = async (
    file: File, 
    title: string, 
    description?: string, 
    tags?: string[], 
    isPublic = false
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('media-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-files')
        .getPublicUrl(fileName)

      // Create database record
      const { data, error } = await supabase
        .from('media_files')
        .insert({
          user_id: user.id,
          title,
          description,
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          tags,
          is_public: isPublic
        })
        .select()
        .single()

      if (error) throw error

      const newSong: Song = {
        ...data,
        artist: tags?.[0] || 'Unknown Artist',
        album: tags?.[1] || 'Unknown Album',
        is_liked: false
      }

      setSongs(prev => [newSong, ...prev])
      return newSong
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload song')
      throw err
    }
  }

  // Search songs
  const searchSongs = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, tags.cs.{${query}}`)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(song => ({
        ...song,
        artist: song.tags?.[0] || 'Unknown Artist',
        album: song.tags?.[1] || 'Unknown Album',
        is_liked: false
      })) || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search songs')
      return []
    }
  }

  // Get playlist songs
  const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
    try {
      const { data, error } = await supabase
        .from('playlist_items')
        .select(`
          position,
          media_files (*)
        `)
        .eq('playlist_id', playlistId)
        .order('position')

      if (error) throw error

      return data?.map(item => ({
        ...item.media_files,
        artist: item.media_files.tags?.[0] || 'Unknown Artist',
        album: item.media_files.tags?.[1] || 'Unknown Album',
        is_liked: false
      })) || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlist songs')
      return []
    }
  }

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchSongs()
      fetchPlaylists()
    }
  }, [])

  return {
    songs,
    playlists,
    loading,
    error,
    fetchSongs,
    fetchPlaylists,
    createPlaylist,
    addToPlaylist,
    toggleLike,
    uploadSong,
    searchSongs,
    getPlaylistSongs,
    clearError: () => setError(null)
  }
}