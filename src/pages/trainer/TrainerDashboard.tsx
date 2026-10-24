import { useAuth } from '../../hooks/useAuth'
import { trainees } from '../../lib/mockData'
import { DepartmentBadge } from '../../components/features/DepartmentBadge'
import { ProgressBar } from '../../components/features/ProgressBar'
import { Users, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'

export function TrainerDashboard() {
  const { user } = useAuth()

  if (!user || user.role !== 'TRAINER') {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)]">Access denied. Trainer privileges required.</p>
      </div>
    )
  }

  const departmentTrainees = trainees.filter(t => t.department === (user.department as any))
  const pendingGrades = departmentTrainees.filter(t => t.status === 'in-progress')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trainer Dashboard</h1>
        <p className="text-[var(--color-muted)] mt-1">Monitor and guide your trainees</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{departmentTrainees.length}</p>
              <p className="text-sm text-[var(--color-muted)]">Total Trainees</p>
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{pendingGrades.length}</p>
              <p className="text-sm text-[var(--color-muted)]">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{departmentTrainees.filter(t => t.status === 'completed').length}</p>
              <p className="text-sm text-[var(--color-muted)]">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trainees List */}
      <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold">Your Trainees</h2>
        </div>
        <div className="divide-y divide-[var(--color-separator)]">
          {departmentTrainees.map((trainee) => (
            <div key={trainee.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-bg-secondary)] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium">
                  {trainee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{trainee.name}</p>
                  <DepartmentBadge department={trainee.department as any} size="sm" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <ProgressBar value={trainee.progress} />
                </div>
                <Badge variant={trainee.status === 'completed' ? 'success' : trainee.status === 'in-progress' ? 'warning' : 'outline'}>
                  {trainee.status === 'completed' ? 'Completed' : trainee.status === 'in-progress' ? 'In Progress' : 'Active'}
                </Badge>
                <button className="text-sm text-[var(--color-primary)] hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grading Queue */}
      {pendingGrades.length > 0 && (
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)]">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold">Grading Queue</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1">{pendingGrades.length} trainees pending review</p>
          </div>
          <div className="p-6">
            {pendingGrades.map((trainee) => (
              <div key={trainee.id} className="flex items-center justify-between py-3 border-b border-[var(--color-separator)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] flex items-center justify-center text-sm font-medium">
                    {trainee.name[0]}
                  </div>
                  <span className="font-medium">{trainee.name}</span>
                </div>
                <button className="text-sm text-[var(--color-primary)] hover:underline">
                  Grade Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
