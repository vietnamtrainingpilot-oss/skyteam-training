import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight, CheckCircle, Star, Users, Plane, Shield, Globe, BookOpen, Award } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Department, departments } from '../lib/constants'

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
                letterSpacing: '0.02em'
              }}
            >
              PTFS Virtual Airline Alliance — Training Platform
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--color-fg)] leading-[1.08] tracking-tight"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}
            >
              Professional Aviation
              <br />
              <span className="text-[var(--color-primary)]">Training & Certification</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              Master flight operations, cabin service, and ground handling through
              structured training programs backed by industry experts.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-3.5 justify-center"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-base transition-all shadow-lg hover:-translate-y-0.5 btn-pill btn-pill-primary"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Continue Training
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/signup"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-base transition-all shadow-lg hover:-translate-y-0.5"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', fontWeight: 500, fontFamily: 'var(--font-body)' }}
                  >
                    Start Your Training
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/handbooks"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-base transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-fg)', border: '1px solid var(--color-border)', fontWeight: 500, fontFamily: 'var(--font-body)' }}
                  >
                    Browse Study Guides
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Departments ── */}
      <section className="py-16 md:py-24 bg-[var(--color-surface)] border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-fg)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Training Departments
            </h2>
            <p className="mt-3 text-[var(--color-muted)] text-lg leading-relaxed">
              Choose your career path and begin your journey toward professional certification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
            {departments.map((dept, i) => {
              const Icon = dept.icon
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <DepartmentCard dept={dept} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features (asymmetric layout, not 3 equal cards) ── */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: headline + description */}
            <div>
              <h2
                className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-fg)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Built for serious trainees
              </h2>
              <p className="mt-4 text-[var(--color-muted)] text-lg leading-relaxed max-w-md">
                Every module is designed around real-world scenarios. Practice until certification feels routine.
              </p>
            </div>

            {/* Right: feature list (no cards, clean vertical rhythm) */}
            <div className="space-y-6">
              {[
                {
                  icon: BookOpen,
                  title: 'Structured Learning',
                  description: 'Comprehensive modules designed by industry professionals for each department.'
                },
                {
                  icon: Award,
                  title: 'Certification Ready',
                  description: 'Prepare for written exams and practical evaluations with real PTC content.'
                },
                {
                  icon: Users,
                  title: 'Trainer Support',
                  description: 'Connect with qualified trainers for guidance throughout your journey.'
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-fg)] text-base">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats (clean, no icons) ── */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: '3', label: 'Departments' },
              { value: '2', label: 'Assessment Stages' },
              { value: '24+', label: 'Study Sections' },
              { value: '100%', label: 'Certification Ready' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p
                  className="text-3xl md:text-4xl font-semibold tracking-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-fg)' }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div
              className="max-w-3xl mx-auto text-center p-10 md:p-14 rounded-2xl"
              style={{
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-2xl)'
              }}
            >
              <h2
                className="text-2xl md:text-3xl font-semibold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Start Your Training Today
              </h2>
              <p className="mt-3 text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
                Join SkyTeam Training and begin your journey toward professional aviation certification.
              </p>
              <Link
                to="/auth/signup"
                className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function DepartmentCard({ dept }: { dept: { id: Department; name: string; icon: React.ElementType; color: string; description: string } }) {
  const { isAuthenticated } = useAuth()
  const Icon = dept.icon

  return (
    <Link
      to={isAuthenticated ? '/handbooks' : '/auth/signup'}
      className="group card p-6 block transition-all hover:shadow-md"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3
        className="text-base font-semibold text-[var(--color-fg)] tracking-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {dept.name}
      </h3>
      <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
        {dept.description}
      </p>
      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium" style={{ color: dept.color }}>
        <span>Explore program</span>
        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
