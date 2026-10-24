import React from 'react'
import { cn } from '../../lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, label, showPercentage = true, className }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} className={cn('space-y-1.5', className)}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium">{label}</span>}
            {showPercentage && (
              <span className="text-sm text-[var(--color-muted)]">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-separator)]">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'
