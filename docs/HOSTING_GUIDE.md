# SkyTeam Training - Hosting Guide

## Quick Start (5 minutes)

### 1. Set Up Supabase (Backend)
```bash
# Already done - just run the SQL
# Go to your Supabase dashboard → SQL Editor → Paste docs/database-setup.sql → Run
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials
```

### 3. Run Locally
```bash
npm install
npm run dev
# App runs on http://localhost:5174
```

### 4. Build for Production
```bash
npm run build
# Output in dist/ folder
```

## Hosting Options

### Option A: Vercel (Recommended - Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
```
- Free tier includes custom domains
- Automatic HTTPS
- CI/CD on git push

### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```
- Free tier with custom domains
- Form handling built-in
- Simple Git integration

### Option C: Supabase + Vercel (Full Stack)
1. Deploy frontend on Vercel
2. Connect to Supabase backend
3. Set environment variables in Vercel dashboard
4. Configure Supabase RLS policies

## Database Schema

The application uses these tables:
- `users` - User accounts and authentication
- `departments` - Training departments (4 fixed values)
- `courses` - Course catalog
- `modules` - Course modules
- `lessons` - Individual lessons (video/reading/quiz)
- `assessments` - Test/exam questions
- `assessment_questions` - Question bank
- `user_course_progress` - Learning progress tracking
- `assessment_results` - Exam results
- `trainees` - Trainer-managed trainees

## Security Notes

- All RLS policies are pre-configured in the SQL schema
- User passwords should use Supabase Auth (not custom table)
- Email confirmation recommended in Supabase Auth settings
- Review storage buckets if adding file uploads

## Custom Domain Setup

### Vercel
```bash
vercel domains add yourdomain.com
```
Set DNS CNAME to `cname.vercel-dns.com`

### Netlify
```bash
netlify domains add yourdomain.com
```
Set DNS CNAME to `yourproject.netlify.app`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `VITE_APP_NAME` | No | Application name |
| `VITE_APP_URL` | No | App URL for redirects |
| `VITE_API_URL` | No | API base URL |
