# Cloudinary Image Storage Setup

## Step-by-Step Instructions

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up For Free"
3. Create an account (you can use Google, GitHub, or email)
4. Verify your email address

### 2. Get Your Credentials

1. After signing in, you'll be taken to your dashboard
2. Look for your **Cloud Name** (displayed prominently)
3. Go to **"Settings"** → **"Access Keys"**
4. You'll see:
   - **API Key**
   - **API Secret**
5. Copy all three values:
   - Cloud Name
   - API Key
   - API Secret

### 3. Update Environment Variables

Add these to your `.env.local` file:

```env
# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Test Image Upload

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Sign up/sign in
4. Go to your profile page
5. Try uploading a profile image
6. Check if it appears in your Cloudinary dashboard

### 5. Configure Cloudinary Settings (Optional)

1. In your Cloudinary dashboard, go to **"Settings"** → **"Upload"**
2. You can configure:
   - **Upload presets** for different image types
   - **Transformation settings** for automatic resizing
   - **Security settings** for upload restrictions

### 6. Verify Setup

Your image upload should now work with:
- ✅ Automatic image optimization
- ✅ Face detection for better cropping
- ✅ Secure HTTPS URLs
- ✅ Automatic format optimization

## Next Steps

Once Cloudinary is set up, we'll move on to:
1. **Database** (PostgreSQL)
2. **Deployment** (Vercel)

Let me know when you've completed the Cloudinary setup! 