import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Plane, LogOut, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { DepartmentBadge } from '../features/DepartmentBadge'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/auth/signin')
    setMobileMenuOpen(false)
  }

  const isPublicPage = ['/', '/courses', '/courses/:id', '/assessments', '/assessments/:id'].some(
    route => location.pathname === route || location.pathname.startsWith(route)
  )

  if (!user || isPublicPage) return null

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Courses', path: '/courses' },
    { label: 'Assessments', path: '/assessments' }
  ]

  if (user.role === 'ADMIN') {
    navLinks.push({ label: 'Admin', path: '/admin' })
  }
  if (user.role === 'TRAINER') {
    navLinks.push({ label: 'Trainer', path: '/trainer' })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Plane className="h-6 w-6 text-[var(--color-primary)]" />
          <span>SkyTeam Training</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${
                location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DepartmentBadge department={user.department} size="sm" />
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg hover:bg-[var(--color-bg-secondary)] px-2 py-1.5 transition-colors"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-[var(--color-muted)] capitalize">{user.role.toLowerCase()}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-lg p-2 text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <button
            className="md:hidden rounded-lg p-2 text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-bg-secondary)]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-error)] hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
