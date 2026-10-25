import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Please enter your email') ; return }
    setSubmitted(true)
  }

  return (
    <AuthLayout
      title={submitted ? 'Check your email' : 'Reset password'}
      subtitle={submitted ? 'We sent a reset link to your inbox' : 'Enter your email to receive a password reset link'}
    >
      {submitted ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-7 w-7 text-[var(--color-success)]" />
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            If an account exists for <strong className="text-[var(--color-fg)]">{email}</strong>, you'll receive a reset link shortly.
          </p>
          <Link to="/auth/signin" className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
          <Button type="submit" className="w-full">Send Reset Link</Button>
          <p className="text-center text-sm text-[var(--color-muted)]">
            <Link to="/auth/signin" className="text-[var(--color-primary)] hover:underline font-medium">
              ← Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
