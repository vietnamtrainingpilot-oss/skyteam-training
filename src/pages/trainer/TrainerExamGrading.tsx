import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { assessments, AssessmentQuestion } from '../../lib/mockData'
import { DepartmentBadge } from '../../components/features/DepartmentBadge'
import { Badge } from '../../components/ui/Badge'
import { departmentInfo } from '../../lib/constants'
import { LS_KEYS } from '../../lib/storageKeys'

interface SubmittedExam {
  id: string
  examId: string
  examTitle: string
  department: string
  traineeName: string
  traineeEmail: string
  submittedAt: string
  answers: Record<string, string | number>
  mcqScore: number
  mcqTotal: number
  essayQuestions: AssessmentQuestion[]
  status: 'pending' | 'graded'
  trainerGrade?: number
  trainerNotes?: string
}

function getSubmittedExams(): SubmittedExam[] {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.SUBMITTED_EXAMS) || '[]') } catch { return [] }
}

export function TrainerExamGrading() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const isTrainer = user?.role === 'TRAINER'

  if (!user || (!isAdmin && !isTrainer)) {
    return (
      <div className="rounded-xl p-10 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-[var(--color-muted)]">Access denied. Trainers and admins only.</p>
        <Link to="/dashboard" className="mt-4 inline-flex text-[var(--color-primary)] hover:underline text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const [submittedExams, setSubmittedExams] = useState<SubmittedExam[]>([])
  const [filterDept, setFilterDept] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [gradingExam, setGradingExam] = useState<SubmittedExam | null>(null)
  const [trainerNotes, setTrainerNotes] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    setSubmittedExams(getSubmittedExams())
  }, [])

  const filteredExams = submittedExams.filter(e => {
    const matchDept = filterDept === 'all' || e.department === filterDept
    const matchStatus = filterStatus === 'all' || e.status === filterStatus
    return matchDept && matchStatus
  })

  const openGrade = (exam: SubmittedExam) => {
    setGradingExam(exam)
    setTrainerNotes(exam.trainerNotes || '')
  }

  const submitGrade = () => {
    if (!gradingExam) return
    const finalScore = Math.round((gradingExam.mcqScore / gradingExam.mcqTotal) * 100)
    const updated = submittedExams.map(e =>
      e.id === gradingExam.id
        ? { ...e, status: 'graded' as const, trainerGrade: finalScore, trainerNotes }
        : e
    )
    setSubmittedExams(updated)
    localStorage.setItem(LS_KEYS.SUBMITTED_EXAMS, JSON.stringify(updated))
    setGradingExam(null)
    setTrainerNotes('')
    setToast(`Graded ${gradingExam.traineeName}: ${finalScore}%`)
    setTimeout(() => setToast(''), 3000)
  }

  const departments = ['all', 'FLIGHT_DECK', 'CABIN_CREW', 'GROUND_CREW']

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
      <div className="flex items-start justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1
            className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Review Exams
          </h1>
          <p className="mt-1 text-[var(--color-muted)] text-sm">Grade submitted written examinations from trainees</p>
        </div>
        {isAdmin && (
          <Badge variant="primary" className="text-xs">Admin View</Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 p-1 rounded-full bg-[var(--color-surface)] border" style={{ borderColor: 'var(--color-border)' }}>
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setFilterDept(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                filterDept === d ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]'
              }`}
            >
              {d === 'all' ? 'All Depts' : d.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-full bg-[var(--color-surface)] border ml-auto" style={{ borderColor: 'var(--color-border)' }}>
          {['all', 'pending', 'graded'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                filterStatus === s ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Exam List */}
      {filteredExams.length === 0 ? (
        <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-20 text-[var(--color-meta)]" />
          <p className="text-base font-medium text-[var(--color-fg)]">No exams submitted yet</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">Exams will appear here when trainees complete their written tests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExams.map(exam => {
            const examInfo = assessments.find(a => a.id === exam.examId)
            const passed = exam.trainerGrade !== undefined && exam.trainerGrade >= (examInfo?.passingScore || 70)
            const deptMeta = departmentInfo[exam.department as keyof typeof departmentInfo]
            return (
              <div
                key={exam.id}
                className="rounded-xl p-5 border bg-[var(--color-surface)] transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}15` }}
                    >
                      {deptMeta && <deptMeta.icon className="h-5 w-5" style={{ color: deptMeta.color }} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--color-fg)] text-sm tracking-tight">{exam.examTitle}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-0.5">
                        {exam.traineeName}
                        <span className="mx-1.5 text-[var(--color-meta)]">·</span>
                        {exam.submittedAt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-muted)]">
                        <span>MCQ: {exam.mcqScore}/{exam.mcqTotal}</span>
                        {exam.essayQuestions.length > 0 && (
                          <span className="flex items-center gap-1 text-[var(--color-warning)]">
                            <AlertCircle className="h-3 w-3" />{exam.essayQuestions.length} essay(s) for review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {exam.status === 'graded' ? (
                      <div className="text-right">
                        <Badge variant={passed ? 'success' : 'destructive'} className="text-xs">
                          {passed ? 'Passed' : 'Failed'}
                        </Badge>
                        <p className="text-xl font-bold text-[var(--color-fg)] mt-1 tracking-tight">
                          {exam.trainerGrade}%
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => openGrade(exam)}
                        className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm"
                      >
                        Grade
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Grading Modal */}
      {gradingExam && (() => {
        const examInfo = assessments.find(a => a.id === gradingExam.examId)
        if (!examInfo) return null
        const mcqPct = Math.round((gradingExam.mcqScore / gradingExam.mcqTotal) * 100)
        const deptMeta = departmentInfo[gradingExam.department as keyof typeof departmentInfo]
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
              className="bg-[var(--color-bg)] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
              style={{ boxShadow: 'var(--shadow-xl)' }}
            >
              {/* Modal header */}
              <div
                className="sticky top-0 bg-[var(--color-bg)] border-b px-6 py-4 flex items-center justify-between z-10"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div>
                  <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight">Grade Exam</h2>
                  <p className="text-sm text-[var(--color-muted)] mt-0.5">
                    {gradingExam.traineeName} · {gradingExam.examTitle}
                  </p>
                </div>
                <button
                  onClick={() => setGradingExam(null)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* MCQ Results */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">MCQ Results</h3>
                  <div
                    className="rounded-xl p-4 bg-[var(--color-surface)] border"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[var(--color-muted)]">Multiple Choice Score</span>
                      <span className="text-lg font-bold text-[var(--color-fg)] tracking-tight">
                        {gradingExam.mcqScore}/{gradingExam.mcqTotal}
                        <span className="text-sm font-normal text-[var(--color-muted)] ml-2">
                          ({mcqPct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(gradingExam.mcqScore / gradingExam.mcqTotal) * 100}%`,
                          backgroundColor: mcqPct >= (examInfo.passingScore || 70) ? 'var(--color-success)' : 'var(--color-error)'
                        }}
                      />
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-2">
                      Passing score: {examInfo.passingScore}%
                    </p>
                  </div>
                </div>

                {/* Essay Answers */}
                {examInfo.questions.filter(q => q.type === 'essay').length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
                      Essay Answers (Manual Review)
                    </h3>
                    <div className="space-y-3">
                      {examInfo.questions
                        .filter(q => q.type === 'essay')
                        .map((q) => {
                          const answer = gradingExam.answers[q.id] as string
                          return (
                            <div
                              key={q.id}
                              className="rounded-xl p-4 bg-[var(--color-surface)] border"
                              style={{ borderColor: 'var(--color-border)' }}
                            >
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <p className="font-medium text-sm text-[var(--color-fg)] flex-1">{q.question}</p>
                                <Badge variant="outline" className="shrink-0 text-xs">Essay</Badge>
                              </div>
                              <p className="text-sm text-[var(--color-fg-secondary)] whitespace-pre-wrap bg-[var(--color-bg)] p-3 rounded-lg border text-sm leading-relaxed"
                                style={{ borderColor: 'var(--color-border-soft)' }}
                              >
                                {answer || <em className="text-[var(--color-meta)]">No answer provided</em>}
                              </p>
                              {q.explanation && (
                                <p className="text-xs text-[var(--color-muted)] mt-2 italic">{q.explanation}</p>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {/* Grading Notes */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-fg)] mb-1.5">
                    Trainer Notes <span className="text-[var(--color-muted)] font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={trainerNotes}
                    onChange={e => setTrainerNotes(e.target.value)}
                    placeholder="Add any notes about this trainee's performance..."
                    className="w-full min-h-[100px] input resize-y"
                  />
                </div>

                {/* Summary */}
                <div
                  className="rounded-xl p-4 bg-[var(--color-surface)] border"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    {[
                      { label: 'MCQ Score', value: `${gradingExam.mcqScore}/${gradingExam.mcqTotal}` },
                      { label: 'MCQ %', value: `${mcqPct}%`, color: mcqPct >= (examInfo.passingScore || 70) ? 'var(--color-success)' : 'var(--color-error)' },
                      { label: 'Passing %', value: `${examInfo.passingScore}%` },
                      { label: 'Essays', value: `${examInfo.questions.filter(q => q.type === 'essay').length}` }
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-[var(--color-muted)]">{item.label}</p>
                        <p className="font-semibold text-[var(--color-fg)] mt-0.5" style={item.color ? { color: item.color } : undefined}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky footer */}
              <div
                className="sticky bottom-0 bg-[var(--color-bg)] border-t px-6 py-4 flex justify-end gap-3"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <button onClick={() => setGradingExam(null)} className="btn-pill btn-pill-secondary text-sm">
                  Cancel
                </button>
                <button
                  onClick={submitGrade}
                  className="btn-pill btn-pill-primary inline-flex items-center gap-2 text-sm"
                >
                  <Save className="h-4 w-4" />
                  Submit Grade
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
