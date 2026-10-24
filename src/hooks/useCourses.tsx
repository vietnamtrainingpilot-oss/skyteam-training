import { useQuery } from '@tanstack/react-query'
import { getCourses, getCourse } from '../lib/supabase-api'

export function useCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    select: data => data?.courses || []
  })

  const courses = data ?? []

  return {
    courses,
    isLoading
  }
}

export function useCourse(courseId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5
  })

  return {
    course: data?.course ?? null,
    isLoading
  }
}
