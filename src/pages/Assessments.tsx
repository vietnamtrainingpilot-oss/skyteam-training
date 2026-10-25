import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { useAssessments } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { departmentInfo } from '../lib/constants'

export function Assessments() {
  const { assessments, isLoading } = useAssessments()

  const writtenAssessments = assessments.filter((a: any) => a.type === 'written')
  const practicalAssessments = assessments.filter((a: any) => a.type === 'practical')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]" style={{ fontFamily: 'var(--font-display)' }}>Assessments</h1>
        <p className="mt-1 text-[var(--color-muted)] text-sm">Test your knowledge and track your progress</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : (
        <>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="written">Written</TabsTrigger>
              <TabsTrigger value="practical">Practical</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-6">
              {writtenAssessments.map((assessment: any) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
              {practicalAssessments.map((assessment: any) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </TabsContent>

            <TabsContent value="written" className="space-y-3 mt-6">
              {writtenAssessments.map((assessment: any) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </TabsContent>

            <TabsContent value="practical" className="space-y-3 mt-6">
              {practicalAssessments.map((assessment: any) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function AssessmentCard({ assessment }: { assessment: any }) {
  const deptMeta = departmentInfo[assessment.department as keyof typeof departmentInfo]
  const passed = assessment.status === 'passed'
  const inProgress = assessment.status === 'in-progress'

  return (
    <div
      className="rounded-xl border p-5 bg-[var(--color-surface)] transition-all hover:shadow-sm"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${deptMeta?.color || 'var(--color-primary)'}15` }}
          >
            {assessment.type === 'written'
              ? <FileText className="h-5 w-5" style={{ color: deptMeta?.color || 'var(--color-primary)' }} />
              : <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
            }
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm text-[var(--color-fg)] tracking-tight">{assessment.title}</h3>
              <DepartmentBadge department={assessment.department} />
            </div>
            <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{assessment.description}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{assessment.timeLimit} min</span>
              <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{assessment.questions?.length || 0} questions</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-[var(--color-success)]" />Pass: {assessment.passingScore}%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge variant={passed ? 'success' : inProgress ? 'primary' : 'outline'} className="text-xs">
            {passed ? 'Passed' : inProgress ? 'In Progress' : 'Not Started'}
          </Badge>
          {assessment.type === 'written' && (
            <Link to={`/stage-testing`} className="btn-pill btn-pill-primary text-xs">
              Take Test
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
