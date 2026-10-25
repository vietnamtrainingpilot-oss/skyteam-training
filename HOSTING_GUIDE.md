# SkyTeam Training — Hosting Guide

**Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Supabase
**Live URL:** `https://wispbyte.com` (DNS target after setup)

---

## Architecture

```
┌─────────────────────────────────────┐
│  GitHub Pages (frontend)            │
│  https://yourusername.github.io/    │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│  Supabase (backend)                 │
│  Auth · Database · Storage · Edge   │
└─────────────────────────────────────┘
```

- **Frontend**: Static SPA served from GitHub Pages
- **Backend**: Supabase handles auth, database, and API (no server needed)

---

## Prerequisites

1. GitHub account
2. [Supabase](https://supabase.com) account (free tier is plenty)
3. This repo pushed to GitHub

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Note your **Project URL** and **anon/public key** (Settings → API)
3. Run the SQL schema below in the SQL Editor

### Database Schema (run in Supabase SQL Editor)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'TRAINER', 'TRAINEE')),
  department TEXT NOT NULL CHECK (department IN ('FLIGHT_DECK', 'CABIN_CREW', 'GROUND_CREW', 'SHARED_CORE')),
  airline TEXT,
  discord TEXT,
  region TEXT,
  experience TEXT,
  heard_about TEXT,
  avatar TEXT,
  progress INTEGER DEFAULT 0,
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  max_score INTEGER DEFAULT 100,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment questions
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'essay')),
  options JSONB,
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment results
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN,
  answers JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- User course progress
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies (simplified — adjust for your needs)
CREATE POLICY "Public courses are readable" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do everything" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
```

---

## Step 2: Configure Environment Variables

Your `.env` already has the correct variables:

```bash
VITE_SUPABASE_URL=https://wiuqujhltcaowmrkafcg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Add these as GitHub Secrets** (Settings → Secrets → Actions):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

⚠️ **Never commit `.env` to Git** — it's already in `.gitignore`.

---

## Step 3: GitHub Setup

### Create the repository

```bash
cd "D:\Skyteam Training\skyteam-training"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skyteam-training.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to repo **Settings → Pages**
2. Source: **GitHub Actions**
3. Deployments branch: **main**

The workflow will auto-deploy on every push to main.

---

## Step 4: Connect Custom Domain (optional)

If you want `https://wispbyte.com/`:

1. In GitHub: **Settings → Pages → Custom domain** → enter `wispbyte.com`
2. Add a `CNAME` file to your repo root:
   ```
   wispbyte.com
   ```
3. In your DNS provider (Cloudflare, Namecheap, etc.), add:
   - CNAME record: `www` → `YOUR_USERNAME.github.io`
   - A records for apex domain (if supported):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

GitHub will auto-provision HTTPS via Let's Encrypt.

---

## Manual Build & Deploy

```bash
# Build locally
npm run build

# Preview build
npm run preview
```

Build output goes to `dist/`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page after deploy | Check browser console for errors |
| Auth not working | Verify Supabase URL and key in GitHub Secrets |
| 404 on refresh | Ensure `public/404.html` exists (SPA routing) |
| Images not loading | Check relative paths — use `/assets/...` not `./assets/...` |

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:5174
```
