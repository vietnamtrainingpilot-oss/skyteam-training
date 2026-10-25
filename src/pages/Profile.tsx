import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCourses } from '../hooks/useCourses'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { Mail, Calendar, Award, BookOpen, Pencil, Save, X, Plane } from 'lucide-react'
import { departmentInfo } from '../lib/constants'

export function Profile() {
  const { user, updateOnboarding } = useAuth()
  const { courses } = useCourses()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    airline: user?.airline || '',
    discord: user?.discord || ''
  })

  if (!user) return null

  const completedCourses = courses.filter((c: any) => c.status === 'completed')
  const joinedDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const deptMeta = departmentInfo[user.department as keyof typeof departmentInfo]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    updateOnboarding({ ...user, ...formData } as any)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      airline: user.airline,
      discord: user.discord
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Profile
          </h1>
          <p className="mt-1 text-[var(--color-muted)] text-sm">Manage your account information and training progress</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="btn-pill btn-pill-secondary text-sm"
        >
          {isEditing ? (
            <><X className="h-4 w-4 mr-2" />Cancel</>
          ) : (
            <><Pencil className="h-4 w-4 mr-2" />Edit</>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border bg-[var(--color-surface)] p-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-[var(--color-fg)] shrink-0"
            style={{ backgroundColor: deptMeta?.color || 'var(--color-primary)', boxShadow: `0 8px 24px ${deptMeta?.color || 'var(--color-primary)'}30` }}
          >
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-[var(--color-fg)]">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 input text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-fg)]">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 input text-sm" type="email" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-fg)]">Airline</label>
                    <input name="airline" value={formData.airline} onChange={handleChange} className="w-full mt-1 input text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-fg)]">Discord</label>
                    <input name="discord" value={formData.discord} onChange={handleChange} className="w-full mt-1 input text-sm" />
                  </div>
                </div>
                <button onClick={handleSave} className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm">
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--color-fg)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{user.name}</h2>
                  <p className="text-[var(--color-muted)] text-sm mt-0.5">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <DepartmentBadge department={user.department} />
                  <span className="text-sm text-[var(--color-muted)] capitalize">{user.role.toLowerCase()}</span>
                </div>
                <div className="flex flex-wrap gap-5 text-sm text-[var(--color-muted)]">
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user.airline || '—'}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Joined {joinedDate}</span>
                  <span className="flex items-center gap-1.5"><Plane className="h-3.5 w-3.5" />{user.discord || '—'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'var(--color-primary)' },
          { label: 'Completed', value: completedCourses.length, icon: Award, color: 'var(--color-success)' },
          { label: 'Overall Progress', value: `${user.progress}%`, icon: Plane, color: deptMeta?.color || 'var(--color-primary)' }
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border p-4 bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xl font-semibold text-[var(--color-fg)] tracking-tight">{stat.value}</p>
                <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Progress */}
      <div className="rounded-xl border bg-[var(--color-surface)] p-6" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Course Progress</h2>
        {courses.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No courses yet. Start by browsing the handbooks.</p>
        ) : (
          <div className="space-y-4">
            {courses.map((course: any) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-[var(--color-fg)]">{course.title}</span>
                  <span className="text-sm text-[var(--color-muted)]">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certifications */}
      {completedCourses.length > 0 && (
        <div className="rounded-xl border bg-[var(--color-surface)] p-6" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Certifications</h2>
          <div className="space-y-3">
            {completedCourses.map(course => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ backgroundColor: 'var(--color-success-light)', border: '1px solid rgba(5,150,105,0.2)' }}
              >
                <Award className="h-5 w-5 text-[var(--color-success)]" />
                <div>
                  <p className="font-medium text-sm text-[var(--color-fg)]">{course.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">Certified</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
