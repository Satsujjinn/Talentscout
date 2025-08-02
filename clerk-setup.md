# Clerk Authentication Setup

## Step-by-Step Instructions

### 1. Create Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Click "Get Started" or "Sign Up"
3. Create an account (you can use GitHub, Google, or email)

### 2. Create New Application

1. After signing in, click "Create Application"
2. Fill in the details:
   - **Application name**: `Talent Scout ZA`
   - **Application URL**: `http://localhost:3000` (for development)
3. Click "Create Application"

### 3. Configure Authentication

1. In your Clerk dashboard, go to **"User & Authentication"**
2. Under **"Email, Phone, Username"**, make sure **Email** is enabled
3. Under **"Social Connections"**, you can enable:
   - Google (recommended)
   - GitHub (recommended)
   - Or keep it email-only for now

### 4. Get Your API Keys

1. Go to **"API Keys"** in the sidebar
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)
3. Copy both keys

### 5. Update Environment Variables

Add these to your `.env.local` file:

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### 6. Configure Domains

1. Go to **"Domains"** in the sidebar
2. Add your development domain: `http://localhost:3000`
3. Later, you'll add your production domain (e.g., `https://your-app.vercel.app`)

### 7. Test Authentication

Run your development server:
```bash
npm run dev
```

Visit `http://localhost:3000` and try to sign up/sign in.

## Next Steps

Once Clerk is set up, we'll move on to:
1. **Cloudinary** (for image uploads)
2. **Database** (PostgreSQL)
3. **Deployment** (Vercel)

Let me know when you've completed the Clerk setup! 