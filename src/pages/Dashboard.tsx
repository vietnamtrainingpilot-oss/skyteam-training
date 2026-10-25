import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, FileText, TrendingUp, Award, ArrowRight, CheckCircle, Plane, Users, Shield, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCourses } from '../hooks/useCourses'
import { useAssessments } from '../hooks/useAssessments'
import { DepartmentBadge } from '../components/features/DepartmentBadge'
import { ProgressBar } from '../components/features/ProgressBar'
import { departmentInfo } from '../lib/constants'

export function Dashboard() {
  const { user } = useAuth()
  const { courses, isLoading: coursesLoading } = useCourses()
  const { assessments: allAssessments } = useAssessments(user?.department)

  if (!user) return null

  const deptCourses = courses.filter((c: any) => c.department === user.department)
  const inProgressCourses = deptCourses.filter((c: any) => c.status === 'in-progress')
  const completedCourses = deptCourses.filter((c: any) => c.status === 'completed')
  const avgProgress = deptCourses.length > 0
    ? Math.round(deptCourses.reduce((acc: number, c: any) => acc + c.progress, 0) / deptCourses.length)
    : 0

  const deptAssessments = allAssessments.filter((a: any) => a.department === user.department)
  const writtenExams = deptAssessments.filter((a: any) => a.type === 'written')
  const deptInfoObj = departmentInfo[user.department as keyof typeof departmentInfo]
  const DeptIcon = deptInfoObj?.icon || Plane

  return (
    <div className="space-y-8">
      {/* ── Welcome Card ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative overflow-hidden rounded-2xl p-7 border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Decorative shapes */}
          <div
            className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10"
            style={{ backgroundColor: deptInfoObj?.color || 'var(--color-primary)' }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-8"
            style={{ backgroundColor: deptInfoObj?.color || 'var(--color-primary)' }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-[var(--color-fg)] shadow-lg"
              style={{ backgroundColor: deptInfoObj?.color || 'var(--color-primary)' }}
            >
              <DeptIcon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: 'var(--color-fg)', fontFamily: 'var(--font-display)' }}
                >
                  Welcome back, {user.name.split(' ')[0]}
                </h1>
                <DepartmentBadge department={user.department} />
              </div>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {inProgressCourses.length > 0
                  ? `You have ${inProgressCourses.length} course${inProgressCourses.length > 1 ? 's' : ''} in progress. Keep pushing toward your certification.`
                  : 'Ready to continue your training journey?'}
              </p>
            </div>
            <Link
              to="/handbooks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:-translate-y-0.5"
              style={{
                backgroundColor: deptInfoObj?.color || 'var(--color-primary)',
                color: 'var(--color-fg)',
                boxShadow: `0 4px 14px ${deptInfoObj?.color || 'var(--color-primary)'}30`
              }}
            >
              Continue Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'In Progress', value: inProgressCourses.length, icon: BookOpen, color: deptInfoObj?.color || 'var(--color-primary)' },
          { label: 'Completed', value: completedCourses.length, icon: Award, color: 'var(--color-success)' },
          { label: 'Written Exams', value: writtenExams.length, icon: FileText, color: 'var(--color-warning)' },
          { label: 'Overall Progress', value: `${avgProgress}%`, icon: TrendingUp, color: deptInfoObj?.color || 'var(--color-primary)' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-xl p-4 border h-full"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{stat.label}</p>
                  <p
                    className="text-2xl font-semibold mt-0.5 tracking-tight"
                    style={{ color: 'var(--color-fg)', fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { to: '/stage-testing', label: 'Stage Testing', desc: 'Complete written exams and practical evaluations', icon: FileText },
            { to: '/handbooks', label: 'Study Handbooks', desc: 'Access training materials and reference guides', icon: BookOpen },
            { to: '/training-information', label: 'Training Info', desc: 'View criteria and manage evaluation requests', icon: CheckCircle }
          ].map((action, i) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md bg-[var(--color-surface)]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${deptInfoObj?.color || 'var(--color-primary)'}12` }}
              >
                <action.icon className="h-5 w-5" style={{ color: deptInfoObj?.color || 'var(--color-primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                  {action.label}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{action.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--color-meta)] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Continue Learning ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--color-fg)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Continue Learning</h2>
          <Link to="/handbooks" className="text-sm font-medium text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-xl border animate-pulse bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }} />
            ))}
          </div>
        ) : deptCourses.length === 0 ? (
          <div
            className="rounded-xl p-10 text-center border bg-[var(--color-surface)]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${deptInfoObj?.color || 'var(--color-primary)'}15` }}
            >
              <BookOpen className="h-6 w-6" style={{ color: deptInfoObj?.color || 'var(--color-primary)' }} />
            </div>
            <h3 className="font-semibold text-[var(--color-fg)] text-base">No courses yet</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">Check the handbooks to begin your training.</p>
            <Link to="/handbooks" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline">
              Browse Handbooks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {deptCourses.map((course: any, i: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to="/handbooks" className="block group">
                  <div
                    className="rounded-xl p-5 border h-full transition-all hover:shadow-md bg-[var(--color-surface)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <DepartmentBadge department={course.department} />
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${course.status === 'completed' ? 'var(--color-success)' : `${deptInfoObj?.color || 'var(--color-primary)'}`}15`,
                          color: course.status === 'completed' ? 'var(--color-success)' : deptInfoObj?.color || 'var(--color-primary)'
                        }}
                      >
                        {course.progress}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="mt-4">
                      <ProgressBar value={course.progress} showPercentage={false} />
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{course.modules?.length || 0} modules</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
