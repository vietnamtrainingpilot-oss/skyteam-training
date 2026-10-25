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
    const getColor = (pct: number) => {
      if (pct >= 100) return 'bg-[var(--color-success)]'
      if (pct >= 70) return 'bg-[var(--color-accent)]'
      if (pct >= 30) return 'bg-[var(--color-warning)]'
      return 'bg-[var(--color-fg-tertiary)]'
    }

    return (
      <div ref={ref} className={cn('space-y-1.5', className)}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium text-[var(--color-fg)]">{label}</span>}
            {showPercentage && (
              <span className="text-sm text-[var(--color-fg-tertiary)]">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-separator)]">
          <div
            className={cn('h-full transition-all duration-500 ease-out', getColor(percentage))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'
