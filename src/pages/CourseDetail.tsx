import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight, Play } from 'lucide-react'
import { useCourse } from '../hooks/useCourses'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { departmentInfo } from '../lib/constants'

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const { course, isLoading } = useCourse(courseId || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-[var(--color-muted)]">Course not found</p>
        <Link to="/courses" className="mt-4 inline-flex text-[var(--color-primary)] hover:underline text-sm font-medium">
          Back to courses
        </Link>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)
  const completedLessons = Math.round((course.progress / 100) * totalLessons)
  const meta = departmentInfo[course.department as keyof typeof departmentInfo]

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      {/* Header */}
      <div className="rounded-xl border overflow-hidden bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}20`, color: meta?.color || 'var(--color-primary)' }}
              >
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DepartmentBadge department={course.department} />
                  <Badge variant={course.status === 'completed' ? 'success' : course.status === 'in-progress' ? 'primary' : 'outline'} className="text-xs">
                    {course.status === 'completed' ? 'Completed' : course.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {course.title}
                </h1>
                <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{course.description}</p>
              </div>
            </div>
            <Link
              to={`/courses/${course.id}/learn`}
              className="btn-pill btn-pill-primary inline-flex items-center gap-2 shrink-0"
            >
              {course.status === 'completed' ? 'Review Course' : course.status === 'in-progress' ? 'Continue' : 'Start Course'}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Progress */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-muted)]">Your Progress</span>
              <span className="text-sm font-semibold text-[var(--color-fg)]">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
            <p className="text-xs text-[var(--color-muted)] mt-2">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Course Modules
        </h2>
        <div className="space-y-3">
          {course.modules.map((module: any, idx: number) => (
            <div
              key={module.id}
              className="rounded-xl border bg-[var(--color-surface)] overflow-hidden"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15`, color: meta?.color || 'var(--color-primary)' }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--color-fg)]">{module.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">{module.lessons.length} lessons</p>
                  </div>
                </div>
                <Link
                  to={`/courses/${course.id}/learn?module=${module.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="border-t" style={{ borderColor: 'var(--color-border-soft)' }}>
                {module.lessons.map((lesson: any) => (
                  <Link
                    key={lesson.id}
                    to={`/courses/${course.id}/learn?module=${module.id}&lesson=${lesson.id}`}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {lesson.type === 'video' ? (
                        <Play className="h-3.5 w-3.5 text-[var(--color-meta)]" />
                      ) : (
                        <BookOpen className="h-3.5 w-3.5 text-[var(--color-meta)]" />
                      )}
                      <span className="text-sm text-[var(--color-fg-secondary)]">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{lesson.duration}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
