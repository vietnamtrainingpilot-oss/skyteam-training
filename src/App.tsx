import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider } from './hooks/useToast'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { PageLayout } from './components/layout/PageLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'

// Lazy-loaded pages — pages use named exports, so we destructure in the then()
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Courses = lazy(() => import('./pages/Courses').then(m => ({ default: m.Courses })))
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.CourseDetail })))
const Learn = lazy(() => import('./pages/Learn').then(m => ({ default: m.Learn })))
const Assessments = lazy(() => import('./pages/Assessments').then(m => ({ default: m.Assessments })))
const AssessmentDetail = lazy(() => import('./pages/AssessmentDetail').then(m => ({ default: m.AssessmentDetail })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))
const Signup = lazy(() => import('./pages/auth/Signup').then(m => ({ default: m.Signup })))
const Signin = lazy(() => import('./pages/auth/Signin').then(m => ({ default: m.Signin })))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const TrainerDashboard = lazy(() => import('./pages/trainer/TrainerDashboard').then(m => ({ default: m.TrainerDashboard })))

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth/signin" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/assessments" element={<Assessments />} />

      <Route path="/auth/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/auth/signin" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signin />} />
      <Route path="/auth/forgot" element={<ForgotPassword />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <PageLayout>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </PageLayout>
        </ProtectedRoute>
      } />
      <Route path="/courses/:courseId/learn" element={
        <ProtectedRoute>
          <PageLayout>
            <DashboardLayout>
              <Learn />
            </DashboardLayout>
          </PageLayout>
        </ProtectedRoute>
      } />
      <Route path="/assessments/:assessmentId" element={
        <ProtectedRoute>
          <PageLayout>
            <DashboardLayout>
              <AssessmentDetail />
            </DashboardLayout>
          </PageLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <PageLayout title="Profile">
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </PageLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <PageLayout title="Admin Dashboard">
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </PageLayout>
        </ProtectedRoute>
      } />
      <Route path="/trainer" element={
        <ProtectedRoute>
          <PageLayout title="Trainer Dashboard">
            <DashboardLayout>
              <TrainerDashboard />
            </DashboardLayout>
          </PageLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

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
