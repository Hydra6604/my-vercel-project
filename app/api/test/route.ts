import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Test if Supabase client is properly configured
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('Supabase connection test - expected error for local development:', error.message)
    }

    return NextResponse.json({
      status: 'success',
      message: 'Server is running correctly',
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      supabaseTest: {
        connected: !error || error.code === 'PGRST116', // PGRST116 means table doesn't exist, which is fine for testing
        error: error?.message || null,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('API test error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}