import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { useAssessment } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'

interface AnswerState {
  [key: string]: string | number
}

export function AssessmentDetail() {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const { assessment, isLoading } = useAssessment(assessmentId || '')
  const [answers, setAnswers] = useState<AnswerState>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    if (assessment && !isSubmitted) {
      setTimeLeft(assessment.timeLimit * 60)
    }
  }, [assessment, isSubmitted])

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isSubmitted])

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    if (!assessment) return
    setIsSubmitted(true)

    let correct = 0
    assessment.questions.forEach((q: any) => {
      if (q.type === 'mcq' || q.type === 'true-false') {
        if (answers[q.id] === q.correctAnswer) {
          correct++
        }
      } else {
        correct++
      }
    })

    const finalScore = Math.round((correct / assessment.questions.length) * 100)
    setScore(finalScore)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)]">Assessment not found</p>
        <Link to="/assessments" className="mt-4 inline-flex text-[var(--color-primary)]">
          Back to assessments
        </Link>
      </div>
    )
  }

  const question = assessment.questions[currentQuestion]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  if (isSubmitted) {
    const passed = (score || 0) >= assessment.passingScore
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-semibold">
            {passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">
            You scored {score}% (need {assessment.passingScore}% to pass)
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button>
              <Link to="/assessments">Back to Assessments</Link>
            </Button>
            <Button variant="outline">
              <Link to="/courses">Continue Learning</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/assessments" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to assessments
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DepartmentBadge department={assessment.department} />
          <h1 className="text-xl font-semibold">{assessment.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-[var(--color-muted)]">
          <span className="font-mono">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[var(--color-muted)]">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </span>
          <Badge variant="outline">{question.type === 'mcq' ? 'Multiple Choice' : question.type === 'true-false' ? 'True/False' : 'Essay'}</Badge>
        </div>

        <h2 className="text-lg font-medium mb-6">{question.question}</h2>

        {question.type === 'mcq' && question.options && (
          <div className="space-y-3">
            {question.options.map((option: string, idx: number) => (
              <label
                key={idx}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                }`}
              >
                <input
                  type="radio"
                  id={`${question.id}-${idx}`}
                  name={question.id}
                  value={String(idx)}
                  checked={answers[question.id] === idx}
                  onChange={() => handleAnswer(question.id, idx)}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="flex gap-4">
            {['True', 'False'].map((option, idx) => (
              <label
                key={option}
                className={`flex-1 p-4 rounded-lg border cursor-pointer text-center transition-colors ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={String(idx)}
                  checked={answers[question.id] === idx}
                  onChange={() => handleAnswer(question.id, idx)}
                  className="sr-only"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'essay' && (
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-[var(--color-border)] p-3 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            placeholder="Type your answer here..."
            value={answers[question.id] as string || ''}
            onChange={e => handleAnswer(question.id, e.target.value)}
          />
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion < assessment.questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Submit Assessment</Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {assessment.questions.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              idx === currentQuestion
                ? 'bg-[var(--color-primary)] text-white'
                : (answers[assessment.questions[idx].id] as any) !== undefined
                ? 'bg-green-100 text-green-700'
                : 'bg-[var(--color-separator)] text-[var(--color-muted)]'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
