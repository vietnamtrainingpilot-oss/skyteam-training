import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight, Play } from 'lucide-react'
import { useCourse } from '../hooks/useCourses'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

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
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)]">Course not found</p>
        <Link to="/courses" className="mt-4 inline-flex text-[var(--color-primary)]">
          Back to courses
        </Link>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)
  const completedLessons = Math.round((course.progress / 100) * totalLessons)

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <DepartmentBadge department={course.department} />
          <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
          <p className="text-[var(--color-muted)] max-w-2xl">{course.description}</p>
        </div>
        <Button size="lg">
          <Link to={`/courses/${course.id}/learn`}>
            {course.status === 'completed' ? 'Review Course' : course.status === 'in-progress' ? 'Continue Learning' : 'Start Course'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Modules</h2>
          {course.modules.map((module: any, idx: number) => (
            <div key={module.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)]">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-medium">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">{module.lessons.length} lessons</p>
                  </div>
                </div>
                <Link
                  to={`/courses/${course.id}/learn?module=${module.id}`}
                  className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="border-t border-[var(--color-separator)] px-4 py-2">
                {module.lessons.map((lesson: any) => (
                  <Link
                    key={lesson.id}
                    to={`/courses/${course.id}/learn?module=${module.id}&lesson=${lesson.id}`}
                    className="flex items-center justify-between py-2 text-sm group"
                  >
                    <div className="flex items-center gap-2">
                      {lesson.type === 'video' ? (
                        <Play className="h-4 w-4 text-[var(--color-muted)]" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-[var(--color-muted)]" />
                      )}
                      <span className="text-[var(--color-muted)] group-hover:text-[var(--color-fg)] transition-colors">
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{lesson.duration}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 space-y-4">
            <h3 className="font-semibold">Your Progress</h3>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-[var(--color-primary)]">{course.progress}%</div>
              <p className="text-sm text-[var(--color-muted)] mt-1">{completedLessons} of {totalLessons} lessons</p>
            </div>
            <ProgressBar value={course.progress} />
            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Modules</span>
                <span>{course.modules.length} total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Status</span>
                <span className="capitalize">{course.status.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
