import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'MediaPlug API is working!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}