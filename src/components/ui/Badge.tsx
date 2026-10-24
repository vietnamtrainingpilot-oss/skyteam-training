import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline'
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-bg-secondary)] text-[var(--color-fg)]',
      primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
      success: 'bg-[var(--color-cabin-crew-light)] text-[var(--color-success)]',
      warning: 'bg-[var(--color-ground-crew-light)] text-[var(--color-warning)]',
      destructive: 'bg-red-50 text-[var(--color-error)]',
      outline: 'border border-[var(--color-border)] text-[var(--color-muted)]'
    }

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
