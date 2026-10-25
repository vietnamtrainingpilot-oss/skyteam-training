import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider } from './hooks/useToast'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { DashboardLayout } from './components/layout/DashboardLayout'

// Lazy-loaded pages — pages use named exports, so we destructure in the then()
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))
const Signup = lazy(() => import('./pages/auth/Signup').then(m => ({ default: m.Signup })))
const Signin = lazy(() => import('./pages/auth/Signin').then(m => ({ default: m.Signin })))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })))
const Handbooks = lazy(() => import('./pages/Handbooks').then(m => ({ default: m.Handbooks })))
const TrainingInformation = lazy(() => import('./pages/TrainingInformation').then(m => ({ default: m.TrainingInformation })))
const StageTestingList = lazy(() => import('./pages/StageTesting').then(m => ({ default: m.StageTestingList })))
const StageTesting = lazy(() => import('./pages/StageTesting').then(m => ({ default: m.StageTesting })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const TrainerDashboard = lazy(() => import('./pages/trainer/TrainerDashboard').then(m => ({ default: m.TrainerDashboard })))
const TrainerExamGrading = lazy(() => import('./pages/trainer/TrainerExamGrading').then(m => ({ default: m.TrainerExamGrading })))

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

      <Route path="/auth/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/auth/signin" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signin />} />
      <Route path="/auth/forgot" element={<ForgotPassword />} />
      <Route path="/onboarding" element={isAuthenticated ? <Onboarding /> : <Navigate to="/auth/signin" replace />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/trainer" element={
        <ProtectedRoute>
          <DashboardLayout>
            <TrainerDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/trainer/exams" element={
        <ProtectedRoute>
          <DashboardLayout>
            <TrainerExamGrading />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/handbooks" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Handbooks />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/training-information" element={
        <ProtectedRoute>
          <DashboardLayout>
            <TrainingInformation />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/stage-testing" element={
        <ProtectedRoute>
          <DashboardLayout>
            <StageTestingList />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/stage-testing/:stageId" element={
        <ProtectedRoute>
          <DashboardLayout>
            <StageTesting />
          </DashboardLayout>
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
