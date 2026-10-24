import { useQuery } from '@tanstack/react-query'
import { getAssessments, getAssessment } from '../lib/supabase-api'

export function useAssessments(department?: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['assessments', department],
    queryFn: () => getAssessments(department),
    select: data => data?.assessments || [],
    staleTime: 1000 * 60 * 5
  })

  const assessments = data ?? []

  return {
    assessments,
    isLoading
  }
}

export function useAssessment(assessmentId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => getAssessment(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 5
  })

  return {
    assessment: data?.assessment ?? null,
    isLoading
  }
}
