import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { studyGuideSections, StudyGuideSection } from '../lib/mockData'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Pencil, Save, X, BookOpen } from 'lucide-react'
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer'
import { departmentInfo } from '../lib/constants'

const deptList = [
  { id: 'flight-deck', title: 'Flight Deck', code: 'FLIGHT_DECK' as const },
  { id: 'cabin-crew', title: 'Cabin Crew', code: 'CABIN_CREW' as const },
  { id: 'ground-crew', title: 'Ground Crew', code: 'GROUND_CREW' as const }
]

import { LS_KEYS } from '../lib/storageKeys'

function getEditable(): Record<string, Record<string, string>> {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.HANDBOOKS_EDITABLE) || '{}') } catch { return {} }
}
function setEditable(data: Record<string, Record<string, string>>) {
  localStorage.setItem(LS_KEYS.HANDBOOKS_EDITABLE, JSON.stringify(data))
}

export function Handbooks() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const initialDept = isAdmin ? 'flight-deck' : (
    user?.department === 'FLIGHT_DECK' ? 'flight-deck'
    : user?.department === 'CABIN_CREW' ? 'cabin-crew'
    : user?.department === 'GROUND_CREW' ? 'ground-crew'
    : 'flight-deck'
  )

  const [selectedDept, setSelectedDept] = useState(initialDept)
  const [editMode, setEditMode] = useState(false)
  const [editSectionId, setEditSectionId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [localSections, setLocalSections] = useState<Record<string, StudyGuideSection[]>>({
    FLIGHT_DECK: [],
    CABIN_CREW: [],
    GROUND_CREW: []
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    const editable = getEditable()
    const merged: Record<string, StudyGuideSection[]> = {}
    for (const dept of ['FLIGHT_DECK', 'CABIN_CREW', 'GROUND_CREW'] as const) {
      merged[dept] = (studyGuideSections[dept] || []).map(s => {
        const custom = editable[dept]?.[s.id]
        return custom ? { ...s, content: custom } : s
      })
    }
    setLocalSections(merged)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentDeptCode = deptList.find(d => d.id === selectedDept)?.code || 'FLIGHT_DECK'
  const sections = localSections[currentDeptCode] || []
  const deptMeta = departmentInfo[currentDeptCode]

  const startEdit = (s: StudyGuideSection) => {
    setEditSectionId(s.id)
    setEditContent(s.content)
    setEditMode(true)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditSectionId(null)
    setEditContent('')
  }

  const saveEdit = () => {
    if (!editSectionId) return
    const newContent = editContent
    setLocalSections(prev => ({
      ...prev,
      [currentDeptCode]: prev[currentDeptCode].map(s =>
        s.id === editSectionId ? { ...s, content: newContent } : s
      )
    }))
    const editable = getEditable()
    if (!editable[currentDeptCode]) editable[currentDeptCode] = {}
    editable[currentDeptCode][editSectionId] = newContent
    setEditable(editable)
    cancelEdit()
    setToast('Section updated')
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--color-fg)] text-[var(--color-bg)] px-4 py-3 rounded-lg text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Study Handbooks</h1>
          <p className="mt-1 text-[var(--color-muted)]">Comprehensive training guides and reference materials for each department</p>
        </div>
        {deptMeta && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${deptMeta.color}12`, color: deptMeta.color, border: `1px solid ${deptMeta.color}25` }}
          >
            <deptMeta.icon className="h-4 w-4" />
            {deptMeta.name}
          </div>
        )}
      </div>

      {/* Department Selector */}
      <div className="flex gap-2 flex-wrap">
        {deptList.map(section => {
          const meta = departmentInfo[section.code]
          const isActive = selectedDept === section.id
          return (
            <button
              key={section.id}
              onClick={() => { setSelectedDept(section.id); cancelEdit() }}
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

      {/* Content */}
      {sections.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-[var(--color-meta)] opacity-40" />
          <p className="text-[var(--color-muted)]">No handbook content for this department yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sections.map((section, idx) => (
            <div key={section.id} className="card p-7">
              {/* Section header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}15`, color: deptMeta?.color || 'var(--color-primary)' }}
                  >
                    {section.order}
                  </span>
                  <h2 className="text-xl font-semibold text-[var(--color-fg)] tracking-tight">{section.title}</h2>
                </div>
                {isAdmin && !editMode && (
                  <button
                    onClick={() => startEdit(section)}
                    className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                    title="Edit section"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Edit mode */}
              {editMode && editSectionId === section.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full min-h-[280px] border border-[var(--color-border)] rounded-xl p-4 text-sm font-mono bg-[var(--color-bg)] text-[var(--color-fg)] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  />
                  <p className="text-xs text-[var(--color-muted)]">
                    Supports Markdown: **bold**, *italic*, ## headers, - lists, &gt; blockquotes, `code`
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={cancelEdit} className="btn-pill btn-pill-secondary inline-flex items-center gap-1 text-sm">
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                    <button onClick={saveEdit} className="btn-pill btn-pill-primary inline-flex items-center gap-1 text-sm">
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-5">
                  <MarkdownRenderer content={section.content} />
                </div>
              )}

              {/* Bottom divider for next section */}
              {idx < sections.length - 1 && (
                <div className="mt-6 pt-5 border-t border-[var(--color-border)]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
