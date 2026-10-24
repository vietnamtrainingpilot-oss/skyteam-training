import { useAuth } from '../../hooks/useAuth'
import { users } from '../../lib/mockData'
import { DepartmentBadge } from '../../components/features/DepartmentBadge'
import { ProgressBar } from '../../components/features/ProgressBar'
import { Users, UserCheck, TrendingUp } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'

export function AdminDashboard() {
  const { user } = useAuth()

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)]">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.role === 'TRAINEE').length,
    trainers: users.filter(u => u.role === 'TRAINER').length,
    byDepartment: {
      FLIGHT_DECK: users.filter(u => u.department === 'FLIGHT_DECK').length,
      CABIN_CREW: users.filter(u => u.department === 'CABIN_CREW').length,
      GROUND_CREW: users.filter(u => u.department === 'GROUND_CREW').length,
      SHARED_CORE: users.filter(u => u.department === 'SHARED_CORE').length
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-[var(--color-muted)] mt-1">Manage users and training programs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Total Users</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Trainees</p>
              <p className="text-2xl font-semibold mt-1">{stats.active}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Trainers</p>
              <p className="text-2xl font-semibold mt-1">{stats.trainers}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Avg Progress</p>
              <p className="text-2xl font-semibold mt-1">
                {Math.round(users.reduce((acc: number, u: typeof users[0]) => acc + u.progress, 0) / users.length)}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <ProgressBar value={Math.round(users.reduce((acc: number, u: typeof users[0]) => acc + u.progress, 0) / users.length)} />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-3 text-sm font-medium text-[var(--color-muted)]">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[var(--color-muted)]">Department</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[var(--color-muted)]">Role</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[var(--color-muted)]">Progress</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[var(--color-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: typeof users[0]) => (
                <tr key={u.id} className="border-b border-[var(--color-separator)] last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-[var(--color-muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DepartmentBadge department={u.department} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'ADMIN' ? 'primary' : u.role === 'TRAINER' ? 'success' : 'outline'}>
                      {u.role.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 w-48">
                    <ProgressBar value={u.progress} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.progress === 100 ? 'success' : u.progress > 0 ? 'warning' : 'outline'}>
                      {u.progress === 100 ? 'Completed' : u.progress > 0 ? 'In Progress' : 'Not Started'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
