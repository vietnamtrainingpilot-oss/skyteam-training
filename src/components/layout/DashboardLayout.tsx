import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  UserCircle,
  Users,
  GraduationCap,
  Plane
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'Assessments', path: '/assessments', icon: FileText },
    { label: 'Profile', path: '/profile', icon: UserCircle }
  ]

  if (user.role === 'ADMIN') {
    links.push({ label: 'Admin', path: '/admin', icon: Users })
  }
  if (user.role === 'TRAINER') {
    links.push({ label: 'Trainer', path: '/trainer', icon: GraduationCap })
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="p-4 border-b border-[var(--color-border)]">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Plane className="h-5 w-5 text-[var(--color-primary)]" />
            <span>SkyTeam Training</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => {
            const Icon = link.icon
            const isActive = location.pathname === link.path ||
              (link.path !== '/dashboard' && location.pathname.startsWith(link.path))
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-fg)]'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-[var(--color-muted)] capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Plane className="h-5 w-5 text-[var(--color-primary)]" />
          <span>SkyTeam</span>
        </Link>
        <Link to="/profile" className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium">
          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-14">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg)] border-t border-[var(--color-border)] px-4 py-2 flex justify-around">
        {links.slice(0, 4).map(link => {
          const Icon = link.icon
          const isActive = location.pathname === link.path ||
            (link.path !== '/dashboard' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
