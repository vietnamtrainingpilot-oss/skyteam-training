import { Link } from 'react-router-dom'
import { BookOpen, FileText, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCourses } from '../hooks/useCourses'
import { useAssessments } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { Button } from '../components/ui/Button'
import { MotionCard, MotionFade } from '../components/ui'

export function Dashboard() {
  const { user } = useAuth()
  const { courses, isLoading: coursesLoading } = useCourses()
  const { assessments } = useAssessments(user?.department)

  if (!user) return null

  const inProgressCourses = courses.filter((c: any) => c.status === 'in-progress')
  const completedCourses = courses.filter((c: any) => c.status === 'completed')
  const upcomingAssessments = assessments.slice(0, 2)
  const avgProgress = courses.length > 0 ? Math.round(courses.reduce((acc: number, c: any) => acc + c.progress, 0) / courses.length) : 0

  return (
    <div className="space-y-8">
      <MotionFade>
        <div className="rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] p-6 text-white">
          <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(' ')[0]}! ✈️</h1>
          <p className="mt-2 text-white/80">
            {inProgressCourses.length > 0
              ? `You have ${inProgressCourses.length} course${inProgressCourses.length > 1 ? 's' : ''} in progress. Keep up the great work!`
              : 'Ready to continue your training journey?'
            }
          </p>
        </div>
      </MotionFade>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Courses in Progress', value: inProgressCourses.length, icon: BookOpen },
          { label: 'Completed Courses', value: completedCourses.length, icon: Award },
          { label: 'Available Assessments', value: assessments.length, icon: FileText },
          { label: 'Overall Progress', value: `${avgProgress}%`, icon: TrendingUp }
        ].map((stat, i) => (
          <MotionCard key={stat.label} delay={i * 0.05}>
            <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
              </div>
            </div>
          </MotionCard>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Continue Learning</h2>
          <Link to="/courses" className="text-sm text-[var(--color-primary)] hover:underline">
            View all
          </Link>
        </div>
        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] p-8 text-center">
            <p className="text-[var(--color-muted)]">No courses available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course: any, i: number) => (
              <MotionCard key={course.id} delay={i * 0.1}>
                <Link to={`/courses/${course.id}`} className="block group">
                  <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5 hover:border-[var(--color-primary)]/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <DepartmentBadge department={course.department} />
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                        {course.progress}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-[var(--color-primary)] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">{course.description}</p>
                    <div className="mt-4">
                      <ProgressBar value={course.progress} showPercentage={false} />
                    </div>
                  </div>
                </Link>
              </MotionCard>
            ))}
          </div>
        )}
      </div>

      {assessments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Assessments</h2>
            <Link to="/assessments" className="text-sm text-[var(--color-primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingAssessments.map((assessment: any, i: number) => (
              <MotionCard key={assessment.id} delay={i * 0.05}>
                <Link
                  to={`/assessments/${assessment.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-primary)]/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <DepartmentBadge department={assessment.department} />
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">{assessment.questions.length} questions · {assessment.timeLimit} min</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                </Link>
              </MotionCard>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
