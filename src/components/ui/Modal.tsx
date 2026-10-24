import React, { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        onClose()
      }
    }
    dialog.addEventListener('click', handleBackdropClick)
    return () => dialog.removeEventListener('click', handleBackdropClick)
  }, [onClose])

  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-0 z-50 m-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-0 shadow-lg backdrop:bg-black/50',
        sizes[size]
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-start gap-4 p-6">
          <div className="flex-1 space-y-1">
            <p className="text-base font-semibold">{title}</p>
            {description && <p className="text-sm text-[var(--color-muted)]">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </dialog>
  )
}
