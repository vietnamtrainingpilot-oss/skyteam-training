import React, { createContext, useContext, useState } from 'react'
import { cn } from '../../lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType>({ value: '', onValueChange: () => {} })

export function Tabs({ value: propValue, defaultValue, onValueChange, children }: { value?: string; defaultValue?: string; onValueChange?: (v: string) => void; children: React.ReactNode }) {
  const [internalValue, setInternalValue] = useState(propValue || defaultValue || '')
  const currentValue = propValue !== undefined ? propValue : internalValue
  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: onValueChange || setInternalValue }}>
      <div className="space-y-4">{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] p-1', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: activeValue, onValueChange } = useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive ? 'bg-[var(--color-bg)] text-[var(--color-fg)] shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: activeValue } = useContext(TabsContext)

  if (activeValue !== value) return null

  return (
    <div className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2', className)}>
      {children}
    </div>
  )
}
