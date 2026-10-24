import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/layout/AuthLayout'

export function ForgotPassword() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSent(true)
    toast('Password reset link sent to your email', 'success')
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[var(--color-muted)]">
            Check your email for the password reset link.
          </p>
          <Link
            to="/auth/signin"
            className="inline-flex text-[var(--color-primary)] hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-[var(--color-muted)]">
        <Link to="/auth/signin" className="text-[var(--color-primary)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
