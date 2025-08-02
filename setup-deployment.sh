#!/bin/bash

echo "🚀 Talent Scout ZA - Deployment Setup"
echo "====================================="

# Check if git remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote repository configured"
    echo "Please run: git remote add origin https://github.com/yourusername/talent-scout-za.git"
    echo "Then run: git push -u origin main"
    exit 1
fi

echo "✅ Git remote configured"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
SOCKET_SERVER_URL=http://localhost:3001

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF
    echo "✅ Created .env.local template"
    echo "⚠️  Please update .env.local with your actual credentials"
else
    echo "✅ .env.local already exists"
fi

# Check if build works
echo "🔨 Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix any errors before deploying."
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update .env.local with your credentials"
echo "2. Push to GitHub: git push origin main"
echo "3. Choose your deployment platform:"
echo "   - Vercel (recommended): https://vercel.com"
echo "   - Railway: https://railway.app"
echo "   - Netlify: https://netlify.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🔧 Required Services:"
echo "- Clerk (authentication): https://clerk.com"
echo "- Cloudinary (images): https://cloudinary.com"
echo "- PostgreSQL database"
echo ""
echo "Good luck with your deployment! 🚀" 