#!/bin/bash

# MediaPlug Setup Script
echo "🚀 Setting up MediaPlug..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📥 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI ready"

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📄 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

# Start Supabase (this will pull Docker images if needed)
echo "🐳 Starting Supabase local development environment..."
echo "This might take a few minutes on first run..."
supabase start

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Run 'npm run dev' to start the development server"
    echo "2. Open http://localhost:3000 in your browser"
    echo "3. Access Supabase Studio at http://localhost:54323"
    echo ""
    echo "🔗 Useful commands:"
    echo "- npm run dev                    # Start development server"
    echo "- npm run supabase:stop          # Stop Supabase"
    echo "- npm run supabase:reset         # Reset database"
    echo "- npm run supabase:generate-types # Generate TypeScript types"
    echo ""
else
    echo "❌ Failed to start Supabase. Please check the error messages above."
    exit 1
fi