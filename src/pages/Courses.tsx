import { Link } from 'react-router-dom'
import { BookOpen, Clock } from 'lucide-react'
import { useCourses } from '../hooks/useCourses'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { departmentInfo } from '../lib/constants'

export function Courses() {
  const { courses, isLoading } = useCourses()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]" style={{ fontFamily: 'var(--font-display)' }}>Courses</h1>
          <p className="mt-1 text-[var(--color-muted)] text-sm">Browse and continue your training modules</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-[var(--color-meta)] opacity-30" />
          <p className="text-[var(--color-muted)] text-sm">No courses available yet.</p>
          <Link to="/handbooks" className="mt-4 inline-flex text-sm font-medium text-[var(--color-primary)] hover:underline">
            Browse Handbooks →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course: any) => {
            const meta = departmentInfo[course.department as keyof typeof departmentInfo]
            return (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group rounded-xl border bg-[var(--color-surface)] p-5 transition-all hover:shadow-md block"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15` }}
                    >
                      <BookOpen className="h-5 w-5" style={{ color: meta?.color || 'var(--color-primary)' }} />
                    </div>
                    <DepartmentBadge department={course.department} />
                  </div>
                  <Badge variant={course.status === 'completed' ? 'success' : 'outline'} className="text-xs">
                    {course.status === 'completed' ? 'Completed' : course.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                <div className="mt-4 space-y-2">
                  <ProgressBar value={course.progress} />
                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span>{course.modules?.length || 0} modules</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
