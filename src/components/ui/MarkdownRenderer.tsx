import { useEffect, useRef } from 'react'
import { marked } from 'marked'

marked.setOptions({
  breaks: false,
  gfm: true
})

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const parsed = marked.parse(content) as string
      containerRef.current.innerHTML = parsed
    }
  }, [content])

  return (
    <div
      ref={containerRef}
      className={`text-sm text-[var(--color-fg-secondary)] leading-relaxed prose prose-sm max-w-none ${className}`}
    />
  )
}
