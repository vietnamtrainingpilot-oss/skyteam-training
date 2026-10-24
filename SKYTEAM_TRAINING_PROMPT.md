# SkyTeam Training - Website Application Build Prompt

## Project Overview
Build a **SkyTeam Training** web application for PTFS (Pilot Training Flight Simulator) virtual airline alliance. This is a professional aviation training platform with three training tracks: **Flight Deck**, **Cabin Crew**, **Ground Crew**, plus **Shared Core** alliance training.

**Stack**: React 18 + Vite + Tailwind CSS + plain CSS modules (NO Prisma, NO complex backend, NO ORM)
- Frontend: React 18 + Vite
- Styling: Tailwind CSS + plain CSS modules + CSS custom properties
- Routing: React Router v6
- State: React Context + useReducer (no Redux, no Zustand)
- Build: Vite (fast, simple)
- Deploy: Static hosting (Netlify/Vercel/Cloudflare Pages)

---

## Technology Stack (Simple & Reliable)

| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | React 18 + Vite | Fast dev, simple config, great HMR |
| Styling | Tailwind CSS + CSS Modules + CSS Custom Properties | Utility-first + component-scoped styles |
| Routing | React Router v6 | Standard, well-documented |
| State | React Context + useReducer | Built-in, no extra deps |
| Build | Vite | Lightning fast, zero config |
| Deploy | Static (Netlify/Vercel/Cloudflare) | Zero config, global CDN |
| Icons | Lucide React | Clean, consistent, tree-shakable |

**NO**: Prisma, Next.js, NextAuth, complex ORMs, heavy state libraries, server-side rendering

---

## Design System - Apple-Style Aviation Theme

### Colors (CSS Custom Properties)
```css
:root {
  /* Apple-style aviation palette */
  --color-bg: #ffffff;
  --color-fg: #1d1d1f;
  --color-muted: #86868b;
  --color-muted-light: #f5f5f7;
  
  /* Aviation Blue - Primary */
  --color-primary: #0066cc;
  --color-primary-hover: #0052a3;
  --color-primary-light: #e8f0fe;
  --color-primary-fg: #ffffff;
  
  /* Department Colors */
  --color-flight-deck: #0066cc;    /* Blue */
  --color-cabin-crew: #30a46c;     /* Green */
  --color-ground-crew: #d4a843;    /* Amber */
  --color-shared-core: #7c3aed;    /* Violet */
  
  /* Semantic */
  --color-success: #30a46c;
  --color-warning: #d4a843;
  --color-error: #de3f2f;
  
  /* Neutral */
  --color-border: #d2d2d7;
  --color-separator: #e5e5ea;
  --color-card-bg: #ffffff;
  --color-card-border: #d2d2d7;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  
  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 24px rgba(0,0,0,0.12);
  
  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Typography (Apple SF Pro Style)
```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  
  /* Apple-style type scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  
  --leading-tight: 1.1;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

---

## Page Structure & Routes

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/` | Landing/Marketing | Hero, Departments Grid, Benefits, Training Path, CTA |
| `/courses` | Course Catalog | Grid of course cards with progress |
| `/courses/:id` | Course Detail | Modules, lessons, progress tracking |
| `/courses/:id/learn` | Learning View | Module sidebar, lesson content, video/reading |
| `/assessments` | Assessment Hub | Tabs: Written Exams / Practical Evaluations |
| `/assessments/:id` | Assessment Detail | Questions, timer, submission |
| `/dashboard` | Learner Dashboard | Progress, upcoming, quick actions |
| `/profile` | User Profile | Stats, completed courses, certifications |
| `/auth/signup` | Sign Up | Form with department selection |
| `/auth/signin` | Sign In | Email/password form |
| `/auth/forgot` | Password Reset | Email entry |
| `/admin` | Admin Dashboard | Users, courses, airlines, reports |
| `/trainer` | Trainer Dashboard | Trainees, grading queue, reports |

---

## Component Architecture

### Shared Components (`/components/ui/`)
- `Button` - Primary, Secondary, Outline, Ghost, Destructive
- `Card` - Card, CardHeader, CardContent, CardFooter
- `Badge` - Default, Primary, Success, Warning, Destructive, Outline
- `Input` - Text, Email, Password, Textarea
- `Select` - Single, Multi
- `Tabs` - TabsList, TabsTrigger, TabsContent
- `Progress` - Linear, Circular
- `Avatar` - Image, Fallback
- `DropdownMenu` - Trigger, Content, Item, Separator
- `Tooltip` - Content, Provider
- `Toast` - Toast, ToastProvider, Toaster
- `Modal/Dialog` - Overlay, Content, Title, Description
- `Tooltip` - Hover/focus tooltip
- `Accordion` - Item, Trigger, Content
- `Table` - Table, Header, Row, Cell, Head
- `Checkbox` / `RadioGroup` / `Switch`
- `Alert` - Info, Success, Warning, Error
- `Breadcrumb` - Navigation breadcrumbs
- `Pagination` - Page navigation
- `Skeleton` - Loading placeholders

### Layout Components (`/components/layout/`)
- `Header` - Logo, navigation, user menu, theme toggle
- `Sidebar` - Navigation links, collapsible
- `Footer` - Links, legal, social
- `PageLayout` - Wrapper with header/sidebar/main
- `DashboardLayout` - Dashboard-specific layout
- `AuthLayout` - Centered auth forms
- `PageHeader` - Title, description, actions

### Feature Components (`/components/features/`)
- `CourseCard` - Course display with progress
- `ModuleList` - Expandable module/lesson list
- `LessonPlayer` - Video/reading content player
- `ProgressRing` - Circular progress indicator
- `ProgressBar` - Linear progress with label
- `DepartmentBadge` - Colored department indicator
- `AssessmentCard` - Assessment preview card
- `QuestionRenderer` - MCQ/TrueFalse/Essay rendering
- `RubricTable` - Practical evaluation rubric
- `ProgressTracker` - Visual progress through modules
- `CertificationBadge` - Earned certification display
- `TrainerQueue` - Grading queue for trainers
- `RubricGrader` - Interactive rubric grading
- `UserAvatar` - Avatar with fallback initials

---

## State Management (Simple)

```jsx
// AuthContext - User session
const AuthContext = createContext(null);

// CourseContext - Current course, progress
const CourseContext = createContext(null);

// UIContext - Theme, sidebar, toasts
const UIContext = createContext(null);

// All use React Context + useReducer
// No external state library needed
```

---

## API Layer (Mockable)

```javascript
// /src/lib/api.js
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Mock data in /src/lib/mockData.js for development
```

---

## Routing Structure

```jsx
// App.tsx
<BrowserRouter>
  <AuthProvider>
    <UIProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/learn" element={<Learn />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/assessments/:id" element={<AssessmentDetail />} />
        
        {/* Auth */}
        <Route path="/auth/signup" element={<AuthLayout><Signup /></AuthLayout>} />
        <Route path="/auth/signin" element={<AuthLayout><Signin /></AuthLayout>} />
        <Route path="/auth/forgot" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        
        {/* Protected */}
        <Route element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} path="/dashboard" />
        <Route element={<ProtectedRoute><DashboardLayout><CourseDetail /></DashboardLayout></ProtectedRoute>} path="/courses/:id" />
        <Route element={<ProtectedRoute><DashboardLayout><Learn /></DashboardLayout></ProtectedRoute>} path="/courses/:id/learn" />
        <Route element={<ProtectedRoute><DashboardLayout><Assessments /></DashboardLayout></ProtectedRoute>} path="/assessments" />
        <Route element={<ProtectedRoute><DashboardLayout><AssessmentDetail /></DashboardLayout></ProtectedRoute>} path="/assessments/:id" />
        <Route element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} path="/profile" />
        
        {/* Admin/Trainer */}
        <Route element={<ProtectedRoute role="ADMIN"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} path="/admin" />
        <Route element={<ProtectedRoute role="TRAINER"><TrainerLayout><TrainerDashboard /></TrainerLayout></ProtectedRoute>} path="/trainer" />
      </Routes>
    </UIProvider>
  </AuthProvider>
</BrowserRouter>
```

---

## Key Design Principles (from all skills)

### Emil Kowalski Animation Principles
1. **Never animate keyboard-initiated actions** - instant response
2. **Ease-out for entering, ease-in-out for moving** - never ease-in
3. **150-250ms for UI, 200-500ms for modals** - fast feels responsive
4. **Spring physics for organic feel** - `cubic-bezier(0.34, 1.56, 0.64, 1)`
5. **Respect `prefers-reduced-motion`** - disable non-essential motion
6. **Button press: `scale(0.97)` 120ms** - instant tactile feedback
7. **Card hover: subtle border + shadow** - not transform
8. **Stagger children 80ms** - cascade entrance

### Design-Taste-Frontend (Anti-Slop)
1. **Hero max pt-24, max 4 text elements** - no overflow
2. **Bento grids: visual diversity required** - no 6 identical cards
3. **Eyebrow restraint: max 1 per 3 sections** - not every section
4. **Zigzag alternation max 2** - break pattern on 3rd
5. **Bento background diversity** - 2-3 cells with real images/gradients
6. **Color consistency lock** - one accent per page
7. **No pure black/white** - off-black/off-white for depth
8. **No AI purple gradients** - aviation blue palette only
9. **Copy self-audit mandatory** - flag AI hallucination copy

### Impeccable Design Principles
1. **Go all out - no hedging** - complete deliverable
2. **Verify in bounded passes** - screenshot, defect scan, micro-edit, rebuild
3. **The brief wins** - honor pinned aesthetics
4. **Refinement preserves; redesign replaces** - don't split difference
5. **Visual authority = evidence, not filename** - prove it works

### UI/UX Pro Max
1. **Accessibility FIRST** - 4.5:1 contrast, keyboard nav, ARIA labels
2. **Touch targets 44x44px minimum** - 8px spacing between
3. **Performance: WebP/AVIF, lazy load, CLS < 0.1**
4. **Typography: base 16px, line-height 1.5, semantic tokens**
5. **Animation: context-aware, motion conveys meaning**
6. **Forms: visible labels, error near field, helper text**

---

## Database (Simple JSON Files - No Prisma)

```javascript
// /src/lib/data/users.js
export const users = [
  { id: '1', email: 'alex@skyteam.example', name: 'Alex Chen', role: 'TRAINEE', department: 'FLIGHT_DECK', airline: 'SkyTeam Aviation', avatar: null, progress: 65 },
  // ...
];

// /src/lib/data/courses.js
export const courses = [
  { id: 'fd-core', title: 'Flight Deck Core Operations', department: 'FLIGHT_DECK', modules: 8, progress: 65, status: 'In Progress', description: '...' },
  // ...
];

// /src/lib/data/assessments.js
export const assessments = [
  { id: 'we-1', title: 'Flight Deck Written Exam', type: 'written', department: 'FLIGHT_DECK', questions: 14, passingScore: 70 },
  // ...
];
```

---

## Environment Variables

```env
# .env
VITE_APP_NAME=SkyTeam Training
VITE_API_URL=/api
VITE_APP_URL=http://localhost:5173
```

---

## Commands

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx"
}
```

---

## File Structure

```
skyteam-training/
├── .env
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── mockData.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── components/
│   │   ├── ui/           # 20+ base components
│   │   ├── layout/       # Header, Sidebar, Footer, layouts
│   │   ├── features/     # CourseCard, ModuleList, etc.
│   │   └── icons/        # Lucide wrapper
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CourseContext.tsx
│   │   └── UIContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useAssessments.ts
│   │   └── useToast.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── Learn.tsx
│   │   ├── Assessments.tsx
│   │   ├── AssessmentDetail.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── auth/
│   │   │   ├── Signup.tsx
│   │   │   ├── Signin.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx
│   │   └── trainer/
│   │       └── TrainerDashboard.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CourseContext.tsx
│   │   └── UIContext.tsx
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── utilities.css
├── .env
├── .gitignore
└── README.md
```

---

## AI Agent Instructions

### Model Selection (freellmapi router)
Route to best available model per task:
- **Design/Architecture**: Use best reasoning model (Claude 3.5 Sonnet / GPT-4o)
- **Implementation**: Fast coding model (Claude 3.5 Haiku / GPT-4o-mini)
- **Design Review**: Best visual reasoning (GPT-4o vision / Claude 3.5)
- **Code Review**: Strict reasoning model
- **Testing**: Fast model with tool use

### Agent Delegation
- **Design System Agent**: Build tokens, components, theme
- **Page Builder Agent**: Implement pages from designs
- **Component Library Agent**: Build reusable UI kit
- **State/Logic Agent**: Auth, course progress, assessments
- **Review Agent**: Critique against all design principles
- **QA Agent**: Browser testing, accessibility, responsive

### Quality Gates (Must Pass)
1. **TypeScript strict** - no `any`, strict mode
2. **ESLint + Prettier** - zero warnings
3. **Build passes** - `vite build` succeeds
4. **Accessibility** - axe-core passes, keyboard nav works
5. **Responsive** - 320px, 768px, 1024px, 1440px breakpoints
6. **Performance** - Lighthouse > 90 all categories
7. **Design Review** - passes all skill principles

---

## Quick Start Commands

```bash
# Initialize project
npm create vite@latest skyteam-training -- --template react-ts
cd skyteam-training

# Install deps
npm install
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npm install lucide-react clsx tailwind-merge react-router-dom
npm install -D @types/react @types/react-dom

# Init Tailwind
npx tailwindcss init -p

# Dev server
npm run dev
```

---

## Acceptance Criteria (Definition of Done)

- [ ] All pages render without errors
- [ ] Navigation works (router, protected routes)
- [ ] Auth flow works (signup/signin/logout)
- [ ] Courses display with progress
- [ ] Assessments render (written + practical)
- [ ] Dashboard shows progress/stats
- [ ] Profile shows stats/courses/certs
- [ ] Admin/Trainer dashboards render
- [ ] Mobile responsive (320px-1440px)
- [ ] Dark mode works
- [ ] Animations respect reduced-motion
- [ ] Keyboard navigation works everywhere
- [ ] Focus visible on all interactive elements
- [ ] Color contrast ≥ 4.5:1
- [ ] Lighthouse > 90 all categories
- [ ] TypeScript strict compiles
- [ ] ESLint zero warnings
- [ ] Build succeeds

---

## Notes for AI Agents

1. **Read this entire prompt before starting**
2. **Follow Apple design principles exactly** - not "Apple-like", actual Apple HIG
3. **Use CSS custom properties** - not Tailwind arbitrary values for design tokens
4. **Write semantic HTML** - proper heading hierarchy, landmarks
5. **Test in browser** - don't assume it works, verify
6. **No `any` types** - strict TypeScript
7. **Component composition** - small, reusable, single-purpose
8. **Accessibility first** - not an afterthought
9. **Performance budgets** - <100KB JS gzipped, <50KB CSS
10. **Ship complete** - no TODOs in production code

---

## Reference Materials (in project)

- `ptc-training/ptc-training-main/` - Source training materials (3 departments, assessments, rubrics)
- Phase 1: 10 MCQ + 4 written per dept (26 pts)
- Phase 2: Practical - FD 48/60, CC 44/55, GC 40/50 (80% pass)
- 3 Departments: Flight Deck, Cabin Crew, Ground Crew + Shared Core

---

**Start building now. No planning phase. Build the complete application.**