import React from 'react'
import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl mb-8">
          <Plane className="h-6 w-6 text-[var(--color-primary)]" />
          <span>SkyTeam Training</span>
        </Link>
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-[var(--color-muted)]">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
