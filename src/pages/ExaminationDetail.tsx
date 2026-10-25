import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { useAssessment } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { departmentInfo } from '../lib/constants'

interface AnswerState {
  [key: string]: string | number
}

export function ExaminationDetail() {
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
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0 }
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
    const mcqQuestions = assessment.questions.filter((q: any) => q.type === 'mcq' || q.type === 'true-false')
    mcqQuestions.forEach((q: any) => { if (answers[q.id] === q.correctAnswer) correct++ })
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
      <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-[var(--color-muted)]">Assessment not found</p>
        <Link to="/examinations" className="mt-4 inline-flex text-[var(--color-primary)] hover:underline text-sm font-medium">Back to examinations</Link>
      </div>
    )
  }

  const question = assessment.questions[currentQuestion]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const meta = departmentInfo[assessment.department as keyof typeof departmentInfo]
  const answeredCount = assessment.questions.filter((q: any) => answers[q.id] !== undefined).length
  const progress = Math.round((answeredCount / assessment.questions.length) * 100)
  const isLowTimer = timeLeft < 60

  if (isSubmitted) {
    const passed = (score || 0) >= assessment.passingScore
    const mcqQuestions = assessment.questions.filter((q: any) => q.type === 'mcq' || q.type === 'true-false')
    const mcqCorrect = mcqQuestions.filter((q: any) => answers[q.id] === q.correctAnswer).length

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl border overflow-hidden bg-[var(--color-surface)]" style={{ borderColor: passed ? 'var(--color-success)' : 'var(--color-error)' }}>
          <div className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 border-4 ${
              passed
                ? 'border-[var(--color-success)] bg-[var(--color-success-light)]'
                : 'border-[var(--color-error)] bg-[var(--color-error-light)]'
            }`}>
              {passed
                ? <CheckCircle className="h-10 w-10 text-[var(--color-success)]" />
                : <XCircle className="h-10 w-10 text-[var(--color-error)]" />
              }
            </div>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: passed ? 'var(--color-success)' : 'var(--color-error)' }}
            >
              {passed ? 'Exam Passed!' : 'Exam Failed'}
            </h2>
            <p className="mt-3 text-[var(--color-muted)] leading-relaxed">
              MCQ Score: <span className="font-semibold text-[var(--color-fg)]">{mcqCorrect}/{mcqQuestions.length}</span> &nbsp;·&nbsp;
              Overall: <span className="font-semibold text-[var(--color-fg)]">{score}%</span> &nbsp;·&nbsp;
              Pass mark: {assessment.passingScore}%
            </p>
            <p className="mt-2 text-sm text-[var(--color-warning)] bg-[var(--color-warning-light)] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
              Essay questions require trainer review for final grading.
            </p>
            <div className="mt-8 flex gap-3 justify-center">
              <Button className="btn-pill-primary">
                <Link to="/examinations" className="text-[var(--color-primary)]">Back to Examinations</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/examinations" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to examinations
      </Link>

      {/* Header card */}
      <div className="rounded-xl border bg-[var(--color-surface)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15` }}
          >
            <FileText className="h-5 w-5" style={{ color: meta?.color || 'var(--color-primary)' }} />
          </div>
          <div>
            <DepartmentBadge department={assessment.department} />
            <h1 className="text-base font-semibold text-[var(--color-fg)] mt-0.5 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{assessment.title}</h1>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold ${isLowTimer ? 'bg-[var(--color-error-light)] text-[var(--color-error)]' : 'bg-[var(--color-surface-hover)] text-[var(--color-fg)]'}`}>
          <Clock className="h-4 w-4" />
          <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border bg-[var(--color-surface)] p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>Progress</span>
          <span className="text-xs font-semibold text-[var(--color-fg)]">{answeredCount}/{assessment.questions.length} answered</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-separator)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: meta?.color || 'var(--color-primary)' }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-xl border bg-[var(--color-surface)] p-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-medium text-[var(--color-muted)]">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </span>
          <Badge
            variant={question.type === 'mcq' ? 'primary' : question.type === 'true-false' ? 'warning' : 'outline'}
            className="text-xs"
          >
            {question.type === 'mcq' ? 'Multiple Choice' : question.type === 'true-false' ? 'True/False' : 'Essay Question'}
          </Badge>
        </div>

        <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
          {question.question}
        </h2>

        {/* MCQ options */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2.5">
            {question.options.map((option: string, idx: number) => (
              <label
                key={idx}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm'
                    : 'border-[var(--color-border)] hover:border-[var(--color-muted)] bg-[var(--color-surface)]'
                }`}
                style={answers[question.id] === idx ? { borderColor: meta?.color } : undefined}
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
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: answers[question.id] === idx
                      ? `${meta?.color || 'var(--color-primary)'}20`
                      : 'var(--color-separator)',
                    color: answers[question.id] === idx
                      ? meta?.color || 'var(--color-primary)'
                      : 'var(--color-muted)'
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium text-[var(--color-fg)]">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* True/False */}
        {question.type === 'true-false' && (
          <div className="grid grid-cols-2 gap-3">
            {['True', 'False'].map((option, idx) => (
              <label
                key={option}
                className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer text-center font-bold transition-all duration-150 ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm'
                    : 'border-[var(--color-border)] hover:border-[var(--color-muted)] bg-[var(--color-surface)]'
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
                <span className="text-[var(--color-fg)] text-base">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Essay */}
        {question.type === 'essay' && (
          <textarea
            className="w-full min-h-[160px] rounded-xl border-2 border-[var(--color-border)] p-4 text-sm resize-none focus:outline-none focus:border-[var(--color-primary)] transition-colors bg-[var(--color-surface)] text-[var(--color-fg)] leading-relaxed"
            placeholder="Type your answer here... Be thorough and specific."
            value={(answers[question.id] as string) || ''}
            onChange={e => handleAnswer(question.id, e.target.value)}
          />
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="btn-pill-secondary"
          >
            Previous
          </Button>
          {currentQuestion < assessment.questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestion(prev => prev + 1)} className="btn-pill-primary">
              Next
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} className="btn-pill-primary">
              Submit Exam
            </Button>
          )}
        </div>
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-2">
        {assessment.questions.map((q: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition-all duration-150 ${
              idx === currentQuestion
                ? 'bg-[var(--color-fg)] text-[var(--color-bg)] scale-110 shadow-md'
                : answers[q.id] !== undefined
                  ? 'bg-[var(--color-success)] text-white'
                  : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]'
            }`}
            style={idx === currentQuestion ? { backgroundColor: meta?.color || 'var(--color-primary)', color: '#fff', borderColor: meta?.color } : undefined}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
