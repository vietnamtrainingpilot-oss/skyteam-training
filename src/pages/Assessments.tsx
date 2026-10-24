import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { useAssessments } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { MotionCard } from '../components/ui/MotionCard'

export function Assessments() {
  const { assessments, isLoading } = useAssessments()

  const writtenAssessments = assessments.filter((a: any) => a.type === 'written')
  const practicalAssessments = assessments.filter((a: any) => a.type === 'practical')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
        <p className="text-[var(--color-muted)] mt-1">Test your knowledge and track your progress</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="written">Written</TabsTrigger>
          <TabsTrigger value="practical">Practical</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((assessment: any, i: number) => (
                <MotionCard key={assessment.id} delay={i * 0.05}>
                  <AssessmentCard assessment={assessment} />
                </MotionCard>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="written" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {writtenAssessments.map((assessment: any, i: number) => (
                <MotionCard key={assessment.id} delay={i * 0.05}>
                  <AssessmentCard assessment={assessment} />
                </MotionCard>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="practical" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practicalAssessments.map((assessment: any, i: number) => (
                <MotionCard key={assessment.id} delay={i * 0.05}>
                  <AssessmentCard assessment={assessment} />
                </MotionCard>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssessmentCard({ assessment }: { assessment: any }) {
  return (
    <Link
      to={`/assessments/${assessment.id}`}
      className="block card bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-card-border)] p-5 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <DepartmentBadge department={assessment.department} />
        <Badge variant={assessment.type === 'written' ? 'primary' : 'warning'}>
          {assessment.type === 'written' ? 'Written' : 'Practical'}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold group-hover:text-[var(--color-primary)] transition-colors">
        {assessment.title}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-muted)] line-clamp-2">{assessment.description}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-muted)]">
        <span className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          {assessment.questions.length} questions
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {assessment.timeLimit} min
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          {assessment.passingScore}% to pass
        </span>
      </div>
    </Link>
  )
}
