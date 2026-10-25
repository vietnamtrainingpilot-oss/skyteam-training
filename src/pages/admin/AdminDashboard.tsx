import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { users, User } from '../../lib/mockData'
import { DepartmentBadge } from '../../components/features/DepartmentBadge'
import { Badge } from '../../components/ui/Badge'
import { Search, Pencil, Save, X, Trash2, UserPlus, Settings, Users, ShieldAlert, Save as SaveIcon } from 'lucide-react'

type ModalMode = 'add' | 'edit' | 'delete' | null

import { LS_KEYS } from '../../lib/storageKeys'

const CONFIG_LS_KEY = LS_KEYS.CONFIG

function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(LS_KEYS.USERS)
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

function saveUsers(us: User[]) {
  localStorage.setItem(LS_KEYS.USERS, JSON.stringify(us))
}

interface AppSettings {
  platformName: string
  registrationOpen: boolean
  requireEmailVerification: boolean
  maxAttemptsPerExam: number
}

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(CONFIG_LS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return {
    platformName: 'SkyTeam Training',
    registrationOpen: true,
    requireEmailVerification: false,
    maxAttemptsPerExam: 3
  }
}

function saveSettings(s: AppSettings) {
  localStorage.setItem(CONFIG_LS_KEY, JSON.stringify(s))
}

export function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'ADMIN'
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [modal, setModal] = useState<ModalMode>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'TRAINEE' as const, department: 'FLIGHT_DECK' as const, airline: '', discord: '' })
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users')

  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    const stored = loadUsers()
    setAllUsers(stored.length > 0 ? stored : users)
  }, [])

  if (!isAdmin) {
    return (
      <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <ShieldAlert className="h-10 w-10 mx-auto mb-3 text-[var(--color-muted)] opacity-40" />
        <p className="text-[var(--color-muted)]">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  const openEdit = (u: User) => {
    setEditingUser(u)
    setForm({ name: u.name, email: u.email, role: u.role as any, department: u.department as any, airline: u.airline, discord: u.discord })
    setModal('edit')
  }

  const openAdd = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', role: 'TRAINEE', department: 'FLIGHT_DECK', airline: '', discord: '' })
    setModal('add')
  }

  const openDelete = (u: User) => {
    setEditingUser(u)
    setModal('delete')
  }

  const save = () => {
    const newUsers = editingUser
      ? allUsers.map(u => u.id === editingUser.id ? { ...u, ...form } : u)
      : [...allUsers, { ...form, id: Date.now().toString(), region: '', joinedDate: new Date().toLocaleDateString(), progress: 0, avatar: null, onboarded: true }]
    setAllUsers(newUsers)
    saveUsers(newUsers)
    setModal(null)
    setToast(editingUser ? `Updated ${form.name}` : `Added ${form.name}`)
    setTimeout(() => setToast(''), 3000)
  }

  const confirmDelete = () => {
    const newUsers = allUsers.filter(u => u.id !== editingUser?.id)
    setAllUsers(newUsers)
    saveUsers(newUsers)
    setModal(null)
    setToast(`Deleted ${editingUser?.name}`)
    setTimeout(() => setToast(''), 3000)
  }

  const stats = {
    total: allUsers.length,
    trainees: allUsers.filter(u => u.role === 'TRAINEE').length,
    trainers: allUsers.filter(u => u.role === 'TRAINER').length,
    admins: allUsers.filter(u => u.role === 'ADMIN').length
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fade-in"
          style={{ backgroundColor: 'var(--color-fg)', color: 'var(--color-bg)' }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[var(--color-muted)] text-sm">Manage users and system configuration</p>
        </div>
        <button onClick={openAdd} className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm">
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: stats.total, accent: 'var(--color-primary)' },
          { label: 'Trainees', value: stats.trainees, accent: 'var(--color-success)' },
          { label: 'Trainers', value: stats.trainers, accent: 'var(--violet)' },
          { label: 'Admins', value: stats.admins, accent: 'var(--color-warning)' }
        ].map(s => (
          <div key={s.label} className="rounded-xl p-5 bg-[var(--color-surface)] border" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm text-[var(--color-muted)]">{s.label}</p>
            <p className="text-2xl font-semibold mt-1 tracking-tight" style={{ color: s.accent }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {(['users', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${
              activeTab === tab
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]'
            }`}
          >
            {tab === 'users' && <Users className="h-4 w-4" />}
            {tab === 'settings' && <Settings className="h-4 w-4" />}
            {tab === 'users' ? 'User Management' : 'Configuration'}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-4 pr-10 py-2 input text-sm"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)] pointer-events-none" />
            </div>
            <div className="flex gap-1 p-1 rounded-full bg-[var(--color-surface)] border" style={{ borderColor: 'var(--color-border)' }}>
              {['all', 'TRAINEE', 'TRAINER', 'ADMIN'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    filterRole === r
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-fg)] bg-[var(--color-surface)] border border-[var(--color-border)]'
                  }`}
                >
                  {r === 'all' ? 'All' : r === 'TRAINEE' ? 'Trainees' : r === 'TRAINER' ? 'Trainers' : 'Admins'}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border overflow-hidden bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Department</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider hidden sm:table-cell">Airline</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider hidden md:table-cell">Joined</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-[var(--color-muted)]">No users found</td></tr>
                  ) : filtered.map(u => (
                    <tr key={u.id} className="border-t transition-colors hover:bg-[var(--color-surface-hover)]/50" style={{ borderColor: 'var(--color-border-soft)' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0"
                            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                          >
                            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-fg)] truncate">{u.name}</p>
                            <p className="text-xs text-[var(--color-muted)] truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><DepartmentBadge department={u.department} /></td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.role === 'ADMIN' ? 'primary' : u.role === 'TRAINER' ? 'success' : 'outline'} className="text-xs">
                          {u.role.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--color-muted)] hidden sm:table-cell">{u.airline || '—'}</td>
                      <td className="px-5 py-3.5 text-[var(--color-muted)] hidden md:table-cell">{u.joinedDate}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {u.id !== '1' && (
                            <button
                              onClick={() => openDelete(u)}
                              className="p-2 rounded-lg hover:bg-red-50 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <SettingsTab onSave={() => { setToast('Settings saved'); setTimeout(() => setToast(''), 2500); }} />
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className="bg-[var(--color-bg)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            {/* Modal header */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2.5">
                {modal === 'edit' && <Pencil className="h-5 w-5 text-[var(--color-primary)]" />}
                {modal === 'add' && <UserPlus className="h-5 w-5 text-[var(--color-success)]" />}
                {modal === 'delete' && <Trash2 className="h-5 w-5 text-[var(--color-error)]" />}
                <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight">
                  {modal === 'edit' ? 'Edit User' : modal === 'add' ? 'Add User' : 'Delete User'}
                </h2>
              </div>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              {modal === 'delete' ? (
                <p className="text-[var(--color-fg-secondary)] text-sm leading-relaxed">
                  Are you sure you want to delete{' '}
                  <strong className="text-[var(--color-fg)]">{editingUser?.name}</strong>?
                  This action cannot be undone.
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Email</label>
                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input" type="email" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Role</label>
                      <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))} className="input">
                        <option value="TRAINEE">Trainee</option>
                        <option value="TRAINER">Trainer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Department</label>
                      <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as any }))} className="input">
                        <option value="FLIGHT_DECK">Flight Deck</option>
                        <option value="CABIN_CREW">Cabin Crew</option>
                        <option value="GROUND_CREW">Ground Crew</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Airline</label>
                    <input value={form.airline} onChange={e => setForm(f => ({ ...f, airline: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Discord</label>
                    <input value={form.discord} onChange={e => setForm(f => ({ ...f, discord: e.target.value }))} className="input" />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setModal(null)} className="btn-pill btn-pill-secondary text-sm">Cancel</button>
              {modal === 'delete'
                ? <button onClick={confirmDelete} className="btn-pill !bg-[var(--color-error)] hover:!bg-[var(--color-error)]/90 text-white text-sm">Delete</button>
                : <button onClick={save} className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm"><SaveIcon className="h-4 w-4" /> Save</button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsTab({ onSave }: { onSave: () => void }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    onSave()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* General Settings */}
      <div className="rounded-xl border bg-[var(--color-surface)] overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-sm font-semibold text-[var(--color-fg)] flex items-center gap-2 tracking-tight">
            <Settings className="h-4 w-4 text-[var(--color-primary)]" />
            General Settings
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Platform Name</label>
            <input
              value={settings.platformName}
              onChange={e => setSettings(s => ({ ...s, platformName: e.target.value }))}
              className="input"
              placeholder="SkyTeam Training"
            />
          </div>

          <ToggleRow
            label="Registration Open"
            description="Allow new users to sign up"
            checked={settings.registrationOpen}
            onChange={() => setSettings(s => ({ ...s, registrationOpen: !s.registrationOpen }))}
          />
          <div className="border-t pt-5" style={{ borderColor: 'var(--color-border-soft)' }}>
            <ToggleRow
              label="Require Email Verification"
              description="Users must verify email before accessing platform"
              checked={settings.requireEmailVerification}
              onChange={() => setSettings(s => ({ ...s, requireEmailVerification: !s.requireEmailVerification }))}
            />
          </div>
          <div className="border-t pt-5" style={{ borderColor: 'var(--color-border-soft)' }}>
            <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Max Attempts Per Exam</label>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.maxAttemptsPerExam}
              onChange={e => setSettings(s => ({ ...s, maxAttemptsPerExam: parseInt(e.target.value) || 3 }))}
              className="input w-32"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(220,38,38,0.25)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(220,38,38,0.15)', backgroundColor: 'var(--color-danger-light)' }}>
          <h3 className="text-sm font-semibold text-[var(--color-error)] tracking-tight">Danger Zone</h3>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-fg)]">Reset All Data</p>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">Clear all users, exams, settings, and handbook edits. This cannot be undone.</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data? This will delete all users, exams, and settings.')) {
                localStorage.removeItem(LS_KEYS.USERS)
                localStorage.removeItem(LS_KEYS.CONFIG)
                localStorage.removeItem(LS_KEYS.EVAL_REQUESTS)
                localStorage.removeItem(LS_KEYS.SUBMITTED_EXAMS)
                localStorage.removeItem(LS_KEYS.HANDBOOKS_EDITABLE)
                window.location.reload()
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-error)] border border-[var(--color-error)]/30 hover:bg-[var(--color-error)]/10 transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm"
        >
          <SaveIcon className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-[var(--color-fg)]">{label}</p>
        <p className="text-xs text-[var(--color-muted)] mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
        }`}
        style={{ backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-border)' }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-[var(--color-fg)] shadow-sm transition-transform duration-200"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  )
}
