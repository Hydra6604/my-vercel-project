import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../../types/supabase'

export function createClient() {
  // Provide default values for build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}