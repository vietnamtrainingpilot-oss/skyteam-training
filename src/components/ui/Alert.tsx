import React from 'react'
import { cn } from '../../lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', children, ...props }, ref) => {
    const variants = {
      info: 'border-blue-200 bg-blue-50 text-blue-800',
      success: 'border-green-200 bg-green-50 text-green-800',
      warning: 'border-amber-200 bg-amber-50 text-amber-800',
      error: 'border-red-200 bg-red-50 text-red-800'
    }

    return (
      <div
        ref={ref}
        className={cn('rounded-lg border px-4 py-3 text-sm', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('font-medium leading-none', className)} {...props} />
  )
)
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'
