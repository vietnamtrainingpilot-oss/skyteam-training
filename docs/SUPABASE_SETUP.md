# SkyTeam Training - Supabase Setup Guide

## Prerequisites

- A Supabase account ([supabase.com](https://supabase.com))
- Node.js 18+ installed
- Git (optional, for version control)

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Select your organization (or create one)
   - **Name**: `SkyTeam Training`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for the database to be provisioned

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the contents of `docs/database-setup.sql` from this repository
4. Paste into the editor and click **"Run"**
5. Verify tables are created by going to **Table Editor**

## Step 3: Get Your API Credentials

1. Go to **Settings** → **API** in the Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

## Step 4: Configure Environment Variables

Create or update `.env` in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5174`.

## Migration Notes

The app currently uses mock data. To switch to Supabase:

1. The `src/lib/api.ts` file contains mock API calls
2. Create `src/lib/supabase.ts` with the Supabase client
3. Update hooks to use Supabase instead of mocks

See `src/lib/supabase-api.ts` template below for guidance.

## Security Checklist

- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up SSO if needed (Google, GitHub, etc.)
- [ ] Configure RLS policies (schema includes these)
- [ ] Set up database backups
- [ ] Review storage buckets if adding file uploads
