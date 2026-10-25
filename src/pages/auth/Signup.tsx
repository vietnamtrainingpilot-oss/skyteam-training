import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Department } from '../../lib/constants'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { departmentInfo } from '../../lib/constants'

export function Signup() {
  const { signUp, isLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '' })
  const [error, setError] = useState('')
  const [selectedDept, setSelectedDept] = useState<Department | ''>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDept = (dept: Department) => { setSelectedDept(dept); setFormData(prev => ({ ...prev, department: dept })) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.name || !formData.email || !formData.password || !formData.department) { setError('Please fill in all fields'); return }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    try {
      await signUp({ email: formData.email, name: formData.name, department: formData.department as any, password: formData.password, role: 'TRAINEE', airline: 'SkyTeam Aviation', discord: '', region: 'North America', experience: '', heardAbout: 'Other' })
      navigate('/dashboard')
    } catch { setError('Failed to create account. Please try again.') }
  }

  const depts: Department[] = ['FLIGHT_DECK', 'CABIN_CREW', 'GROUND_CREW']

  return (
    <AuthLayout title="Create your account" subtitle="Join SkyTeam Training and start your aviation journey">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full Name</label>
            <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
            <Input id="email" name="email" type="email" placeholder="you@skyteam.aero" value={formData.email} onChange={handleChange} required />
          </div>
        </div>
        {/* Password row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
            <Input id="password" name="password" type="password" placeholder="Min. 6 chars" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Confirm</label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
        </div>
        {/* Department — compact horizontal cards */}
        <div>
          <label className="block text-sm font-medium mb-2">Department</label>
          <div className="grid grid-cols-3 gap-2">
            {depts.map(dept => {
              const meta = departmentInfo[dept]
              const sel = selectedDept === dept
              return (
                <button key={dept} type="button" onClick={() => handleDept(dept)}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all duration-150 ${sel ? 'border-[var(--color-primary)] shadow-sm' : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'}`}
                  style={sel ? { backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)' } : undefined}
                >
                  {sel && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <svg className="w-2.5 h-2.5 text-[var(--color-fg)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}><meta.icon className="h-4 w-4" /></div>
                  <p className="font-semibold text-xs text-[var(--color-fg)]">{meta.name}</p>
                </button>
              )
            })}
          </div>
        </div>
        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-center text-sm text-[var(--color-muted)]">
        Already have an account?{' '}
        <Link to="/auth/signin" className="text-[var(--color-primary)] hover:underline font-medium">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
