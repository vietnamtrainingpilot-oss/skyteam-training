import { Link } from 'react-router-dom'
import { BookOpen, Clock } from 'lucide-react'
import { useCourses } from '../hooks/useCourses'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { MotionCard } from '../components/ui/MotionCard'

export function Courses() {
  const { courses, isLoading } = useCourses()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Courses</h1>
          <p className="text-[var(--color-muted)] mt-1">Browse and continue your training</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course: any, i: number) => (
            <MotionCard key={course.id} delay={i * 0.05}>
              <Link
                to={`/courses/${course.id}`}
                className="block card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-6 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <DepartmentBadge department={course.department} />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    course.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : course.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {course.status === 'completed' ? 'Completed' : course.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors">
                  {course.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2">{course.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-muted)]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.modules.length} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ~{course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} lessons
                  </span>
                </div>
                <div className="mt-4">
                  <ProgressBar value={course.progress} showPercentage={true} />
                </div>
              </Link>
            </MotionCard>
          ))}
        </div>
      )}
    </div>
  )
}
