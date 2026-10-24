import { useAuth } from '../hooks/useAuth'
import { useCourses } from '../hooks/useCourses'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { Mail, Calendar, Award, BookOpen } from 'lucide-react'
import { Badge } from '../components/ui/Badge'

export function Profile() {
  const { user } = useAuth()
  const { courses } = useCourses()

  if (!user) return null

  const completedCourses = courses.filter(c => c.status === 'completed')

  const joinedDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-semibold shrink-0">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <p className="text-[var(--color-muted)]">{user.email}</p>
              </div>
              <DepartmentBadge department={user.department} />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.airline}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {joinedDate}
              </span>
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {user.role.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{courses.length}</p>
              <p className="text-sm text-[var(--color-muted)]">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{completedCourses.length}</p>
              <p className="text-sm text-[var(--color-muted)]">Completed</p>
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ProgressBar value={user.progress} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{user.progress}%</p>
              <p className="text-sm text-[var(--color-muted)]">Overall Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-6">
        <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
        <div className="space-y-4">
          {courses.map((course: import('../lib/mockData').Course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{course.title}</span>
                <span className="text-sm text-[var(--color-muted)]">{course.progress}%</span>
              </div>
              <ProgressBar value={course.progress} />
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {completedCourses.length > 0 && (
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-6">
          <h2 className="text-lg font-semibold mb-4">Certifications</h2>
          <div className="space-y-3">
            {completedCourses.map(course => (
              <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{course.title}</p>
                  <p className="text-sm text-green-600">Certified</p>
                </div>
                <Badge variant="success" className="ml-auto">Completed</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
