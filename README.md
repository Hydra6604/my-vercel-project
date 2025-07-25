# MediaPlug - Media Management Platform

A modern media management and sharing platform built with Next.js and Supabase.

## Features

- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 📁 **Media Management**: Upload, organize, and manage media files (images, videos, audio)
- 🎵 **Playlists**: Create and manage custom playlists
- 👥 **Social Features**: Follow users, like media, and comment
- 🔒 **Privacy Controls**: Public/private media sharing options
- 🏷️ **Tagging System**: Organize media with custom tags
- 📱 **Responsive Design**: Mobile-first responsive UI
- ⚡ **Real-time Updates**: Live updates with Supabase Realtime

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Database Schema

The application includes the following main tables:

- `profiles` - User profile information
- `media_files` - Media file metadata and storage references
- `playlists` - User-created playlists
- `playlist_items` - Media files within playlists
- `likes` - User likes on media files
- `comments` - Comments on media files
- `follows` - User follow relationships

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase CLI (for local development)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mediaplug
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase locally**
   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase

   # Start local Supabase instance
   supabase start
   ```

4. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   The default `.env.local` file is already configured for local development.

5. **Run database migrations**
   ```bash
   # The seed.sql file will automatically run when starting Supabase
   # To reset the database: supabase db reset
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - App: http://localhost:3000
   - Supabase Studio: http://localhost:54323
   - Inbucket (Email testing): http://localhost:54324

### Production Deployment

1. **Create a Supabase project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Deploy database schema**
   ```bash
   # Link to your project
   supabase link --project-ref your-project-ref

   # Push the schema
   supabase db push
   ```

3. **Update environment variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel --prod
   ```

## API Reference

### Authentication

The app uses Supabase Auth with the following helper functions:

```typescript
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'

// Get current user
const { user, loading } = useAuth()

// Get user profile
const { profile, updateProfile } = useProfile()
```

### Media Operations

```typescript
import { createMediaFile, getMediaFiles, deleteMediaFile } from './lib/media'

// Upload media file
const result = await createMediaFile(file, title, description, tags, isPublic)

// Get media files
const files = await getMediaFiles(userId, publicOnly, limit, offset)

// Delete media file
await deleteMediaFile(fileId)
```

### Storage Operations

```typescript
import { uploadFile, deleteFile } from './utils/storage'

// Upload file
const result = await uploadFile(file, 'media-files', path)

// Delete file
await deleteFile('media-files', path)
```

## Project Structure

```
mediaplug/
├── app/                    # Next.js app directory
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── supabase/              # Supabase configuration and migrations
│   ├── config.toml        # Local development config
│   └── seed.sql           # Database schema and initial data
├── .env.local             # Environment variables
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:reset` - Reset local database
- `npm run supabase:generate-types` - Generate TypeScript types

## Security Features

- **Row Level Security (RLS)**: All tables have RLS policies
- **File Upload Validation**: File type and size validation
- **User Authentication**: Required for protected operations
- **Privacy Controls**: Public/private content settings

## Storage Buckets

The application uses three main storage buckets:

- `media-files` - User uploaded media files
- `thumbnails` - Generated thumbnails for media
- `avatars` - User profile pictures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.
