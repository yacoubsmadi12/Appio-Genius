#!/bin/bash

echo "🚀 Building project for Vercel deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/public

# Build frontend using Vercel-specific config
echo "🔨 Building frontend with Vercel configuration..."
npx vite build --config vite.config.vercel.ts

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Frontend files are ready in: dist/public"
    echo ""
    echo "📋 Next steps for Vercel deployment:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your GitHub repository to Vercel"
    echo "3. Set the following environment variables in Vercel:"
    echo "   - VITE_FIREBASE_API_KEY"
    echo "   - VITE_FIREBASE_PROJECT_ID" 
    echo "   - VITE_FIREBASE_APP_ID"
    echo "4. Vercel will automatically use the vercel.json configuration"
    echo ""
    echo "🎯 Build command for Vercel: vite build --config vite.config.vercel.ts"
    echo "📂 Output directory for Vercel: dist/public"
else
    echo "❌ Build failed!"
    exit 1
fi