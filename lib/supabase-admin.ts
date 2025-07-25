import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables for admin client. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
  )
}

// This should only be used on the server side
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Helper function to get a user by ID (admin only)
export const getUserById = async (userId: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)
  if (error) {
    console.error('Error getting user by ID:', error.message)
    return null
  }
  return data.user
}

// Helper function to delete a user (admin only)
export const deleteUser = async (userId: string) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) {
    console.error('Error deleting user:', error.message)
  }
  return error
}