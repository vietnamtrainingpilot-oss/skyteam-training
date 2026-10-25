import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Plane } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { DepartmentBadge } from '../features/DepartmentBadge'
import { ThemeToggle } from '../ui/ThemeToggle'
import { departmentInfo } from '../../lib/constants'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const deptMeta = user ? departmentInfo[user.department as keyof typeof departmentInfo] : null

  const handleSignOut = () => {
    signOut()
    navigate('/auth/signin')
    setMobileMenuOpen(false)
  }

  const isPublicPage = location.pathname === '/'

  if (!user || isPublicPage) return null

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Handbooks', path: '/handbooks' },
    { label: 'Stage Testing', path: '/stage-testing' }
  ]

  if (user.role === 'TRAINER' || user.role === 'ADMIN') {
    navLinks.push({ label: 'Trainer', path: '/trainer' })
  }
  if (user.role === 'TRAINER' || user.role === 'ADMIN') {
    navLinks.push({ label: 'Training Info', path: '/training-information' })
  }
  if (user.role === 'ADMIN') {
    navLinks.push({ label: 'Admin', path: '/admin' })
  }

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-opacity-80"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 1px 0 var(--color-border-soft)'
      }}
    >
      <div className="mx-auto px-4 h-14 flex items-center justify-between max-w-screen-2xl">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-sm tracking-tight" style={{ color: 'var(--color-fg)' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: deptMeta?.color || 'var(--color-primary)' }}
          >
            <Plane className="h-3.5 w-3.5" style={{ color: 'var(--color-fg)', fill: 'none' }} />
          </div>
          <span>SkyTeam Training</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              aria-current={location.pathname === link.path ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                location.pathname === link.path
                  ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-hover)]'
              }}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {deptMeta && <DepartmentBadge department={user.department} size="sm" />}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)]"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none" style={{ color: 'var(--color-fg)' }}>{user.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{user.role.toLowerCase()}</p>
            </div>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold shadow-sm"
              style={{ backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}18`, color: deptMeta?.color || 'var(--color-primary)' }}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-xl p-2 transition-all text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-error)]"
            aria-label="Sign out"
          >
            <Plane className="h-4 w-4 rotate-180" />
          </button>
          <button
            className="md:hidden rounded-xl p-2 transition-all"
            style={{ color: 'var(--color-muted)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 space-y-1"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === link.path
                  ? (deptMeta?.color || 'var(--color-primary)')
                  : 'var(--color-muted)',
                backgroundColor: location.pathname === link.path ? `${deptMeta?.color || 'var(--color-primary)'}10` : 'transparent'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] transition-colors block"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: 'var(--color-error)' }}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  )
}
