import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { studyGuideSections } from '../lib/mockData'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { departmentInfo } from '../lib/constants'

export function StudyGuides() {
  const { user } = useAuth()
  const department = user?.department || 'FLIGHT_DECK'
  const sections = studyGuideSections[department] || []
  const meta = departmentInfo[department as keyof typeof departmentInfo]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]" style={{ fontFamily: 'var(--font-display)' }}>Study Guide</h1>
          <p className="text-[var(--color-muted)] mt-1 text-sm">Reference material for your department</p>
        </div>
      </div>

      {meta && (
        <div className="flex items-center gap-3">
          <DepartmentBadge department={department} />
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${meta.color}12`, color: meta.color, border: `1px solid ${meta.color}20` }}
          >
            <meta.icon className="h-4 w-4" />
            {meta.name}
          </div>
        </div>
      )}

      {sections.length === 0 ? (
        <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-[var(--color-meta)] opacity-30" />
          <p className="text-[var(--color-muted)]">No study guide content for this department yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map(section => (
            <div
              key={section.id}
              className="rounded-xl border p-5 bg-[var(--color-surface)] transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15`, color: meta?.color || 'var(--color-primary)' }}
                >
                  {section.order}
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--color-fg)] tracking-tight">{section.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] mt-0.5 line-clamp-1">{section.content.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
