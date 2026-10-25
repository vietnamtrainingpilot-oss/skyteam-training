import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Play, CheckCircle, Circle } from 'lucide-react'
import { useCourse } from '../hooks/useCourses'
import { departmentInfo } from '../lib/constants'

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
        <div className="h-8 w-32 bg-[var(--color-surface)] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-[var(--color-surface)] rounded-xl animate-pulse" />)}
          </div>
          <div className="lg:col-span-2"><div className="h-64 bg-[var(--color-surface)] rounded-xl animate-pulse" /></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="rounded-xl p-12 text-center border bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-[var(--color-muted)]">Course not found</p>
        <Link to="/courses" className="mt-4 inline-flex text-[var(--color-primary)] hover:underline text-sm font-medium">
          Back to courses
        </Link>
      </div>
    )
  }

  const meta = departmentInfo[course.department as keyof typeof departmentInfo]
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
        <ArrowLeft className="h-4 w-4" /> Back to course
      </Link>

      {/* Lesson header */}
      {currentLesson && (
        <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <span>{currentModule?.title}</span>
          <span>/</span>
          <span className="text-[var(--color-fg)] font-medium">{currentLesson.title}</span>
          {currentLesson.type === 'video' && (
            <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: meta?.color || 'var(--color-primary)' }}>
              <Play className="h-3 w-3" /> Video
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h2
            className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] px-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Course Content
          </h2>
          {course.modules.map((module: any) => (
            <div
              key={module.id}
              className="rounded-xl border overflow-hidden bg-[var(--color-surface)]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => setActiveModuleId(module.id === activeModuleId ? null : module.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15`, color: meta?.color || 'var(--color-primary)' }}
                  >
                    {course.modules.indexOf(module) + 1}
                  </span>
                  <span className="font-medium text-sm text-[var(--color-fg)]">{module.title}</span>
                </div>
                <span className="text-xs text-[var(--color-muted)]">{module.lessons.length}</span>
              </button>
              {activeModuleId === module.id && (
                <div className="border-t" style={{ borderColor: 'var(--color-border-soft)' }}>
                  {module.lessons.map((lesson: any) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(module.id, lesson.id)}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-[var(--color-surface-hover)] transition-colors ${
                        currentLessonId === lesson.id ? 'bg-[var(--color-primary-light)]' : ''
                      }`}
                    >
                      {currentLessonId === lesson.id ? (
                        <CheckCircle className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--color-meta)] shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${currentLessonId === lesson.id ? 'font-medium text-[var(--color-fg)]' : 'text-[var(--color-fg-secondary)]'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">{lesson.duration}</p>
                      </div>
                      {lesson.type === 'video' && <Play className="h-3 w-3 text-[var(--color-meta)] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="space-y-4">
              <div
                className="rounded-xl border overflow-hidden bg-[var(--color-surface)]"
                style={{ borderColor: 'var(--color-border)', minHeight: '300px' }}
              >
                <div className="p-6">
                  {currentLesson.type === 'video' ? (
                    <div className="aspect-video rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: `${meta?.color || 'var(--color-primary)'}15` }}
                        >
                          <Play className="h-8 w-8" style={{ color: meta?.color || 'var(--color-primary)' }} />
                        </div>
                        <p className="text-sm text-[var(--color-muted)]">Video player placeholder</p>
                      </div>
                    </div>
                  ) : currentLesson.type === 'quiz' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
                        <h3 className="text-lg font-semibold text-[var(--color-fg)]">{currentLesson.title}</h3>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">This quiz will test your understanding of the material.</p>
                      <Link to={`/assessments?course=${courseId}&module=${currentModule?.id}`}>
                        <button className="btn-pill btn-pill-primary text-sm">Start Quiz</button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-fg)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        {currentLesson.title}
                      </h3>
                      <div className="prose prose-sm max-w-none text-[var(--color-fg-secondary)] leading-relaxed">
                        {currentLesson.content || (
                          <p className="text-[var(--color-muted)] italic">Lesson content will be displayed here.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevLesson}
                  disabled={!currentLessonId}
                  className="btn-pill btn-pill-secondary text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={!currentLessonId}
                  className="btn-pill btn-pill-primary text-sm disabled:opacity-40"
                >
                  Next Lesson
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl border p-12 text-center bg-[var(--color-surface)]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-[var(--color-meta)] opacity-30" />
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">Select a lesson</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">Choose a lesson from the sidebar to begin learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
