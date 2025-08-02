# Vercel Deployment Quick Start

## 🚀 You're 95% Ready!

Your codebase is production-ready. Follow these steps to deploy:

## Step 1: Push to GitHub
```bash
git push origin main
```

## Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `talent-scout-za`

## Step 3: Configure Environment Variables
In Vercel dashboard, add these environment variables:

### Database (Vercel Postgres recommended)
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Authentication (Clerk)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
```

### App URLs
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
SOCKET_SERVER_URL=https://your-app.vercel.app
```

### Image Storage (Cloudinary)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Deploy
Click "Deploy" - Vercel will automatically:
- Install dependencies
- Run build process
- Deploy to production

## Step 5: Set Up External Services

### Clerk (Authentication)
1. Go to [clerk.com](https://clerk.com)
2. Create new application
3. Copy API keys to Vercel environment variables

### Cloudinary (Image Storage)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create account
3. Copy credentials to Vercel environment variables

### Database
**Option A: Vercel Postgres (Recommended)**
1. In Vercel dashboard, go to Storage
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`

**Option B: External PostgreSQL**
- Use Supabase, Railway, or any PostgreSQL provider

## Step 6: Socket.io Server (Optional)
For real-time features, deploy the socket server:

### Option A: Vercel Functions
Convert `socket-server.js` to Vercel serverless functions

### Option B: Separate Deployment
Deploy to Railway/Render and update `SOCKET_SERVER_URL`

## ✅ Success Indicators
- Build completes successfully
- All environment variables are set
- Database is connected
- Authentication works
- Image uploads work

## 🎯 Expected Timeline
- **Setup**: 15-30 minutes
- **Deployment**: 5-10 minutes
- **Testing**: 10-15 minutes

**Total: ~1 hour to full deployment**

---
*Your codebase is production-ready! 🚀* 