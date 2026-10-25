import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { applicationQuestions } from '../lib/mockData'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface ApplicationAnswers {
  [questionId: string]: string
}

export function Applications() {
  const { user } = useAuth()
  const [answers, setAnswers] = useState<ApplicationAnswers>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const deptQuestions = applicationQuestions.filter(q => q.department === user.department)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const questionId = e.target.name
    setAnswers(prev => ({ ...prev, [questionId]: e.target.value }))
  }

  const handleSubmit = () => {
    const missing = deptQuestions.filter(q => !answers[q.id]?.trim())
    if (missing.length > 0) {
      setError(`Please answer all ${missing.length} required question${missing.length > 1 ? 's' : ''}`)
      return
    }
    setIsSubmitted(true)
    setError('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]" style={{ fontFamily: 'var(--font-display)' }}>Applications</h1>
        <p className="mt-1 text-[var(--color-muted)] text-sm">Department-specific application questions for {user.department.replace('_', ' ')}</p>
      </div>

      <DepartmentBadge department={user.department} />

      {isSubmitted ? (
        <div className="rounded-xl p-10 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
          <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-[var(--color-success)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-fg)]">Application Submitted!</h2>
          <p className="text-[var(--color-muted)] mt-2 text-sm">Your application has been received and will be reviewed by an admin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deptQuestions.length === 0 ? (
            <div className="rounded-xl p-10 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-[var(--color-meta)] opacity-40" />
              <p className="text-[var(--color-muted)] text-sm">No application questions for your department yet.</p>
            </div>
          ) : (
            deptQuestions.map(question => (
              <div
                key={question.id}
                className="rounded-xl border p-5 bg-[var(--color-surface)]"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                      Question {question.order}
                    </p>
                    <h3 className="font-semibold text-sm text-[var(--color-fg)]">{question.question}</h3>
                  </div>
                  {question.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </div>
                {question.type === 'text' ? (
                  <input
                    name={question.id}
                    value={answers[question.id] || ''}
                    onChange={handleInputChange}
                    placeholder={question.placeholder || 'Type your answer...'}
                    className="w-full input text-sm"
                  />
                ) : (
                  <textarea
                    name={question.id}
                    value={answers[question.id] || ''}
                    onChange={handleInputChange}
                    placeholder={question.placeholder || 'Type your answer...'}
                    className="w-full input text-sm min-h-[100px] resize-y"
                  />
                )}
              </div>
            ))
          )}

          {error && (
            <p className="text-sm text-[var(--color-error)] bg-[var(--danger-light)] border border-[var(--color-error)]/20 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <Button onClick={handleSubmit} className="w-full sm:w-auto" disabled={deptQuestions.length === 0}>
            Submit Application
          </Button>
        </div>
      )}
    </div>
  )
}
