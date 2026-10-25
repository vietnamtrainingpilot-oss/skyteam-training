import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline'
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors'

    const variants = {
      default: 'bg-[var(--color-surface-hover)] text-[var(--color-fg-secondary)]',
      primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
      success: 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
      warning: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
      destructive: 'bg-[var(--color-error)]/15 text-[var(--color-error)]',
      outline: 'border border-[var(--color-border)] text-[var(--color-fg-tertiary)]'
    }

    return (
      <div
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
