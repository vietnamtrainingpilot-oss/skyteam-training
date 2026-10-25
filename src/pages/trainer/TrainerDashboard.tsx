import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ClipboardCheck, BookOpen, UserCheck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { trainerEvaluations } from '../../lib/mockData'
import { DepartmentBadge } from '../../components/features/DepartmentBadge'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { departmentInfo } from '../../lib/constants'
import { LS_KEYS } from '../../lib/storageKeys'

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

export function TrainerDashboard() {
  const { user } = useAuth()
  if (!user) return null

  const isAdmin = user.role === 'ADMIN'
  const evaluations = trainerEvaluations.filter(
    (e: any) => e.department === user.department || isAdmin
  )

  const [evalRequests, setEvalRequests] = useState<EvalRequest[]>(getEvalRequests())
  const [toast, setToast] = useState('')
  const [gradingModal, setGradingModal] = useState<{ req: EvalRequest; maxScore: number } | null>(null)
  const [gradeScore, setGradeScore] = useState('')

  const deptRequests = isAdmin
    ? evalRequests
    : evalRequests.filter(r => r.department === user.department)

  const pending = deptRequests.filter(r => r.status === 'pending')
  const accepted = deptRequests.filter(r => r.status === 'accepted')
  const completed = deptRequests.filter(r => r.status === 'completed')

  const updateRequest = (id: string, updates: Partial<EvalRequest>) => {
    const updated = evalRequests.map(r => r.id === id ? { ...r, ...updates } : r)
    setEvalRequests(updated)
    const status = updates.status || 'updated'
    setToast(`${status.charAt(0).toUpperCase() + status.slice(1)} request`)
    setTimeout(() => setToast(''), 2500)
  }

  const deptMeta = departmentInfo[user.department as keyof typeof departmentInfo]

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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Trainer Dashboard
          </h1>
          <p className="mt-1 text-[var(--color-muted)] text-sm leading-relaxed">
            Evaluate trainees, grade exams, and manage practical assessments
          </p>
        </div>
        {deptMeta && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shrink-0"
            style={{ backgroundColor: `${deptMeta.color}12`, color: deptMeta.color, border: `1px solid ${deptMeta.color}20` }}
          >
            <deptMeta.icon className="h-4 w-4" />
            {deptMeta.name}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { to: '/trainer/exams', label: 'Review Exams', desc: 'Grade submitted written exams', icon: FileText },
          { to: '/training-information', label: 'Training Info', desc: 'View criteria & manage requests', icon: ClipboardCheck },
          { to: '/handbooks', label: 'Study Guides', desc: 'Reference materials', icon: BookOpen }
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md bg-[var(--color-surface)]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}12` }}
            >
              <item.icon className="h-5 w-5" style={{ color: deptMeta?.color || 'var(--color-primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                {item.label}
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Evaluation Requests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5" style={{ color: deptMeta?.color || 'var(--color-primary)' }} />
          <h2 className="text-base font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-fg)' }}>
            Phase 2 Evaluation Requests
          </h2>
          <span
            className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            {deptRequests.length} total
          </span>
        </div>

        {deptRequests.length === 0 ? (
          <div
            className="rounded-xl p-10 text-center border bg-[var(--color-surface)]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-30 text-[var(--color-meta)]" />
            <p className="font-medium text-[var(--color-fg)] text-sm">No evaluation requests yet</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Requests appear here when trainees pass their written exams.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pending.length > 0 && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--color-warning)' }}>
                  <Clock className="h-3.5 w-3.5" />Pending ({pending.length})
                </p>
                <div className="space-y-2">
                  {pending.map(req => (
                    <EvalRequestCard
                      key={req.id}
                      req={req}
                      maxScore={evaluations.find((e: any) => e.department === req.department)?.maxScore || 60}
                      onAction={(status, notes, scores) => updateRequest(req.id, { status, evaluatorNotes: notes, scores })}
                      onGrade={() => {
                        setGradingModal({ req, maxScore: evaluations.find((e: any) => e.department === req.department)?.maxScore || 60 })
                        setGradeScore('')
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
            {accepted.length > 0 && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                  <CheckCircle className="h-3.5 w-3.5" />Accepted ({accepted.length})
                </p>
                <div className="space-y-2">
                  {accepted.map(req => (
                    <EvalRequestCard key={req.id} req={req} maxScore={60} onAction={() => {}} />
                  ))}
                </div>
              </section>
            )}
            {completed.length > 0 && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                  <CheckCircle className="h-3.5 w-3.5" />Completed ({completed.length})
                </p>
                <div className="space-y-2">
                  {completed.map(req => (
                    <EvalRequestCard key={req.id} req={req} maxScore={60} onAction={() => {}} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Evaluation Criteria */}
      {evaluations.length > 0 && (
        <div>
          <h2 className="text-base font-semibold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-fg)' }}>
            Phase 2 Evaluation Criteria
          </h2>
          <div className="space-y-3">
            {evaluations.map((ev: any, i: number) => (
              <div key={ev.department} className="rounded-xl border bg-[var(--color-surface)] overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <DepartmentBadge department={ev.department} />
                    <span className="text-sm font-medium text-[var(--color-fg)]">{ev.department.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[var(--color-success-light)] text-[var(--color-success)] font-semibold">
                      Pass: {ev.passScore}/{ev.maxScore}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Criterion</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider hidden sm:table-cell">Description</th>
                        <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider w-16">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ev.criteria.map((c: any, idx: number) => (
                        <tr key={idx} className="border-t" style={{ borderColor: 'var(--color-border-soft)' }}>
                          <td className="px-4 py-2.5 font-medium text-[var(--color-fg)]">{c.criterion}</td>
                          <td className="px-4 py-2.5 text-[var(--color-muted)] hidden sm:table-cell">{c.description}</td>
                          <td className="px-4 py-2.5 text-center font-semibold text-[var(--color-fg)]">{c.points}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderTop: `1px solid var(--color-border)` }}>
                        <td className="px-4 py-2.5 font-semibold text-sm text-[var(--color-fg)]" colSpan={2}>Total</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-sm text-[var(--color-fg)]">{ev.maxScore}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {ev.routes && ev.routes.length > 0 && (
                  <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border-soft)' }}>
                    <p className="text-xs font-semibold text-[var(--color-fg)] mb-1.5">Evaluation Routes:</p>
                    <ul className="text-xs text-[var(--color-muted)] list-disc list-inside space-y-0.5">
                      {ev.routes.map((route: string, idx: number) => <li key={idx}>{route}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradingModal && (
        <Modal
          isOpen={true}
          onClose={() => setGradingModal(null)}
          title={`Grade ${gradingModal.req.traineeName}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-muted)]">
              Enter the evaluation score (0–{gradingModal.maxScore}).
              Pass threshold: {Math.round(gradingModal.maxScore * 0.7)}+
            </p>
            <input
              type="number"
              min="0"
              max={gradingModal.maxScore}
              value={gradeScore}
              onChange={e => setGradeScore(e.target.value)}
              className="w-full input text-sm"
              placeholder="e.g. 45"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const n = parseInt(gradeScore)
                  if (!isNaN(n)) {
                    updateRequest(gradingModal.req.id, {
                      status: 'completed',
                      scores: { total: n }
                    })
                    setGradingModal(null)
                  }
                }
                if (e.key === 'Escape') setGradingModal(null)
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setGradingModal(null)}
                className="btn-pill btn-pill-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const n = parseInt(gradeScore)
                  if (!isNaN(n)) {
                    updateRequest(gradingModal.req.id, {
                      status: 'completed',
                      scores: { total: n }
                    })
                    setGradingModal(null)
                  }
                }}
                className="btn-pill btn-pill-primary text-xs py-1.5 px-3"
              >
                Save Grade
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function EvalRequestCard({
  req,
  maxScore,
  onAction,
  onGrade
}: {
  req: EvalRequest
  maxScore: number
  onAction: (status: EvalRequest['status'], notes?: string, scores?: Record<string, number>) => void
  onGrade: () => void
}) {
  const passed = req.scores?.total !== undefined && req.scores.total >= maxScore * 0.7
  return (
    <div className="rounded-xl border bg-[var(--color-surface)] p-4" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            {req.traineeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[var(--color-fg)] truncate">{req.traineeName}</p>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">{req.traineeEmail}</p>
            <p className="text-xs text-[var(--color-meta)] mt-0.5">{req.requestedAt}</p>
          </div>
        </div>
        <DepartmentBadge department={req.department as any} />
      </div>

      {req.evaluatorNotes && (
        <p className="text-xs text-[var(--color-muted)] mt-3 px-1">Note: {req.evaluatorNotes}</p>
      )}

      {req.scores?.total !== undefined && req.status === 'completed' && (
        <div className="mt-3 flex items-center gap-2">
          {passed ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-success)]">
              <CheckCircle className="h-3.5 w-3.5" />Passed — {req.scores.total}/{maxScore}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-error)]">
              <XCircle className="h-3.5 w-3.5" />Failed — {req.scores.total}/{maxScore}
            </span>
          )}
        </div>
      )}

      {req.status === 'pending' && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => onAction('accepted')}
            className="btn-pill btn-pill-secondary text-xs py-1.5 px-3"
          >
            Accept
          </button>
          <button
            onClick={() => onAction('cancelled')}
            className="btn-pill btn-pill-secondary text-xs py-1.5 px-3"
          >
            Decline
          </button>
          <button
            onClick={onGrade}
            className="btn-pill btn-pill-primary text-xs py-1.5 px-3"
          >
            Grade
          </button>
        </div>
      )}

      {req.status === 'accepted' && (
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          <CheckCircle className="h-3 w-3" />Awaiting practical evaluation
        </span>
      )}
    </div>
  )
}


