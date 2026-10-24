# SkyTeam Training - Performance & Design Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve app performance, add animations, enhance design, and ensure web best practices compliance.

**Architecture:** Add React Query for data caching, Framer Motion for animations, implement code splitting, and polish UI components.

**Tech Stack:** React 18, Vite, Tailwind CSS, React Query, Framer Motion, Lucide React

**Spec:** This plan implements performance and design improvements based on web guidelines review.

## Global Constraints

- Bundle size must stay under 500KB after optimization
- All animations must be respect `prefers-reduced-motion`
- TypeScript strict mode must remain enabled
- No breaking changes to existing routes or components
- Dev server runs on port 5174

---

## Task 1: Set Up React Query for Data Caching

**Files:**
- Create: `src/lib/queryClient.ts`
- Modify: `src/App.tsx`
- Modify: `src/hooks/useCourses.tsx`
- Modify: `src/hooks/useAssessments.tsx`

**Interfaces:**
- Consumes: Existing `useCourses` and `useAssessments` hooks
- Produces: Cached data with automatic stale-time management

- [ ] **Step 1: Create queryClient configuration**

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})
```

- [ ] **Step 2: Wrap App with QueryClientProvider**

In `src/App.tsx`, add imports and wrap the component tree:

```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

// In the App component:
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with new dependencies

- [ ] **Step 4: Commit**

```bash
git add src/lib/queryClient.ts src/App.tsx
git commit -m "feat: add React Query for data caching"
```

---

## Task 2: Migrate useCourses to React Query

**Files:**
- Modify: `src/hooks/useCourses.tsx`
- Modify: `src/lib/supabase-api.ts`

**Interfaces:**
- Consumes: `getCourses()`, `getCourse()` from `src/lib/supabase-api.ts`
- Produces: Query hooks with caching and automatic refetching

- [ ] **Step 1: Rewrite useCourses hook with React Query**

```typescript
// src/hooks/useCourses.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCourses, getCourse as fetchCourse, updateCourseProgress as apiUpdateProgress } from '../lib/supabase-api'
import { Course } from '../lib/mockData'

export function useCourses() {
  const queryClient = useQueryClient()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  })

  const { data: currentCourse, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', queryClient.getQueryData(['courses'])],
    queryFn: ({ queryKey }: any) => {
      const [, courseId] = queryKey
      if (!courseId) return null
      return fetchCourse(courseId)
    },
    enabled: false
  })

  const updateProgress = useMutation({
    mutationFn: ({ userId, courseId, progress }: { userId: string; courseId: string; progress: number }) =>
      apiUpdateProgress(userId, courseId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  })

  return {
    courses,
    currentCourse,
    isLoading,
    isCourseLoading,
    fetchCourse: (id: string) => queryClient.fetchQuery({ queryKey: ['course', id], queryFn: () => fetchCourse(id) }),
    updateProgress
  }
}
```

- [ ] **Step 2: Update all components using useCourses**

Search for all imports of `useCourses` and update usage:
- `src/pages/Dashboard.tsx`
- `src/pages/Courses.tsx`
- `src/pages/CourseDetail.tsx`
- `src/pages/Learn.tsx`
- `src/pages/Profile.tsx`

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCourses.tsx
git commit -m "refactor: migrate useCourses to React Query"
```

---

## Task 3: Migrate useAssessments to React Query

**Files:**
- Modify: `src/hooks/useAssessments.tsx`
- Modify: `src/pages/Assessments.tsx`
- Modify: `src/pages/AssessmentDetail.tsx`
- Modify: `src/pages/Dashboard.tsx`

**Interfaces:**
- Consumes: `getAssessments()`, `getAssessment()` from `src/lib/supabase-api.ts`
- Produces: Query hooks with caching

- [ ] **Step 1: Rewrite useAssessments hook**

```typescript
// src/hooks/useAssessments.tsx
import { useQuery } from '@tanstack/react-query'
import { getAssessments, getAssessment } from '../lib/supabase-api'
import { Assessment } from '../lib/mockData'

export function useAssessments() {
  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => getAssessments()
  })

  const { data: currentAssessment, isLoading: isAssessmentLoading } = useQuery({
    queryKey: ['assessment', 'assessmentId'],
    queryFn: () => getAssessment('assessmentId'),
    enabled: false
  })

  return {
    assessments,
    currentAssessment,
    isLoading,
    isAssessmentLoading,
    fetchAssessment: (id: string) => assessments.find(a => a.id === id) || null
  }
}
```

- [ ] **Step 2: Update Dashboard to remove manual useEffect**

In `src/pages/Dashboard.tsx`, remove the `useEffect` that calls `fetchCourses()` and `fetchAssessments()` — React Query handles this automatically.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useAssessments.tsx src/pages/Dashboard.tsx
git commit -m "refactor: migrate useAssessments to React Query"
```

---

## Task 4: Add Code Splitting for Routes

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Existing page components
- Produces: Lazy-loaded routes with loading skeletons

- [ ] **Step 1: Convert route components to lazy imports**

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'

// Replace direct imports with lazy imports
const Home = lazy(() => import('./pages/Home'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Learn = lazy(() => import('./pages/Learn'))
const Assessments = lazy(() => import('./pages/Assessments'))
const AssessmentDetail = lazy(() => import('./pages/AssessmentDetail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Signin = lazy(() => import('./pages/auth/Signin'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const TrainerDashboard = lazy(() => import('./pages/trainer/TrainerDashboard'))
```

- [ ] **Step 2: Add Suspense boundaries with loading states**

```typescript
// Wrap AppRoutes with Suspense
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// Add PageLoader component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--color-muted)]">Loading...</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with code splitting

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add code splitting for routes"
```

---

## Task 5: Add Animations with Framer Motion

**Files:**
- Create: `src/components/ui/MotionCard.tsx`
- Create: `src/components/ui/MotionFade.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/pages/Courses.tsx`

**Interfaces:**
- Consumes: `framer-motion` library
- Produces: Animated cards and fade-in effects

- [ ] **Step 1: Create MotionCard component**

```typescript
// src/components/ui/MotionCard.tsx
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface MotionCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function MotionCard({ children, className, delay = 0 }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create MotionFade component**

```typescript
// src/components/ui/MotionFade.tsx
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface MotionFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function MotionFade({ children, className, delay = 0 }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Add animations to Home page departments**

```typescript
// In src/pages/Home.tsx
{departments.map((dept, i) => (
  <MotionCard key={dept.id} delay={i * 0.1}>
    {/* department card content */}
  </MotionCard>
))}
```

- [ ] **Step 4: Add animations to Dashboard stats**

```typescript
// In src/pages/Dashboard.tsx
{stats.map((stat, i) => (
  <MotionCard key={stat.label} delay={i * 0.05}>
    {/* stat card */}
  </MotionCard>
))}
```

- [ ] **Step 5: Verify animations work**

Run: `npm run dev`
Expected: Cards animate in on load

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/MotionCard.tsx src/components/ui/MotionFade.tsx src/pages/Home.tsx src/pages/Dashboard.tsx
git commit -m "feat: add framer-motion animations"
```

---

## Task 6: Improve Dashboard Design

**Files:**
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/components/ui/Card.tsx`

**Interfaces:**
- Consumes: Existing UI components
- Produces: Enhanced visual design with better spacing and hierarchy

- [ ] **Step 1: Enhance stat cards with icons and gradients**

```typescript
// Update Dashboard stats section
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat, i) => (
    <MotionCard key={stat.label} delay={i * 0.05}>
      <div className="card bg-gradient-to-br from-[var(--color-card-bg)] to-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-card-border)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
            <stat.icon className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
        </div>
      </div>
    </MotionCard>
  ))}
</div>
```

- [ ] **Step 2: Add welcome banner with gradient**

```typescript
// Add at top of Dashboard
<MotionFade>
  <div className="rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] p-6 text-white">
    <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(' ')[0]}! ✈️</h1>
    <p className="mt-2 text-white/80">You have {inProgressCourses.length} courses in progress. Keep up the great work!</p>
  </div>
</MotionFade>
```

- [ ] **Step 3: Improve course cards layout**

```typescript
// Enhanced course cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {courses.slice(0, 3).map((course, i) => (
    <MotionCard key={course.id} delay={i * 0.1}>
      <Link to={`/courses/${course.id}`} className="block group">
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5 hover:border-[var(--color-primary)]/50 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <DepartmentBadge department={course.department} />
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              {course.progress}%
            </span>
          </div>
          <h3 className="font-semibold text-lg group-hover:text-[var(--color-primary)] transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">{course.description}</p>
          <div className="mt-4">
            <ProgressBar value={course.progress} showPercentage={false} />
          </div>
        </div>
      </Link>
    </MotionCard>
  ))}
</div>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: improve dashboard design with animations"
```

---

## Task 7: Enhance Home Page Design

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: Framer Motion components
- Produces: Polished landing page with better visual hierarchy

- [ ] **Step 1: Add animated hero section**

```typescript
// Enhanced hero with motion
<motion.section
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="relative overflow-hidden bg-[var(--color-bg)]"
>
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary-light)] rounded-full opacity-20"
    />
    <motion.div
      animate={{
        y: [0, 20, 0],
        rotate: [0, -5, 0]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--color-cabin-crew)] rounded-full opacity-10"
    />
  </div>
  
  {/* Content */}
  <div className="container mx-auto px-4 py-20 md:py-32 relative">
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-medium"
      >
        <Plane className="h-4 w-4" />
        PTFS Virtual Airline Alliance
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-fg)]"
      >
        Professional Aviation Training
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto"
      >
        SkyTeam Training provides comprehensive certification programs for Flight Deck, Cabin Crew, and Ground Crew operations.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
      >
        {/* CTA buttons */}
      </motion.div>
    </div>
  </div>
</motion.section>
```

- [ ] **Step 2: Add feature cards with hover effects**

```typescript
// Enhanced features section
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map((feature, i) => (
    <MotionCard key={feature.title} delay={0.2 + i * 0.1}>
      <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-[var(--color-bg-secondary)] transition-colors">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)]"
        >
          <feature.icon className="h-8 w-8 text-[var(--color-primary)]" />
        </motion.div>
        <h3 className="text-lg font-semibold text-[var(--color-fg)]">{feature.title}</h3>
        <p className="text-[var(--color-muted)]">{feature.description}</p>
      </div>
    </MotionCard>
  ))}
</div>
```

- [ ] **Step 3: Enhance Footer**

```typescript
// In Footer component
<footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo and description */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Plane className="h-6 w-6 text-[var(--color-primary)]" />
          <span>SkyTeam Training</span>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          Professional aviation training platform for PTFS virtual airline alliance.
        </p>
      </div>
      
      {/* Quick Links */}
      <div>
        <h4 className="font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/courses" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">Courses</Link></li>
          <li><Link to="/assessments" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">Assessments</Link></li>
          <li><Link to="/auth/signin" className="text-[var(--color-muted)] hover:text-[var(--color-primary)]">Sign In</Link></li>
        </ul>
      </div>
      
      {/* Departments */}
      <div>
        <h4 className="font-semibold mb-4">Departments</h4>
        <ul className="space-y-2 text-sm">
          <li><span className="text-[var(--color-muted)]">Flight Deck</span></li>
          <li><span className="text-[var(--color-muted)]">Cabin Crew</span></li>
          <li><span className="text-[var(--color-muted)]">Ground Crew</span></li>
          <li><span className="text-[var(--color-muted)]">Shared Core</span></li>
        </ul>
      </div>
      
      {/* Legal */}
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><span className="text-[var(--color-muted)]">Privacy Policy</span></li>
          <li><span className="text-[var(--color-muted)]">Terms of Service</span></li>
        </ul>
      </div>
    </div>
    
    <div className="mt-8 pt-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-muted)]">
      <p>© {new Date().getFullYear()} SkyTeam Training. All rights reserved.</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/components/layout/Footer.tsx
git commit -m "feat: enhance home page design with animations"
```

---

## Task 8: Optimize CSS and Add Dark Mode Support

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Consumes: Existing CSS variables
- Produces: Optimized styles with full dark mode support

- [ ] **Step 1: Add dark mode CSS variables**

```css
/* In src/index.css */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #000000;
    --color-bg-secondary: #1c1c1e;
    --color-fg: #f5f5f7;
    --color-muted: #86868b;
    --color-primary-light: rgba(0, 102, 204, 0.15);
    --color-border: #38383a;
    --color-separator: #2c2c2e;
    --color-card-bg: #1c1c1e;
    --color-card-border: #38383a;
  }
}

[data-theme="dark"] {
  --color-bg: #000000;
  --color-bg-secondary: #1c1c1e;
  --color-fg: #f5f5f7;
  --color-muted: #86868b;
  --color-primary-light: rgba(0, 102, 204, 0.15);
  --color-border: #38383a;
  --color-separator: #2c2c2e;
  --color-card-bg: #1c1c1e;
  --color-card-border: #38383a;
}
```

- [ ] **Step 2: Enable dark mode in Tailwind**

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  // ... rest of config
}
```

- [ ] **Step 3: Add theme toggle component**

```typescript
// src/components/ui/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
```

- [ ] **Step 4: Add theme toggle to Header**

```typescript
// In src/components/layout/Header.tsx
import { ThemeToggle } from '../ui/ThemeToggle'

// Add to header controls
<ThemeToggle />
```

- [ ] **Step 5: Verify dark mode works**

Run: `npm run dev`
Expected: Toggle button switches between light/dark themes

- [ ] **Step 6: Commit**

```bash
git add src/index.css tailwind.config.js src/components/ui/ThemeToggle.tsx src/components/layout/Header.tsx
git commit -m "feat: add dark mode support with theme toggle"
```

---

## Task 9: Optimize Bundle Size

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Vite build configuration
- Produces: Optimized bundles with tree-shaking

- [ ] **Step 1: Configure Vite for optimal bundling**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@tanstack/react-query'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
```

- [ ] **Step 2: Verify bundle sizes**

Run: `npm run build`
Expected: Check dist/assets/ for chunk sizes

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: optimize build configuration for code splitting"
```

---

## Task 10: Final Testing and Polish

**Files:**
- Modify: `src/pages/*.tsx` (as needed)
- Modify: `src/components/**/*.tsx` (as needed)

**Interfaces:**
- Consumes: All previous improvements
- Produces: Production-ready application

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds, no warnings

- [ ] **Step 3: Test all routes**
- [ ] Home page loads with animations
- [ ] Dashboard shows cached data
- [ ] Course detail page loads
- [ ] Assessment page works
- [ ] Dark mode toggle works
- [ ] Mobile responsive on all pages
- [ ] All links navigate correctly

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete performance and design improvements"
```
