import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UserCircle,
  Users,
  GraduationCap,
  Plane,
  BookText,
  FileCheck
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { departmentInfo } from '../../lib/constants'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const isAdmin = user.role === 'ADMIN'
  const isTrainer = user.role === 'TRAINER'
  const deptMeta = departmentInfo[user.department as keyof typeof departmentInfo]

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Handbooks', path: '/handbooks', icon: BookText },
    { label: 'Stage Testing', path: '/stage-testing', icon: FileCheck }
  ]

  links.push({ label: 'Profile', path: '/profile', icon: UserCircle })

  if (isTrainer || isAdmin) {
    links.push({ label: 'Trainer', path: '/trainer', icon: GraduationCap })
    links.push({ label: 'Training Info', path: '/training-information', icon: FileCheck })
  }

  if (isAdmin) {
    links.push({ label: 'Admin', path: '/admin', icon: Users })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-64 z-50 flex-col border-r"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: deptMeta?.color || 'var(--color-primary)' }}
            >
              <Plane className="h-4 w-4" style={{ color: 'var(--color-fg)', fill: 'none' }} />
            </div>
            <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-fg)' }}>
              SkyTeam Training
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="flex flex-col gap-0.5">
            {links.map(link => {
              const Icon = link.icon
              const isActive = location.pathname === link.path ||
                (link.path !== '/dashboard' && location.pathname.startsWith(link.path))

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--color-primary)]/12 text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-fg)]'
                  }`}
                  style={isActive
                    ? { color: deptMeta?.color || 'var(--color-primary)' }
                    : undefined
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}18`,
                color: deptMeta?.color || 'var(--color-primary)'
              }}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-fg)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Link to="/" className="flex items-center gap-2 font-semibold text-sm" style={{ color: 'var(--color-fg)' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: deptMeta?.color || 'var(--color-primary)' }}
          >
            <Plane className="h-3.5 w-3.5" style={{ color: 'var(--color-fg)', fill: 'none' }} />
          </div>
          <span>SkyTeam</span>
        </Link>
        <Link to="/profile" className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}18`, color: deptMeta?.color || 'var(--color-primary)' }}
        >
          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </Link>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="mx-auto px-4 py-8 lg:py-12 pb-28 lg:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 -1px 4px rgba(0,0,0,0.06)'
        }}
      >
        {links.map(link => {
          const Icon = link.icon
          const isActive = location.pathname === link.path ||
            (link.path !== '/dashboard' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all"
              style={{ color: isActive ? (deptMeta?.color || 'var(--color-primary)') : 'var(--color-muted)' }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
