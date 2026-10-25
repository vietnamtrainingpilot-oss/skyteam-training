import React from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title?: string
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    const icons = {
      default: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info
    }
    const Icon = icons[variant]

    const variantClasses = {
      default: 'bg-[var(--color-surface-hover)] border-[var(--color-border)] text-[var(--color-fg-secondary)]',
      success: 'bg-green-500/10 border-green-500/30 text-green-700',
      warning: 'bg-amber-500/10 border-amber-500/30 text-amber-700',
      error: 'bg-red-500/10 border-red-500/30 text-red-700',
      info: 'bg-blue-500/10 border-blue-500/30 text-blue-700'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 rounded-lg border p-4 text-sm',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <Icon className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <p className="font-medium mb-1">{title}</p>}
          <div>{children}</div>
        </div>
      </div>
    )
  }
)
Alert.displayName = 'Alert'
