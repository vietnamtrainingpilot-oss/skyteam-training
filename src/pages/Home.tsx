import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight, CheckCircle, Star, Users, Plane, Shield, Globe, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Department, departments } from '../lib/constants'

export function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36">
        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Grid pattern overlay */}
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
              className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[var(--color-fg)] leading-[1.05] tracking-tight"
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

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-14 flex items-center justify-center gap-x-8 gap-y-3 flex-wrap text-sm text-[var(--color-muted)]"
            >
              {[
                { label: 'Structured curriculum', icon: CheckCircle },
                { label: 'Expert trainers', icon: Users },
                { label: 'Certification ready', icon: Star }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-[var(--color-success)]" />
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Departments ── */}
      <section className="py-20 md:py-28 bg-[var(--color-surface)] border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-fg)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Training Departments
            </h2>
            <p className="mt-3 text-[var(--color-muted)] text-lg max-w-xl mx-auto leading-relaxed">
              Choose your career path and begin your journey toward professional certification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {departments.filter(d => d.id !== 'SHARED_CORE').map((dept, i) => {
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

      {/* ── Stats Row ── */}
      <section className="py-16 border-y" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: '3', label: 'Departments', icon: Plane, color: 'var(--color-primary)' },
              { value: '2', label: 'Assessment Stages', icon: TrendingUp, color: 'var(--color-success)' },
              { value: '24+', label: 'Study Sections', icon: BookIcon },
              { value: '100%', label: 'Certification Ready', icon: CheckCircle, color: 'var(--color-warning)' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <stat.icon className="h-6 w-6 mx-auto text-[var(--color-muted)]" style={stat.color ? { color: stat.color } : undefined} />
                <p
                  className="text-3xl font-semibold tracking-tight"
                  style={{ color: stat.color || 'var(--color-fg)', fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 md:py-28 bg-[var(--color-surface)]" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: CheckCircle,
                title: 'Structured Learning',
                description: 'Comprehensive modules designed by industry professionals for each department, from fundamentals to advanced operations.',
                color: 'var(--color-primary)'
              },
              {
                icon: Star,
                title: 'Certification Ready',
                description: 'Prepare for both written exams and practical evaluations with practice materials and real PTC assessment content.',
                color: 'var(--color-warning)'
              },
              {
                icon: Users,
                title: 'Trainer Support',
                description: 'Connect with qualified trainers for guidance and feedback throughout your training journey to certification.',
                color: 'var(--color-success)'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="card p-6"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}18`, color: feature.color }}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3
                  className="text-base font-semibold text-[var(--color-fg)] tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="py-20 md:py-24 relative overflow-hidden">
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(135deg, white 0%, transparent 60%)'
            }}
          />
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-white/10" />

          <div className="container relative text-center">
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-fg)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Start Your Training Today
            </h2>
            <p className="mt-4 text-[var(--color-fg)]/75 text-lg max-w-xl mx-auto leading-relaxed">
              Join SkyTeam Training and begin your journey toward professional aviation certification.
            </p>
            <Link
              to="/auth/signup"
              className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all shadow-xl hover:-translate-y-0.5 btn-pill"
              style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
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

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mx-auto text-[var(--color-muted)]">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}
