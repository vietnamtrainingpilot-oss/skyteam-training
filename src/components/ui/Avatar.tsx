import React from 'react'
import { cn } from '../../lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex-shrink-0 rounded-full overflow-hidden bg-[var(--color-primary)] text-white flex items-center justify-center font-medium',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || name || ''} className="h-full w-full object-cover" />
        ) : name ? (
          name.split(' ').map(n => n[0]).join('').slice(0, 2)
        ) : null}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'
