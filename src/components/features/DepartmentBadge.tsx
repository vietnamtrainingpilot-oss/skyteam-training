import React from 'react'
import { cn } from '../../lib/utils'
import { Department, ROLE_COLORS, ROLE_NAMES } from '../../lib/constants'

interface DepartmentBadgeProps {
  department: Department
  className?: string
  size?: 'sm' | 'md'
}

export const DepartmentBadge = React.forwardRef<HTMLSpanElement, DepartmentBadgeProps>(
  ({ department, className, size = 'md' }, ref) => {
    const color = ROLE_COLORS[department]
    const name = ROLE_NAMES[department]
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm'
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          sizes[size],
          className
        )}
        style={{
          backgroundColor: `${color}15`,
          color: color,
          border: `1px solid ${color}30`
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {name}
      </span>
    )
  }
)
DepartmentBadge.displayName = 'DepartmentBadge'
