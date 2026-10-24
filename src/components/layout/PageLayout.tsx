import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function PageLayout({ children, title, description, actions }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {title && (
          <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
