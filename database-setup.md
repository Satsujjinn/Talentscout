# Database Setup (PostgreSQL)

## Step-by-Step Instructions

### Option 1: Vercel Postgres (Recommended for Vercel Deployment)

#### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub, Google, or email
3. Complete the setup

#### 2. Create Postgres Database
1. In your Vercel dashboard, go to **"Storage"**
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a plan (Hobby is free)
5. Select a region (choose closest to your users)
6. Click **"Create"**

#### 3. Get Connection Strings
1. Click on your new database
2. Go to **"Settings"** → **"Environment Variables"**
3. Copy the **DATABASE_URL** and **POSTGRES_URL**
4. Add them to your `.env.local`:

```env
# Database (Vercel Postgres)
DATABASE_URL="postgresql://username:password@host:port/database"
POSTGRES_URL="postgresql://username:password@host:port/database"
```

### Option 2: Railway Postgres (Alternative)

#### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

#### 2. Add Postgres Database
1. Click **"New Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for it to be created
4. Go to **"Variables"** tab
5. Copy the **DATABASE_URL**

#### 3. Add to Environment Variables
```env
# Database (Railway Postgres)
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Option 3: Supabase (Free Alternative)

#### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create a new project

#### 2. Get Connection String
1. Go to **"Settings"** → **"Database"**
2. Copy the **Connection string**
3. Add to your `.env.local`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:password@host:port/postgres"
```

### 4. Run Database Migration

After setting up any of the above options, run:

```bash
# Generate Prisma client
npx prisma generate

# Push the database schema
npx prisma db push
```

### 5. Seed Test Data (Optional)

```bash
# Seed with test data
npm run seed
```

### 6. Test Database Connection

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Sign up for a new account
4. Try creating a profile
5. Check if data appears in your database dashboard

### 7. Verify Database Setup

Your database should now support:
- ✅ User profiles
- ✅ Match requests
- ✅ Real-time messages
- ✅ Image URLs

## Next Steps

Once the database is set up, we'll move on to:
1. **Cloudinary** (if not done yet)
2. **Deployment** (Vercel)

Let me know when you've completed the database setup! 