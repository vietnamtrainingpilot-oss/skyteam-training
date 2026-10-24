import { Link } from 'react-router-dom'
import { Plane, Users, Shield, Award, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Department } from '../lib/constants'
import { MotionCard, MotionFade } from '../components/ui'

const departments: { id: Department; name: string; icon: React.ElementType; color: string; description: string; courseCount: number }[] = [
  {
    id: 'FLIGHT_DECK',
    name: 'Flight Deck',
    icon: Plane,
    color: '#0066cc',
    description: 'Master flight operations, navigation, and aircraft handling procedures.',
    courseCount: 8
  },
  {
    id: 'CABIN_CREW',
    name: 'Cabin Crew',
    icon: Users,
    color: '#30a46c',
    description: 'Learn passenger service, safety protocols, and in-flight procedures.',
    courseCount: 5
  },
  {
    id: 'GROUND_CREW',
    name: 'Ground Crew',
    icon: Shield,
    color: '#d4a843',
    description: 'Master airport operations, vehicle handling, and ground procedures.',
    courseCount: 5
  },
  {
    id: 'SHARED_CORE',
    name: 'Shared Core',
    icon: Award,
    color: '#7c3aed',
    description: 'Essential training applicable across all departments.',
    courseCount: 3
  }
]

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-bg)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-transparent" />
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)] rounded-full opacity-10 blur-3xl"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--color-cabin-crew)] rounded-full opacity-5 blur-3xl"
            style={{ animation: 'float 8s ease-in-out infinite reverse' }}
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <MotionFade delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-medium">
                <Plane className="h-4 w-4" />
                PTFS Virtual Airline Alliance
              </div>
            </MotionFade>
            <MotionFade delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-fg)]">
                Professional Aviation Training
              </h1>
            </MotionFade>
            <MotionFade delay={0.3}>
              <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
                SkyTeam Training provides comprehensive certification programs for Flight Deck, Cabin Crew, and Ground Crew operations.
              </p>
            </MotionFade>
            <MotionFade delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Continue Training
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/signup"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/courses"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-fg)] font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      Browse Courses
                    </Link>
                  </>
                )}
              </div>
            </MotionFade>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Training Departments</h2>
            <p className="mt-4 text-[var(--color-muted)] max-w-2xl mx-auto">
              Choose your training path and begin your journey toward certification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, i) => {
              const Icon = dept.icon
              return (
                <MotionCard key={dept.id} delay={0.1 + i * 0.08}>
                  <Link
                    to={isAuthenticated ? `/courses` : `/auth/signup`}
                    className="card bg-[var(--color-card-bg)] rounded-xl p-6 border border-[var(--color-card-border)] hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${dept.color}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: dept.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-fg)]">{dept.name}</h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{dept.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-[var(--color-muted)]">{dept.courseCount} courses</span>
                      <ArrowRight className="h-4 w-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                  </Link>
                </MotionCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Structured Learning',
                description: 'Comprehensive modules designed by industry professionals for each department.'
              },
              {
                icon: Award,
                title: 'Certification Ready',
                description: 'Prepare for both written exams and practical evaluations with practice materials.'
              },
              {
                icon: Users,
                title: 'Trainer Support',
                description: 'Connect with qualified trainers for guidance and feedback throughout your journey.'
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <MotionCard key={feature.title} delay={0.2 + i * 0.1}>
                  <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-[var(--color-bg-secondary)] transition-colors">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)]">
                      <Icon className="h-8 w-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-fg)]">{feature.title}</h3>
                    <p className="text-[var(--color-muted)]">{feature.description}</p>
                  </div>
                </MotionCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 md:py-24 bg-[var(--color-fg)] text-[var(--color-bg)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Start Your Training Today</h2>
            <p className="mt-4 text-[var(--color-muted-light)] max-w-xl mx-auto">
              Join SkyTeam Training and begin your journey toward aviation certification.
            </p>
            <Link
              to="/auth/signup"
              className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-[var(--color-fg)] font-medium hover:bg-[var(--color-separator)] transition-colors"
            >
              Create Account
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
