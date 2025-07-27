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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

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
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-red-500/20 p-4 animate-slide-down">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-gradient p-2 rounded-lg animate-glow">
              <Music className="h-6 w-6 text-white animate-float" />
            </div>
            <h1 className="text-2xl font-bold text-white animate-fade-in-right">
              MediaPlug 
              <span className="text-transparent bg-clip-text bg-red-gradient ml-2 animate-shimmer">Music</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 animate-fade-in-left">
            <a 
              href="/music/upload"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-gentle group"
            >
              <Upload className="h-4 w-4 group-hover:animate-wiggle" />
              <span>Upload</span>
            </a>
            <div className="bg-red-500/20 p-2 rounded-full hover:bg-red-500/30 transition-colors animate-pulse-slow">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 pb-32">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-black/30 backdrop-blur-sm p-1 rounded-lg mb-6 w-fit animate-fade-in-up border border-red-500/20">
          {[
            { id: 'library', label: 'Library', icon: Music },
            { id: 'playlists', label: 'Playlists', icon: List },
            { id: 'search', label: 'Search', icon: Search }
          ].map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 animate-scale-in group ${
                activeTab === id
                  ? 'bg-red-gradient text-white shadow-lg animate-glow'
                  : 'text-white/70 hover:text-white hover:bg-red-500/20'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className={`h-4 w-4 ${activeTab === id ? 'animate-bounce-gentle' : 'group-hover:animate-wiggle'}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="mb-6 animate-fade-in">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5 group-focus-within:animate-pulse" />
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-red-200/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300 focus:shadow-lg focus:shadow-red-500/20 animate-slide-up"
              />
              <div className="absolute inset-0 bg-red-gradient opacity-0 group-focus-within:opacity-10 rounded-lg transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 animate-slide-up">
              <h2 className="text-2xl font-bold text-white animate-fade-in-right">Your Library</h2>
              <button className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-300 animate-fade-in-left">
                <Filter className="h-5 w-5 hover:animate-wiggle" />
              </button>
            </div>
            
            <div className="grid gap-2">
              {filteredSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="group bg-black/20 backdrop-blur-sm hover:bg-red-500/10 rounded-lg p-4 flex items-center space-x-4 transition-all duration-300 cursor-pointer border border-red-500/10 hover:border-red-400/30 hover:shadow-lg hover:shadow-red-500/10 animate-scale-in hover:scale-[1.02]"
                  onClick={() => handleSongSelect(song)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-red-200/70 w-6 text-sm font-medium">
                      {currentSong?.id === song.id && isPlaying ? (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-red-400 animate-pulse"></div>
                          <div className="w-1 h-4 bg-red-400 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-4 bg-red-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div className="w-12 h-12 bg-red-gradient rounded-md flex items-center justify-center group-hover:animate-glow transition-all duration-300 group-hover:scale-110">
                      {song.thumbnail_url ? (
                        <img src={song.thumbnail_url} alt={song.album} className="w-full h-full object-cover rounded-md group-hover:brightness-110 transition-all duration-300" />
                      ) : (
                        <Music className="h-6 w-6 text-white group-hover:animate-bounce-gentle" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{song.title}</h3>
                      <p className="text-white/70 text-sm">{song.artist}</p>
                    </div>
                    
                    <div className="text-white/50 text-sm">
                      {song.album}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-slide-in-right">
                      <button
                        className={`p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110 ${song.is_liked ? 'text-red-400 animate-heart-beat' : 'text-white/70 hover:text-red-300'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Toggle like functionality
                        }}
                      >
                        <Heart className={`h-4 w-4 ${song.is_liked ? 'fill-current' : ''} hover:animate-wiggle`} />
                      </button>
                      <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110">
                        <MoreHorizontal className="h-4 w-4 hover:animate-wiggle" />
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
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 animate-slide-up">
              <h2 className="text-2xl font-bold text-white animate-fade-in-right">Your Playlists</h2>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-gentle group">
                <span className="group-hover:animate-wiggle inline-block">Create Playlist</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist, index) => (
                <div
                  key={playlist.id}
                  className="bg-black/20 backdrop-blur-sm hover:bg-red-500/10 rounded-lg p-6 transition-all duration-300 cursor-pointer group border border-red-500/10 hover:border-red-400/30 hover:shadow-lg hover:shadow-red-500/20 animate-scale-in hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-full h-48 bg-red-gradient rounded-lg mb-4 flex items-center justify-center group-hover:animate-glow transition-all duration-300 relative overflow-hidden">
                    {playlist.thumbnail_url ? (
                      <img src={playlist.thumbnail_url} alt={playlist.title} className="w-full h-full object-cover rounded-lg group-hover:brightness-110 transition-all duration-300" />
                    ) : (
                      <List className="h-16 w-16 text-white group-hover:animate-float" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-200 transition-colors duration-300">{playlist.title}</h3>
                  <p className="text-white/70 text-sm mb-2 group-hover:text-red-200/80 transition-colors duration-300">{playlist.description}</p>
                  <p className="text-red-300/70 text-xs font-medium">{playlist.song_count} songs</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Music Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-red-500/20 p-4 animate-slide-up z-50">
          <div className="max-w-7xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-red-500/20 rounded-lg appearance-none cursor-pointer slider hover:h-2 transition-all duration-300"
              />
              <div className="flex justify-between text-xs text-red-200/70 mt-1 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Current Song Info */}
              <div className="flex items-center space-x-4 flex-1 animate-fade-in-right">
                <div className="w-14 h-14 bg-red-gradient rounded-lg flex items-center justify-center animate-glow">
                  {currentSong.thumbnail_url ? (
                    <img src={currentSong.thumbnail_url} alt={currentSong.album} className="w-full h-full object-cover rounded-lg animate-float" />
                  ) : (
                    <Music className="h-6 w-6 text-white animate-bounce-gentle" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-medium animate-slide-up">{currentSong.title}</h4>
                  <p className="text-red-200/80 text-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>{currentSong.artist}</p>
                </div>
                <button
                  className={`p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110 ${currentSong.is_liked ? 'text-red-400 animate-heart-beat' : 'text-white/70 hover:text-red-300'}`}
                >
                  <Heart className={`h-5 w-5 ${currentSong.is_liked ? 'fill-current' : ''} hover:animate-wiggle`} />
                </button>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-4 animate-scale-in-center">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110 ${isShuffled ? 'text-red-400 animate-pulse' : 'text-white/70 hover:text-red-300'}`}
                >
                  <Shuffle className="h-5 w-5 hover:animate-wiggle" />
                </button>
                
                <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110">
                  <SkipBack className="h-6 w-6 hover:animate-wiggle" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="bg-red-gradient text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 animate-glow group"
                >
                  {isPlaying ? <Pause className="h-6 w-6 group-hover:animate-pulse" /> : <Play className="h-6 w-6 group-hover:animate-bounce-gentle" />}
                </button>
                
                <button className="text-white/70 hover:text-white p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110">
                  <SkipForward className="h-6 w-6 hover:animate-wiggle" />
                </button>
                
                <button
                  onClick={() => {
                    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all']
                    const currentIndex = modes.indexOf(repeatMode)
                    const nextMode = modes[(currentIndex + 1) % modes.length]
                    setRepeatMode(nextMode)
                  }}
                  className={`p-2 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110 ${
                    repeatMode !== 'off' ? 'text-red-400 animate-pulse' : 'text-white/70 hover:text-red-300'
                  }`}
                >
                  <Repeat className="h-5 w-5 hover:animate-wiggle" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3 flex-1 justify-end animate-fade-in-left">
                <button onClick={toggleMute} className="text-white/70 hover:text-red-300 transition-all duration-300 hover:scale-110">
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5 hover:animate-wiggle" /> : <Volume2 className="h-5 w-5 hover:animate-wiggle" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-red-500/20 rounded-lg appearance-none cursor-pointer slider hover:h-2 transition-all duration-300"
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
          background: linear-gradient(135deg, #ff6b6b, #ee5a52, #dc2626);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52, #dc2626);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
          transition: all 0.3s ease;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
        }
        .slider::-webkit-slider-track {
          background: rgba(239, 68, 68, 0.2);
          height: 4px;
          border-radius: 2px;
        }
        .slider::-webkit-slider-track:hover {
          height: 6px;
        }
      `}</style>
    </div>
  )
}