# Supabase Database Setup

## Step-by-Step Instructions

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Complete the setup

### 2. Create New Project

1. Click "New Project"
2. Fill in the details:
   - **Organization**: Your personal account
   - **Project name**: `talent-scout-za`
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East)
3. Click "Create new project"
4. Wait for setup to complete (2-3 minutes)

### 3. Get Database Connection String

1. In your project dashboard, go to **"Settings"** → **"Database"**
2. Scroll down to **"Connection string"**
3. Copy the **URI** connection string
4. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

### 4. Update Environment Variables

Replace your current DATABASE_URL in `.env.local`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

### 5. Test Database Connection

Run these commands to test the connection:

```bash
# Generate Prisma client
npx prisma generate

# Push the database schema
npx prisma db push
```

### 6. Seed Test Data (Optional)

```bash
# Seed with test data
npm run seed
```

### 7. Test in Development

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Sign up for a new account
4. Create a profile
5. Check if data appears in Supabase dashboard

### 8. Verify Setup

Your Supabase database should now support:
- ✅ User profiles
- ✅ Match requests
- ✅ Real-time messages
- ✅ Image URLs

## Next Steps

Once Supabase is set up, we'll:
1. **Set up Cloudinary** (if not done)
2. **Deploy to Vercel**
3. **Deploy Socket.io server**

Let me know when you've completed the Supabase setup! 