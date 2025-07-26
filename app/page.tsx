export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MediaPlug
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your media management solution powered by Supabase
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            This is your MediaPlug application. You can now start building your media management features.
          </p>
          <a 
            href="/music" 
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🎵 Open Music Player
          </a>
        </div>
      </div>
    </main>
  )
}