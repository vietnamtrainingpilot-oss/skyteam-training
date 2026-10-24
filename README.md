# SkyTeam Training

Professional aviation training platform for PTFS virtual airline alliance.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server on http://localhost:5174
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Setup Supabase

### 1. Create Project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run Database Schema
Copy `docs/database-setup.sql` and paste into Supabase SQL Editor, then run it.

### 3. Configure Environment Variables
Create `.env.local` (or update `.env`) with your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Get Your Credentials
- Go to **Settings → API** in Supabase dashboard
- Copy **Project URL** and **anon/public key**

## Running Locally

```bash
# Development mode (hot reload)
npm run dev
# App runs on http://localhost:5174

# Production build
npm run build
# Output in dist/ folder

# Preview production build
npm run preview
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts and authentication |
| `departments` | FLIGHT_DECK, CABIN_CREW, GROUND_CREW, SHARED_CORE |
| `courses` | Training courses |
| `modules` | Course modules |
| `lessons` | Video/reading/quiz content |
| `assessments` | Test/exam questions |
| `assessment_questions` | Question bank |
| `user_course_progress` | Learning progress tracking |
| `assessment_results` | Exam scores |
| `trainees` | Trainer-managed trainees |

## Security

All tables have Row Level Security (RLS) policies pre-configured:
- Users can only read their own data
- Admins have full access
- Trainers can manage their department's trainees

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Set environment variables in your hosting provider's dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Default Login
- **Email:** admin@skyteam.training
- **Password:** admin123

## Technology Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- React Router v6
- Lucide React icons
- Supabase (PostgreSQL + Auth)
- React Context + useReducer for state management

## Project Structure

```
skyteam-training/
├── docs/
│   ├── database-setup.sql    # Complete database schema
│   ├── SUPABASE_SETUP.md     # Step-by-step Supabase guide
│   └── HOSTING_GUIDE.md      # Deployment instructions
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Badge, Input, etc.
│   │   ├── layout/          # Header, Footer, DashboardLayout
│   │   └── features/        # DepartmentBadge, ProgressBar
│   ├── hooks/
│   │   ├── useAuth.tsx      # Authentication hook
│   │   ├── useCourses.tsx   # Course management
│   │   └── useAssessments.tsx # Assessment management
│   ├── lib/
│   │   ├── api.ts           # Mock API layer
│   │   ├── supabase.ts      # Supabase client
│   │   ├── supabase-api.ts  # Supabase API functions
│   │   ├── mockData.ts      # Mock data types
│   │   └── constants.ts     # Department/Role constants
│   └── pages/               # All page components
├── .env.example             # Environment variables template
└── vite.config.ts           # Vite configuration (port 5174)
```

## Troubleshooting

### Port Conflict
If port 5174 is in use, change it in `vite.config.ts`:
```typescript
server: {
  port: 5175, // or any available port
}
```

### Build Errors
Make sure all dependencies are installed:
```bash
npm install --production=false
```

### Supabase Connection
Verify your environment variables are set correctly. Check browser console for errors.
