#!/bin/bash

# URL Shortener Deployment Script
# This script deploys both frontend and backend to Vercel

set -e  # Exit on any error

echo "🚀 Starting URL Shortener Deployment..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: backend and frontend directories not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🔧 Setting up environment variables..."

# Check if production environment files exist
if [ ! -f "backend/.env.production" ]; then
    echo "❌ backend/.env.production not found"
    echo "Please create backend/.env.production with your environment variables"
    exit 1
fi

if [ ! -f "frontend/.env.production" ]; then
    echo "❌ frontend/.env.production not found"
    echo "Please create frontend/.env.production with your environment variables"
    exit 1
fi

echo "🚀 Deploying Backend..."
cd backend

# Deploy backend to Vercel
echo "Deploying backend to Vercel..."
vercel --prod

backend_url=$(vercel ls | grep "backend" | head -1 | awk '{print $2}')
echo "✅ Backend deployed to: $backend_url"

cd ..

echo "🚀 Deploying Frontend..."
cd frontend

# Deploy frontend to Vercel
echo "Deploying frontend to Vercel..."
vercel --prod

frontend_url=$(vercel ls | grep "frontend" | head -1 | awk '{print $2}')
echo "✅ Frontend deployed to: $frontend_url"

cd ..

echo ""
echo "🎉 Deployment Complete!"
echo "📱 Frontend URL: $frontend_url"
echo "🔧 Backend URL: $backend_url"
echo ""
echo "🔍 Next steps:"
echo "1. Update your backend CORS settings if needed"
echo "2. Test the deployed application"
echo "3. Check Vercel dashboard for any issues"