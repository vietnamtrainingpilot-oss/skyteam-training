import React, { createContext, useContext, useState } from 'react'
import { cn } from '../../lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ value, defaultValue, onValueChange, children }: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}) {
  const [internalValue, setInternalValue] = useState(value || defaultValue || '')
  const currentValue = value !== undefined ? value : internalValue

  return (
    <TabsContext.Provider value={{
      value: currentValue,
      onValueChange: onValueChange || setInternalValue
    }}>
      <div className="space-y-4">{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsList must be used within Tabs')

  return (
    <div
      className={cn(
        'flex items-center space-x-1 rounded-lg bg-[var(--color-surface-hover)] p-1',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
        ctx.value === value
          ? 'bg-[var(--color-accent)] text-white shadow-sm'
          : 'text-[var(--color-fg-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-fg)]',
        className
      )}
      onClick={() => ctx.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ className, value, children }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')

  if (ctx.value !== value) return null

  return (
    <div className={cn('pt-2', className)}>{children}</div>
  )
}
