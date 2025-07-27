export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-down">
          Welcome to 
          <span className="text-transparent bg-clip-text bg-red-gradient animate-glow ml-2">
            MediaPlug
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">
          Your media management solution powered by Supabase
        </p>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-red-100 p-6 max-w-md mx-auto animate-scale-in hover:shadow-xl transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 animate-slide-up">Getting Started</h2>
          <p className="text-gray-600 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            This is your MediaPlug application. You can now start building your media management features.
          </p>
          <a 
            href="/music" 
            className="group inline-flex items-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-bounce-gentle relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 mr-2 animate-float">🎵</span>
            <span className="relative z-10">Open Music Player</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 animate-shimmer"></div>
          </a>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-red-400 rounded-full animate-float opacity-60" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-red-500 rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-red-300 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-10 w-2 h-2 bg-red-600 rounded-full animate-float opacity-70" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Animated background shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-red-200/30 to-red-400/30 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-red-300/20 to-red-500/20 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
    </main>
  )
}