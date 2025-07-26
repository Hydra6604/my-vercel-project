'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Heart,
  MoreHorizontal,
  Music,
  List,
  Search,
  Filter,
  Upload,
  User
} from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  file_path: string
  thumbnail_url?: string
  is_liked: boolean
}

interface Playlist {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  song_count: number
}

export default function MusicPage() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off')
  const [activeTab, setActiveTab] = useState<'library' | 'playlists' | 'search'>('library')
  const [searchQuery, setSearchQuery] = useState('')
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Sample data - replace with real Supabase data
  const [songs] = useState<Song[]>([
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 355,
      file_path: '/music/bohemian-rhapsody.mp3',
      thumbnail_url: '/thumbnails/queen.jpg',
      is_liked: true
    },
    {
      id: '2',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 391,
      file_path: '/music/hotel-california.mp3',
      thumbnail_url: '/thumbnails/eagles.jpg',
      is_liked: false
    },
    {
      id: '3',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration: 482,
      file_path: '/music/stairway-to-heaven.mp3',
      thumbnail_url: '/thumbnails/led-zeppelin.jpg',
      is_liked: true
    }
  ])

  const [playlists] = useState<Playlist[]>([
    {
      id: '1',
      title: 'Rock Classics',
      description: 'The best rock songs of all time',
      thumbnail_url: '/thumbnails/rock-classics.jpg',
      song_count: 25
    },
    {
      id: '2',
      title: 'My Favorites',
      description: 'Songs I love to listen to',
      thumbnail_url: '/thumbnails/favorites.jpg',
      song_count: 12
    }
  ])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong])

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Audio element */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.file_path}
          onLoadedData={() => {
            if (isPlaying && audioRef.current) {
              audioRef.current.play()
            }
          }}
        />
      )}

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MediaPlug Music</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/music/upload"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </a>
            <div className="bg-white/10 p-2 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 pb-32">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-black/20 p-1 rounded-lg mb-6 w-fit">
          {[
            { id: 'library', label: 'Library', icon: Music },
            { id: 'playlists', label: 'Playlists', icon: List },
            { id: 'search', label: 'Search', icon: Search }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === id
                  ? 'bg-white text-gray-900'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Library</h2>
              <button className="text-white/70 hover:text-white">
                <Filter className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid gap-2">
              {filteredSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 flex items-center space-x-4 transition-all cursor-pointer"
                  onClick={() => handleSongSelect(song)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-white/50 w-6 text-sm">
                      {currentSong?.id === song.id && isPlaying ? (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                          <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                      {song.thumbnail_url ? (
                        <img src={song.thumbnail_url} alt={song.album} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <Music className="h-6 w-6 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{song.title}</h3>
                      <p className="text-white/70 text-sm">{song.artist}</p>
                    </div>
                    
                    <div className="text-white/50 text-sm">
                      {song.album}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className={`p-2 rounded-full hover:bg-white/10 ${song.is_liked ? 'text-red-500' : 'text-white/70'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Toggle like functionality
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-white/50 text-sm w-12 text-right">
                      {formatTime(song.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists Tab */}
        {activeTab === 'playlists' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                Create Playlist
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-6 transition-all cursor-pointer group"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                    {playlist.thumbnail_url ? (
                      <img src={playlist.thumbnail_url} alt={playlist.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <List className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{playlist.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{playlist.description}</p>
                  <p className="text-white/50 text-xs">{playlist.song_count} songs</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Music Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Current Song Info */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  {currentSong.thumbnail_url ? (
                    <img src={currentSong.thumbnail_url} alt={currentSong.album} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Music className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-medium">{currentSong.title}</h4>
                  <p className="text-white/70 text-sm">{currentSong.artist}</p>
                </div>
                <button
                  className={`p-2 rounded-full hover:bg-white/10 ${currentSong.is_liked ? 'text-red-500' : 'text-white/70'}`}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-full hover:bg-white/10 ${isShuffled ? 'text-green-500' : 'text-white/70'}`}
                >
                  <Shuffle className="h-5 w-5" />
                </button>
                
                <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
                  <SkipBack className="h-6 w-6" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="bg-white text-black p-3 rounded-full hover:bg-white/90 transition-colors"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                
                <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
                  <SkipForward className="h-6 w-6" />
                </button>
                
                <button
                  onClick={() => {
                    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all']
                    const currentIndex = modes.indexOf(repeatMode)
                    const nextMode = modes[(currentIndex + 1) % modes.length]
                    setRepeatMode(nextMode)
                  }}
                  className={`p-2 rounded-full hover:bg-white/10 ${
                    repeatMode !== 'off' ? 'text-green-500' : 'text-white/70'
                  }`}
                >
                  <Repeat className="h-5 w-5" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3 flex-1 justify-end">
                <button onClick={toggleMute} className="text-white/70 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #8b5cf6;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #8b5cf6;
        }
      `}</style>
    </div>
  )
}