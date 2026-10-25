import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { trainerEvaluations, TrainerEvaluation, assessments, Assessment } from '../lib/mockData'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Clock, FileText, CheckCircle, UserCheck, AlertCircle, ChevronRight } from 'lucide-react'
import { departmentInfo } from '../lib/constants'
import { LS_KEYS } from '../lib/storageKeys'

const deptList = [
  { id: 'flight-deck', title: 'Flight Deck', code: 'FLIGHT_DECK' as const },
  { id: 'cabin-crew', title: 'Cabin Crew', code: 'CABIN_CREW' as const },
  { id: 'ground-crew', title: 'Ground Crew', code: 'GROUND_CREW' as const }
]


interface EvalRequest {
  id: string
  traineeName: string
  traineeEmail: string
  department: string
  requestedAt: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  evaluatorNotes?: string
  scores?: Record<string, number>
}

function getEvalRequests(): EvalRequest[] {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.EVAL_REQUESTS) || '[]') } catch { return [] }
}
function setEvalRequests(data: EvalRequest[]) {
  localStorage.setItem(LS_KEYS.EVAL_REQUESTS, JSON.stringify(data))
}

function buildStage2Form(dept: string): TrainerEvaluation | null {
  return trainerEvaluations.find(e => e.department === dept) || null
}

function getWrittenExam(dept: string): Assessment | null {
  return assessments.find(a => a.department === dept && a.type === 'written') || null
}

export function TrainingInformation() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const isTrainer = user?.role === 'TRAINER'

  const initialDeptCode = isAdmin ? 'flight-deck' : (
    user?.department === 'FLIGHT_DECK' ? 'flight-deck'
    : user?.department === 'CABIN_CREW' ? 'cabin-crew'
    : user?.department === 'GROUND_CREW' ? 'ground-crew'
    : 'flight-deck'
  )

  const [selectedDept, setSelectedDept] = useState(initialDeptCode)
  const [showEvalRequest, setShowEvalRequest] = useState(false)
  const [traineeName, setTraineeName] = useState('')
  const [traineeEmail, setTraineeEmail] = useState('')
  const [evalRequests, setEvalRequests] = useState<EvalRequest[]>([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    setEvalRequests(getEvalRequests())
  }, [showEvalRequest])

  const currentDeptCode = deptList.find(d => d.id === selectedDept)?.code || 'FLIGHT_DECK'
  const stage2Form = buildStage2Form(currentDeptCode)
  const writtenExam = getWrittenExam(currentDeptCode)
  const deptMeta = departmentInfo[currentDeptCode]

  const requestEvaluation = () => {
    if (!traineeName || !traineeEmail) return
    const newRequest: EvalRequest = {
      id: Date.now().toString(),
      traineeName,
      traineeEmail,
      department: currentDeptCode,
      requestedAt: new Date().toLocaleDateString(),
      status: 'pending'
    }
    const updated = [newRequest, ...evalRequests]
    setEvalRequests(updated)
    setShowEvalRequest(false)
    setTraineeName('')
    setTraineeEmail('')
    setToast('Evaluation request sent')
    setTimeout(() => setToast(''), 2000)
  }

  const updateRequestStatus = (reqId: string, status: EvalRequest['status'], notes?: string, scores?: Record<string, number>) => {
    const updated = evalRequests.map((r: EvalRequest) =>
      r.id === reqId ? { ...r, status, evaluatorNotes: notes, scores } : r
    )
    setEvalRequests(updated)
    setToast(`Request ${status}`)
    setTimeout(() => setToast(''), 2000)
  }

  const pendingRequests = evalRequests.filter(r => r.department === currentDeptCode && r.status === 'pending')
  const completedRequests = evalRequests.filter(r => r.department === currentDeptCode && r.status === 'completed')

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fade-in"
          style={{ backgroundColor: 'var(--color-fg)', color: 'var(--color-bg)' }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Training Information
          </h1>
          <p className="mt-1 text-[var(--color-muted)] text-sm">Examination details, evaluation criteria, and practical assessment requests</p>
        </div>
        <div className="flex items-center gap-3">
          {deptMeta && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${deptMeta.color}12`, color: deptMeta.color, border: `1px solid ${deptMeta.color}20` }}
            >
              <deptMeta.icon className="h-4 w-4" />
              {deptMeta.name}
            </div>
          )}
          {isAdmin && <DepartmentBadge department={currentDeptCode} />}
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex gap-2 flex-wrap">
        {deptList.map(section => {
          const meta = departmentInfo[section.code]
          const isActive = selectedDept === section.id
          return (
            <button
              key={section.id}
              onClick={() => setSelectedDept(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-raised)]'
              }`}
            >
              {meta && <meta.icon className="h-3.5 w-3.5" style={{color: meta.color}} />}
              {section.title}
            </button>
          )
        })}
      </div>

      {/* Stage 1: Written Exam */}
      {writtenExam && (
        <div className="rounded-xl border bg-[var(--color-surface)] overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight">Stage 1: Written Examination</h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">{writtenExam.description}</p>
            </div>
            <Link to="/stage-testing" className="btn-pill btn-pill-primary text-sm inline-flex items-center gap-2">
              Take Exam
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2 text-[var(--color-muted)]"><FileText className="h-4 w-4" />{writtenExam.questions.length} questions</span>
            <span className="flex items-center gap-2 text-[var(--color-muted)]"><Clock className="h-4 w-4" />{writtenExam.timeLimit} minutes</span>
            <span className="flex items-center gap-2 text-[var(--color-muted)]"><CheckCircle className="h-4 w-4 text-[var(--color-success)]" />Pass: {writtenExam.passingScore}%</span>
          </div>
        </div>
      )}

      {/* Stage 2: Practical Evaluation */}
      {stage2Form && (
        <div className="rounded-xl border bg-[var(--color-surface)] overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight">Stage 2: Practical Evaluation</h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">After passing the written exam, request a practical evaluation from your trainer.</p>
            </div>
            {!isTrainer && (
              <button
                onClick={() => setShowEvalRequest(!showEvalRequest)}
                className="btn-pill btn-pill-primary text-sm inline-flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                {showEvalRequest ? 'Cancel' : 'Request Evaluation'}
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Criteria Table */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Evaluation Criteria</h3>
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Criterion</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider hidden sm:table-cell">Description</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider w-16">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stage2Form.criteria.map((criterion, idx) => (
                      <tr key={idx} className="border-t" style={{ borderColor: 'var(--color-border-soft)' }}>
                        <td className="px-4 py-2.5 font-medium text-[var(--color-fg)]">{criterion.criterion}</td>
                        <td className="px-4 py-2.5 text-[var(--color-muted)] hidden sm:table-cell">{criterion.description}</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-[var(--color-fg)]">{criterion.points}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderTop: `1px solid var(--color-border)` }}>
                      <td className="px-4 py-2.5 font-semibold text-sm text-[var(--color-fg)]" colSpan={2}>Total</td>
                      <td className="px-4 py-2.5 text-center font-semibold text-sm text-[var(--color-fg)]">{stage2Form.maxScore}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-[var(--color-muted)]">
                  Pass Score: <strong className="text-[var(--color-success)]">{stage2Form.passScore}</strong> / {stage2Form.maxScore} points
                </span>
                {stage2Form.routes && stage2Form.routes.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {stage2Form.routes.length} route{stage2Form.routes.length > 1 ? 's' : ''} available
                  </span>
                )}
              </div>
            </div>

            {/* Trainee View: Request Form */}
            {showEvalRequest && !isTrainer && !isAdmin && (
              <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                <h4 className="text-sm font-semibold text-[var(--color-fg)] mb-3">Request Practical Evaluation</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Trainee Name *</label>
                    <input value={traineeName} onChange={e => setTraineeName(e.target.value)} placeholder="Enter trainee name" className="input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Trainee Email *</label>
                    <input value={traineeEmail} onChange={e => setTraineeEmail(e.target.value)} placeholder="Enter trainee email" className="input text-sm" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowEvalRequest(false)} className="btn-pill btn-pill-secondary text-xs">Cancel</button>
                    <button onClick={requestEvaluation} className="btn-pill btn-pill-primary text-xs">Submit Request</button>
                  </div>
                </div>
              </div>
            )}

            {/* Trainer/Admin: Evaluation Requests */}
            {(isTrainer || isAdmin) && (
              <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">Evaluation Requests</h3>
                {pendingRequests.length === 0 && completedRequests.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)]">No evaluation requests for this department.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-warning)] uppercase tracking-wider mb-2">Pending ({pendingRequests.length})</p>
                        <div className="space-y-2">
                          {pendingRequests.map(req => (
                            <div key={req.id} className="rounded-lg border p-4 bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-sm text-[var(--color-fg)]">{req.traineeName}</p>
                                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{req.traineeEmail} · {req.requestedAt}</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-warning)]/10 text-[var(--color-warning)]">
                                  Pending
                                </span>
                              </div>
                              <div className="mt-3 flex gap-2 flex-wrap">
                                <button onClick={() => updateRequestStatus(req.id, 'accepted')} className="btn-pill btn-pill-secondary text-xs py-1 px-3">Accept</button>
                                <button onClick={() => updateRequestStatus(req.id, 'cancelled')} className="btn-pill btn-pill-secondary text-xs py-1 px-3">Decline</button>
                                <button
                                  onClick={() => {
                                    const score = prompt(`Enter evaluation score (0–${stage2Form.maxScore}):`)
                                    if (score !== null) {
                                      const n = parseInt(score)
                                      if (!isNaN(n)) updateRequestStatus(req.id, 'completed', '', { total: n })
                                    }
                                  }}
                                  className="btn-pill btn-pill-primary text-xs py-1 px-3"
                                >
                                  Grade
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {completedRequests.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-success)] uppercase tracking-wider mb-2">Completed</p>
                        <div className="space-y-2">
                          {completedRequests.map(req => (
                            <div key={req.id} className="rounded-lg border p-4 bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-sm text-[var(--color-fg)]">{req.traineeName}</p>
                                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{req.traineeEmail} · {req.requestedAt}</p>
                                  {req.evaluatorNotes && <p className="text-xs text-[var(--color-muted)] mt-1">Note: {req.evaluatorNotes}</p>}
                                </div>
                                <div className="text-right">
                                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-success)]/10 text-[var(--color-success)]">Completed</span>
                                  {req.scores?.total !== undefined && (
                                    <p className="text-lg font-bold text-[var(--color-fg)] mt-1 tracking-tight">{req.scores.total}/{stage2Form.maxScore}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
