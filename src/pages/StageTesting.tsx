import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Clock, ChevronRight, Lock, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { assessments, AssessmentQuestion } from '../lib/mockData'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { departmentInfo } from '../lib/constants'
import { LS_KEYS } from '../lib/storageKeys'

interface AnswerState {
  [key: string]: string | number
}

const LS_KEY = LS_KEYS.SUBMITTED_EXAMS

function getSubmittedExams() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}

function buildTests() {
  return assessments
    .filter(a => a.type === 'written')
    .map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      department: a.department,
      stage: 1,
      questions: a.questions,
      passingScore: a.passingScore,
      timeLimit: a.timeLimit
    }))
}

const stageTests = buildTests()

export function StageTesting() {
  const { user } = useAuth()
  const { stageId } = useParams<{ stageId: string }>()
  const [answers, setAnswers] = useState<AnswerState>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const isAdmin = user?.role === 'ADMIN'
  const visibleTests = isAdmin ? stageTests : stageTests.filter(t => t.department === user?.department)
  const testId = stageId || visibleTests[0]?.id
  const test = visibleTests.find(t => t.id === testId)
  const currentTest = test

  const deptMeta = currentTest ? departmentInfo[currentTest.department as keyof typeof departmentInfo] : null

  // Add department selector for admin
  const [selectedDept, setSelectedDept] = useState<string>(currentTest?.department || 'FLIGHT_DECK')

  useEffect(() => {
    if (currentTest && !isSubmitted) {
      setTimeLeft((currentTest.timeLimit || currentTest.questions.length * 3) * 60)
    }
  }, [currentTest, isSubmitted])

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
    if (!currentTest) return
    setIsSubmitted(true)

    let correct = 0
    const mcqQuestions = currentTest.questions.filter(q => q.type === 'mcq' || q.type === 'true-false')
    mcqQuestions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) correct++
    })

    const finalScore = Math.round((correct / currentTest.questions.length) * 100)
    setScore(finalScore)

    // Persist for trainer grading
    try {
      const existing: any[] = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      existing.push({
        id: Date.now().toString(),
        examId: currentTest.id,
        examTitle: currentTest.title,
        department: currentTest.department,
        traineeName: user?.name || 'Unknown',
        traineeEmail: user?.email || 'unknown@test.com',
        submittedAt: new Date().toLocaleDateString(),
        answers,
        mcqScore: correct,
        mcqTotal: mcqQuestions.length,
        essayQuestions: currentTest.questions.filter(q => q.type === 'essay'),
        status: 'pending' as const
      })
      localStorage.setItem(LS_KEY, JSON.stringify(existing))
    } catch {}
  }

  if (!currentTest) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to="/stage-testing" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="card p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[var(--color-muted)] opacity-40" />
          <p className="text-[var(--color-muted)]">No exam available for your department yet.</p>
          <Link to="/dashboard" className="mt-4 inline-flex text-[var(--color-primary)] hover:underline text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const question = currentTest.questions[currentQuestion]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((currentQuestion + 1) / currentTest.questions.length) * 100

  if (isSubmitted) {
    const passed = (score || 0) >= currentTest.passingScore
    const mcqQuestions = currentTest.questions.filter(q => q.type === 'mcq' || q.type === 'true-false')
    const mcqCorrect = mcqQuestions.filter(q => answers[q.id] === q.correctAnswer).length

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-16">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 border-4 ${
            passed
              ? 'border-[var(--color-success)] bg-[var(--success-light)]'
              : 'border-[var(--color-error)] bg-[var(--danger-light)]'
          }`}>
            {passed ? (
              <CheckCircle className="h-10 w-10 text-[var(--color-success)]" />
            ) : (
              <XCircle className="h-10 w-10 text-[var(--color-error)]" />
            )}
          </div>
          <h2 className="text-3xl font-semibold text-[var(--color-fg)] tracking-tight">
            {passed ? 'Test Passed!' : 'Test Failed'}
          </h2>
          <p className="mt-3 text-[var(--color-muted)] text-base">
            MCQ Score: {mcqCorrect}/{mcqQuestions.length} &middot; Overall: {score}% &middot; Need {currentTest.passingScore}% to pass
          </p>
          {currentTest.questions.some(q => q.type === 'essay') && (
            <p className="mt-3 text-sm text-[var(--color-warning)] bg-[var(--warning-light)] border border-[var(--color-warning)]/20 rounded-lg px-4 py-2.5 inline-flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Essay questions require trainer review for final grading.
            </p>
          )}

          {passed && (
            <div className="mt-10 card p-6 bg-[var(--color-primary-light)] border-[var(--color-primary)]/20">
              <h3 className="font-semibold text-[var(--color-fg)] mb-2">Stage 1 Complete!</h3>
              <p className="text-sm text-[var(--color-muted)] mb-4">You can now request a practical evaluation from your trainer via the Training Information page.</p>
              <Link to="/training-information" className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm">
                Request Practical Evaluation
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/stage-testing">
              <Button variant="outline" className="text-sm">
                Back to Exams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/stage-testing" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Exams
      </Link>

      {/* Header bar */}
      <div className="card p-4 bg-[var(--color-surface)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {deptMeta && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${deptMeta.color}15` }}>
              <deptMeta.icon className="h-4 w-4" style={{ color: deptMeta.color }} />
            </div>
          )}
          <div>
            <h1 className="font-semibold text-[var(--color-fg)] text-base">{currentTest.title}</h1>
            <p className="text-xs text-[var(--color-muted)]">{currentTest.questions.length} questions &middot; {currentTest.timeLimit} min</p>
          </div>
        </div>

        {/* Department selector for admin */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--color-muted)]">Dept:</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="input text-sm py-1.5 px-3 min-w-[140px]"
            >
              <option value="FLIGHT_DECK">Flight Deck</option>
              <option value="CABIN_CREW">Cabin Crew</option>
              <option value="GROUND_CREW">Ground Crew</option>
            </select>
          </div>
        )}

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono font-medium ${
          timeLeft <= 60 ? 'bg-[var(--danger-light)] text-[var(--color-error)]' : 'bg-[var(--color-surface-hover)] text-[var(--color-muted)]'
        }`}>
          <Clock className="h-3.5 w-3.5" />
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="card p-7 bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-medium text-[var(--color-muted)]">
            Question {currentQuestion + 1} of {currentTest.questions.length}
          </span>
          <Badge variant={question.type === 'mcq' ? 'primary' : question.type === 'true-false' ? 'warning' : 'outline'}>
            {question.type === 'mcq' ? 'Multiple Choice' : question.type === 'true-false' ? 'True/False' : 'Essay'}
          </Badge>
        </div>

        <h2 className="text-lg font-semibold mb-6 text-[var(--color-fg)] leading-relaxed">
          {question.question}
        </h2>

        {question.type === 'mcq' && question.options && (
          <div className="space-y-2.5">
            {question.options.map((option: string, idx: number) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30 bg-[var(--color-surface)]'
                }`}
              >
                <input
                  type="radio"
                  id={`${question.id}-${idx}`}
                  name={question.id}
                  value={idx}
                  checked={answers[question.id] === idx}
                  onChange={() => handleAnswer(question.id, idx)}
                  className="peer sr-only"
                />
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-[var(--color-border)] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]'
                }`}>
                  {answers[question.id] === idx && <span className="w-2 h-2 rounded-full bg-[var(--color-fg)]" />}
                </span>
                <span className={`text-sm ${answers[question.id] === idx ? 'text-[var(--color-fg)] font-medium' : 'text-[var(--color-fg-secondary)]'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="grid grid-cols-2 gap-3">
            {['True', 'False'].map((option, idx) => (
              <label
                key={option}
                className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer text-center transition-all ${
                  answers[question.id] === idx
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
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
                <span className={`font-semibold ${answers[question.id] === idx ? 'text-[var(--color-primary)]' : 'text-[var(--color-fg)]'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'essay' && (
          <textarea
            className="w-full min-h-[160px] border border-[var(--color-border)] rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-[var(--color-bg)] text-[var(--color-fg)] leading-relaxed"
            placeholder="Type your answer here... Be thorough and specific."
            value={(answers[question.id] as string) || ''}
            onChange={e => handleAnswer(question.id, e.target.value)}
          />
        )}

        {question.explanation && (
          <p className="mt-3 text-xs text-[var(--color-muted)] italic">
            For trainer review: {question.explanation}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="text-sm"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion < currentTest.questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(prev => prev + 1)} className="text-sm">
                Next
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} className="text-sm">
                Submit Test
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Question navigator */}
      <div className="card p-5 bg-[var(--color-surface)]">
        <div className="flex gap-2 flex-wrap">
          {currentTest.questions.map((_: any, questionIdx: number) => {
            const q = currentTest.questions[questionIdx]
            const answered = answers[q.id] !== undefined
            const isCurrent = questionIdx === currentQuestion
            return (
              <button
                key={questionIdx}
                onClick={() => setCurrentQuestion(questionIdx)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                  isCurrent
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : answered
                      ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30'
                      : 'bg-[var(--color-surface-hover)] text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40'
                }`}
              >
                {questionIdx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stage progress */}
      <div className="card p-6 bg-[var(--color-surface)]">
        <h3 className="text-sm font-semibold text-[var(--color-fg)] mb-4">Stage Progress</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--color-fg)]">Stage 1: Written Assessment</span>
              {isSubmitted && <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />}
            </div>
            <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-success)] rounded-full transition-all duration-500"
                style={{ width: isSubmitted ? '100%' : '0%' }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--color-fg)]">Stage 2: Practical Eval</span>
              <Lock className="h-4 w-4 text-[var(--color-muted)]" />
            </div>
            <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)]/40 rounded-full transition-all"
                style={{ width: isSubmitted ? '30%' : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StageTestingList() {
  const { user } = useAuth()
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const isAdmin = user?.role === 'ADMIN'

  const visibleTests = isAdmin
    ? stageTests
    : stageTests.filter(t => t.department === user?.department)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Stage Testing</h1>
        <p className="mt-1 text-[var(--color-muted)]">Complete Stage 1 written exam, then request practical evaluation from your trainer</p>
      </div>

      {isAdmin && (
        <Badge variant="primary" className="text-xs">Admin View — all departments</Badge>
      )}

      {visibleTests.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-[var(--color-meta)] opacity-40" />
          <p className="text-[var(--color-muted)]">No written exams available for your department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleTests.map(test => (
            <button
              key={test.id}
              onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
              className={`card p-6 text-left transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md ${
                selectedTest === test.id ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <DepartmentBadge department={test.department} />
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  Stage 1
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-fg)] tracking-tight">{test.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{test.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-muted)]">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{test.timeLimit} min</span>
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{test.questions.length} Qs</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-[var(--color-success)]" />Pass: {test.passingScore}%</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedTest && (() => {
        const t = stageTests.find(x => x.id === selectedTest)
        if (!t) return null
        return (
          <div className="card p-6 bg-[var(--color-surface)] border-[var(--color-primary)]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-fg)]">{t.title}</h3>
                <p className="text-[var(--color-muted)] mt-1 text-sm">{t.questions.length} questions &middot; {t.timeLimit} minutes &middot; pass at {t.passingScore}%</p>
              </div>
              <Link to={`/stage-testing/${selectedTest}`}>
                <Button variant="primary" className="text-sm">
                  Start Test
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
