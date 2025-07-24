import { supabase } from './supabase'
import { Database } from '../types/supabase'
import { uploadFile, generateFileName, getFileUrl } from '../utils/storage'

type MediaFile = Database['public']['Tables']['media_files']['Row']
type MediaFileInsert = Database['public']['Tables']['media_files']['Insert']
type MediaFileUpdate = Database['public']['Tables']['media_files']['Update']

export async function createMediaFile(
  file: File,
  title: string,
  description?: string,
  tags?: string[],
  isPublic?: boolean
) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Generate file path
    const fileName = generateFileName(file.name, user.id)
    
    // Upload file to storage
    const uploadResult = await uploadFile(file, 'media-files', fileName)
    if (uploadResult.error) {
      throw new Error(uploadResult.error)
    }

    // Create media file record
    const mediaFileData: MediaFileInsert = {
      user_id: user.id,
      title,
      description,
      file_name: file.name,
      file_path: uploadResult.data!.path,
      file_size: file.size,
      mime_type: file.type,
      tags,
      is_public: isPublic || false,
    }

    // If it's an image or video, extract dimensions
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const dimensions = await getMediaDimensions(file)
      mediaFileData.width = dimensions.width
      mediaFileData.height = dimensions.height
      
      if (file.type.startsWith('video/')) {
        mediaFileData.duration = dimensions.duration
      }
    }

    const { data, error } = await supabase
      .from('media_files')
      .insert(mediaFileData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create media file',
    }
  }
}

export async function getMediaFiles(
  userId?: string,
  publicOnly = false,
  limit = 20,
  offset = 0
) {
  try {
    let query = supabase
      .from('media_files')
      .select(`
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (publicOnly) {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch media files',
    }
  }
}

export async function updateMediaFile(id: string, updates: MediaFileUpdate) {
  try {
    const { data, error } = await supabase
      .from('media_files')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update media file',
    }
  }
}

export async function deleteMediaFile(id: string) {
  try {
    // First get the media file to know the file path
    const { data: mediaFile, error: fetchError } = await supabase
      .from('media_files')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media-files')
      .remove([mediaFile.file_path])

    if (storageError) {
      console.warn('Failed to delete file from storage:', storageError.message)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media_files')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw dbError
    }

    return { error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete media file',
    }
  }
}

export async function toggleLike(mediaFileId: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_file_id', mediaFileId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingLike) {
      // Remove like
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        throw deleteError
      }

      return { liked: false, error: null }
    } else {
      // Add like
      const { error: insertError } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          media_file_id: mediaFileId,
        })

      if (insertError) {
        throw insertError
      }

      return { liked: true, error: null }
    }
  } catch (error) {
    return {
      liked: false,
      error: error instanceof Error ? error.message : 'Failed to toggle like',
    }
  }
}

function getMediaDimensions(file: File): Promise<{
  width?: number
  height?: number
  duration?: number
}> {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => resolve({})
      img.src = URL.createObjectURL(file)
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: Math.round(video.duration),
        })
      }
      video.onerror = () => resolve({})
      video.src = URL.createObjectURL(file)
    } else {
      resolve({})
    }
  })
}