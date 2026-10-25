import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { useAssessments } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { departmentInfo } from '../lib/constants'

export function Examinations() {
  const { assessments, isLoading } = useAssessments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]" style={{ fontFamily: 'var(--font-display)' }}>Examinations</h1>
        <p className="mt-1 text-[var(--color-muted)] text-sm">Available written and practical exams</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-44 w-full" />)}
        </div>
      ) : assessments.length === 0 ? (
        <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
          <FileText className="h-12 w-12 mx-auto mb-4 text-[var(--color-meta)] opacity-30" />
          <p className="text-[var(--color-muted)] text-sm">No examinations available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((assessment: any) => {
            const meta = departmentInfo[assessment.department as keyof typeof departmentInfo]
            const isWritten = assessment.type === 'written'
            return (
              <Link
                key={assessment.id}
                to={isWritten ? `/stage-testing/${assessment.id}` : `/examinations/${assessment.id}`}
                className="group rounded-xl border bg-[var(--color-surface)] p-5 transition-all hover:shadow-md block"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15` }}
                    >
                      <FileText className="h-5 w-5" style={{ color: meta?.color || 'var(--color-primary)' }} />
                    </div>
                    <DepartmentBadge department={assessment.department} />
                  </div>
                  <Badge variant={isWritten ? 'primary' : 'warning'} className="text-xs">
                    {isWritten ? 'Written' : 'Practical'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                  {assessment.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed line-clamp-2">{assessment.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{assessment.questions?.length || 0} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{assessment.timeLimit} min</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-[var(--color-success)]" />Pass: {assessment.passingScore}%</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
