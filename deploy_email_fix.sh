#!/bin/bash
# Email Verification Fix Deployment Script

echo "🚀 Deploying Email Verification Fix..."
echo "=================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the URL-Shortner root directory"
    exit 1
fi

echo "📝 Changes to be deployed:"
echo "- Fixed frontend/vercel.json for SPA routing"
echo "- Updated API URLs to new backend"
echo "- Added rewrites configuration"
echo ""

# Show current git status
echo "📊 Git Status:"
git status --porcelain
echo ""

# Commit changes if any
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Committing changes..."
    git add .
    git commit -m "Fix: Email verification 404 errors - Vercel SPA routing configuration"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Push to repository
echo "📤 Pushing to repository..."
git push origin main
echo "✅ Changes pushed"

echo ""
echo "🎯 Next Steps:"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Find your frontend project: url-shortner-shahzad"
echo "3. Trigger a new deployment (it should auto-deploy from git push)"
echo "4. Or run: vercel --prod (from frontend directory)"
echo ""
echo "🧪 After deployment, test:"
echo "- Registration: https://url-shortner-shahzad.vercel.app/register"
echo "- Email verification link format:"
echo "  https://url-shortner-shahzad.vercel.app/verify-email?token=TOKEN"
echo ""
echo "✅ Deployment script completed!"
echo "⏳ Wait for Vercel deployment to complete before testing"
