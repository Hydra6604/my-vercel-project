import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediaPlug',
  description: 'A media management application with Supabase integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 animate-gradient-x">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-transparent to-red-600/10 animate-gradient-x"></div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}