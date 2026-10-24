import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <Plane className="h-5 w-5 text-[var(--color-primary)]" />
              <span>SkyTeam Training</span>
            </Link>
            <p className="text-sm text-[var(--color-muted)]">
              Professional aviation training platform for PTFS virtual airline alliance.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Training</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link to="/courses" className="hover:text-[var(--color-fg)] transition-colors">All Courses</Link></li>
              <li><Link to="/assessments" className="hover:text-[var(--color-fg)] transition-colors">Assessments</Link></li>
              <li><Link to="/dashboard" className="hover:text-[var(--color-fg)] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Departments</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>Flight Deck</li>
              <li>Cabin Crew</li>
              <li>Ground Crew</li>
              <li>Shared Core</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li><Link to="#" className="hover:text-[var(--color-fg)] transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-[var(--color-fg)] transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-[var(--color-fg)] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-muted)]">
          <p>&copy; {new Date().getFullYear()} SkyTeam Training. For virtual operations only. Not a substitute for real-world aviation training.</p>
        </div>
      </div>
    </footer>
  )
}
