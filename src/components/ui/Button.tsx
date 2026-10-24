import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]'

    const variants = {
      primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
      secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-fg)] hover:bg-[var(--color-separator)] focus-visible:ring-[var(--color-muted)]',
      outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-bg-secondary)] focus-visible:ring-[var(--color-primary)]',
      ghost: 'bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-bg-secondary)] focus-visible:ring-[var(--color-muted)]',
      destructive: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)/90] focus-visible:ring-[var(--color-error)]'
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
