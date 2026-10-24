import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Department } from '../../lib/constants'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { DepartmentBadge } from '../../components/features/DepartmentBadge'
import { AuthLayout } from '../../components/layout/AuthLayout'

export function Signup() {
  const { signUp, isLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  })
  const [error, setError] = useState('')
  const [departmentSelected, setDepartmentSelected] = useState<Department | ''>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDepartmentSelect = (dept: Department) => {
    setDepartmentSelected(dept)
    setFormData(prev => ({ ...prev, department: dept }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await signUp({
        email: formData.email,
        name: formData.name,
        department: formData.department
      })
      navigate('/dashboard')
    } catch {
      setError('Failed to create account. Please try again.')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SkyTeam Training and start your aviation journey"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">
            Select Department
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['FLIGHT_DECK', 'CABIN_CREW', 'GROUND_CREW', 'SHARED_CORE'] as Department[]).map(dept => (
              <button
                key={dept}
                type="button"
                onClick={() => handleDepartmentSelect(dept)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  departmentSelected === dept
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                }`}
              >
                <DepartmentBadge department={dept} />
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  {dept === 'FLIGHT_DECK' && 'Flight operations & navigation'}
                  {dept === 'CABIN_CREW' && 'Passenger service & safety'}
                  {dept === 'GROUND_CREW' && 'Airport & ground handling'}
                  {dept === 'SHARED_CORE' && 'All department essentials'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)]">
        Already have an account?{' '}
        <Link to="/auth/signin" className="text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
