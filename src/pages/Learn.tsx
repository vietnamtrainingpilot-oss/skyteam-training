import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Play, CheckCircle, Circle } from 'lucide-react'
import { useCourse } from '../hooks/useCourses'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

export function Learn() {
  const { courseId } = useParams<{ courseId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { course, isLoading } = useCourse(courseId || '')
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [activeLessonId] = useState<string | null>(searchParams.get('lesson'))

  useEffect(() => {
    const module = searchParams.get('module')
    if (module) setActiveModuleId(module)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)]">Course not found</p>
        <Link to="/courses" className="mt-4 inline-flex text-[var(--color-primary)]">
          Back to courses
        </Link>
      </div>
    )
  }

  const currentModuleId = activeModuleId || course.modules[0]?.id
  const currentModule = course.modules.find((m: any) => m.id === currentModuleId)
  const currentLessonId = activeLessonId || currentModule?.lessons[0]?.id
  const currentLesson = currentModule?.lessons.find((l: any) => l.id === currentLessonId)

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    setSearchParams({ module: moduleId, lesson: lessonId })
  }

  const handleNextLesson = () => {
    if (!currentModule || !currentLesson) return
    const lessons = currentModule.lessons
    const idx = lessons.findIndex((l: any) => l.id === currentLessonId)
    if (idx < lessons.length - 1) {
      handleLessonClick(currentModule.id, lessons[idx + 1].id)
    } else {
      const moduleIdx = course.modules.findIndex((m: any) => m.id === currentModuleId)
      if (moduleIdx < course.modules.length - 1) {
        const nextModule = course.modules[moduleIdx + 1]
        handleLessonClick(nextModule.id, nextModule.lessons[0].id)
      }
    }
  }

  const handlePrevLesson = () => {
    if (!currentModule || !currentLesson) return
    const lessons = currentModule.lessons
    const idx = lessons.findIndex((l: any) => l.id === currentLessonId)
    if (idx > 0) {
      handleLessonClick(currentModule.id, lessons[idx - 1].id)
    } else {
      const moduleIdx = course.modules.findIndex((m: any) => m.id === currentModuleId)
      if (moduleIdx > 0) {
        const prevModule = course.modules[moduleIdx - 1]
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
        handleLessonClick(prevModule.id, lastLesson.id)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold px-2">Course Content</h2>
          {course.modules.map((module: any) => (
            <div key={module.id} className="rounded-lg border border-[var(--color-border)] overflow-hidden">
              <button
                onClick={() => setActiveModuleId(module.id === activeModuleId ? null : module.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <span className="font-medium text-sm">{module.title}</span>
                <span className="text-[var(--color-muted)] text-xs">{module.lessons.length} lessons</span>
              </button>
              {activeModuleId === module.id && (
                <div className="border-t border-[var(--color-separator)]">
                  {module.lessons.map((lesson: any) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(module.id, lesson.id)}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-[var(--color-bg-secondary)] transition-colors ${
                        currentLessonId === lesson.id ? 'bg-[var(--color-primary-light)]' : ''
                      }`}
                    >
                      {currentLessonId === lesson.id ? (
                        <CheckCircle className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--color-muted)] shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                        <p className="text-xs text-[var(--color-muted)]">{lesson.duration}</p>
                      </div>
                      {lesson.type === 'video' && <Play className="h-3 w-3 text-[var(--color-muted)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <span>{currentModule?.title}</span>
                <span>/</span>
                <span>{currentLesson.title}</span>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 min-h-[400px]">
                {currentLesson.type === 'video' ? (
                  <div className="aspect-video bg-[var(--color-bg-secondary)] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-[var(--color-muted)] mx-auto mb-2" />
                      <p className="text-sm text-[var(--color-muted)]">Video player placeholder</p>
                    </div>
                  </div>
                ) : currentLesson.type === 'quiz' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
                      <h3 className="text-lg font-semibold">Quiz: {currentLesson.title}</h3>
                    </div>
                    <p className="text-[var(--color-muted)]">This quiz will test your understanding of the material.</p>
                    <Button>
                      <Link to={`/assessments?course=${courseId}&module=${currentModule?.id}`}>
                        Start Quiz
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-4">{currentLesson.title}</h3>
                    <p className="text-[var(--color-muted)]">{currentLesson.content || 'Lesson content will be displayed here.'}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handlePrevLesson} disabled={!currentLessonId}>
                  Previous
                </Button>
                <Button onClick={handleNextLesson} disabled={!currentLessonId}>
                  Next Lesson
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-12 text-center">
              <BookOpen className="h-12 w-12 text-[var(--color-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Select a lesson</h3>
              <p className="text-[var(--color-muted)] mt-1">Choose a lesson from the sidebar to begin learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
