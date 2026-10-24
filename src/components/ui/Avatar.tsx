import React from 'react'
import { cn } from '../../lib/utils'

interface AvatarProps {
  src?: string | null
  alt: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, size = 'md', className }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base'
    }

    const initials = fallback || alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
      <div
        ref={ref}
        className={cn('relative flex shrink-0 overflow-hidden rounded-full bg-[var(--color-primary-light)] items-center justify-center', sizes[size], className)}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="font-medium text-[var(--color-primary)]">{initials}</span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'
