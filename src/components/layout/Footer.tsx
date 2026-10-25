import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-panel)]/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-[var(--color-fg)]">
              <Plane className="h-5 w-5 text-[var(--color-primary)]" />
              <span>SkyTeam Training</span>
            </Link>
            <p className="text-sm text-[var(--color-fg-secondary)]">
              Professional aviation training platform for PTFS virtual airline alliance.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-[var(--color-fg)]">Training</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/handbooks" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Handbooks</Link></li>
              <li><Link to="/training-information" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Training Information</Link></li>
              <li><Link to="/stage-testing" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Stage Testing</Link></li>
              <li><Link to="/dashboard" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-[var(--color-fg)]">Departments</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-[var(--color-fg-secondary)]">Flight Deck</li>
              <li className="text-[var(--color-fg-secondary)]">Cabin Crew</li>
              <li className="text-[var(--color-fg-secondary)]">Ground Crew</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-[var(--color-fg)]">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#terms" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Privacy Policy</a></li>
              <li><a href="mailto:training@skyteam-va.com" className="text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-fg-tertiary)]">
          <p>&copy; {new Date().getFullYear()} SkyTeam Training. For virtual operations only. Not a substitute for real-world aviation training.</p>
        </div>
      </div>
    </footer>
  )
}
