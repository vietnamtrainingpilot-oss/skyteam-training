import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { departmentInfo } from '../../lib/constants'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Helmet>
        <title>{title} | SkyTeam Training</title>
        <meta name="description" content={subtitle} />
      </Helmet>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-8"
          style={{ background: 'radial-gradient(circle, var(--color-cabin-crew, #059669) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-base tracking-tight text-[var(--color-fg)] mb-10">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plane className="h-4 w-4 text-[var(--color-fg)]" />
          </div>
          <span>SkyTeam Training</span>
        </Link>

        {/* Card */}
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-semibold tracking-tight text-[var(--color-fg)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">{subtitle}</p>
          </div>

          <div
            className="rounded-2xl border p-6 bg-[var(--color-surface)]"
            style={{ borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
