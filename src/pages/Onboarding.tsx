import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Info, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Department, DEPARTMENTS, departmentInfo } from '../lib/constants'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../components/layout/AuthLayout'

interface FormData {
  [key: string]: string
}

export function Onboarding() {
  const { signUp, isLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'TRAINEE',
    department: DEPARTMENTS.FLIGHT_DECK,
    airline: '',
    discord: '',
    region: 'North America',
    experience: '',
    heardAbout: ''
  })
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDepartmentSelect = (dept: Department) => {
    setFormData(prev => ({ ...prev, department: dept }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 0) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields')
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
      setStep(1)
      return
    }

    if (step === 1) {
      if (!formData.airline || !formData.discord || !formData.region || !formData.heardAbout) {
        setError('Please fill in all fields')
        return
      }
      setStep(2)
      return
    }

    try {
      await signUp({
        email: formData.email,
        name: formData.name,
        department: formData.department as Department,
        password: formData.password,
        role: formData.role as any,
        airline: formData.airline,
        discord: formData.discord,
        region: formData.region,
        experience: formData.experience,
        heardAbout: formData.heardAbout
      })
      navigate('/dashboard')
    } catch {
      setError('Failed to create account. Please try again.')
    }
  }

  const inputClass = "w-full px-4 py-3 border-2 border-[var(--color-border)] rounded-xl bg-[var(--color-bg)] text-[var(--color-fg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"

  return (
    <AuthLayout title="Welcome to SkyTeam" subtitle="Complete your profile to get started">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>

        {/* Step info */}
        <div className="mb-6 p-4 rounded-xl border text-sm" style={{ backgroundColor: 'var(--color-surface-hover)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[var(--color-fg)]">How it works</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                {step === 0 && 'Enter your basic account details to get started.'}
                {step === 1 && 'Tell us about yourself — role, department, airline, and more.'}
                {step === 2 && 'Review your information and submit your application.'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-fg)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Account Details</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Full Name *</label>
              <input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Email Address *</label>
              <input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Password *</label>
              <input id="password" name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Confirm Password *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} className={inputClass} required />
            </div>
          </motion.div>
        )}

        {/* Step 1: Profile Details */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-fg)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Profile Setup</h2>

            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={inputClass}>
                <option value="TRAINEE">Trainee</option>
                <option value="TRAINER">Trainer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-2">Department *</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(Object.values(DEPARTMENTS) as Department[]).filter(d => d !== 'SHARED_CORE').map(dept => {
                  const meta = departmentInfo[dept]
                  const isSelected = formData.department === dept
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => handleDepartmentSelect(dept)}
                      className={`p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-muted)] bg-[var(--color-surface)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: isSelected ? meta.color : `${meta.color}20`, color: meta.color }}
                        >
                          <meta.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'}`}>
                          {meta.name}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Airline *</label>
              <input id="airline" name="airline" type="text" placeholder="e.g., SkyTeam Aviation" value={formData.airline} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Discord Username *</label>
              <input id="discord" name="discord" type="text" placeholder="e.g., username#1234" value={formData.discord} onChange={handleInputChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Region *</label>
                <select id="region" name="region" value={formData.region} onChange={handleInputChange} className={inputClass}>
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Asia</option>
                  <option>Oceania</option>
                  <option>South America</option>
                  <option>Africa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">How did you hear? *</label>
                <select id="heardAbout" name="heardAbout" value={formData.heardAbout} onChange={handleInputChange} className={inputClass} required>
                  <option value="">Select...</option>
                  <option>Friend</option>
                  <option>Discord</option>
                  <option>Forum</option>
                  <option>Social Media</option>
                  <option>Search Engine</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">Aviation Experience</label>
              <textarea id="experience" name="experience" placeholder="Describe your aviation background..." value={formData.experience} onChange={handleInputChange} className={`${inputClass} min-h-[80px] resize-none`} />
            </div>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-5">
            <h2 className="text-xl font-semibold text-[var(--color-fg)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Review & Submit</h2>
            <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              {[
                { label: 'Name', value: formData.name },
                { label: 'Email', value: formData.email },
                { label: 'Role', value: formData.role },
                { label: 'Department', value: formData.department },
                { label: 'Airline', value: formData.airline },
                { label: 'Discord', value: formData.discord },
                { label: 'Region', value: formData.region },
                { label: 'Heard About', value: formData.heardAbout }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted)]">{item.label}</span>
                  <span className="font-medium text-[var(--color-fg)]">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <p className="mt-4 text-sm text-[var(--color-error)] bg-[var(--danger-light)] border border-[var(--color-error)]/20 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="text-sm">
              Back
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 text-sm"
          >
            {isLoading ? 'Submitting...' : step === 2 ? 'Submit Application' : 'Continue'}
            {step !== 2 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <p className="text-center text-sm text-[var(--color-muted)] mt-5">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-[var(--color-primary)] hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  )
}
