'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const STATS = [
  { value: '98%', label: 'Client Satisfaction', sub: 'Across 50+ projects delivered' },
  { value: '24h', label: 'Response Time', sub: 'Project scoping within 48 hours' },
  { value: '3+', label: 'Scrapers Running', sub: 'Live production jobs right now' },
] as const

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)]">

      {/* ── Premium ambient background ── */}
      {/* Large warm gradient orb — top center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      {/* Secondary cool-toned orb — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-5%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      {/* Tertiary warm orb — right side */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          right: '-8%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,88,12,0.04) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center pt-32 pb-20">



        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="font-display text-[56px] md:text-[72px] lg:text-[84px] leading-[1.02] font-extrabold text-[var(--text-primary)] mb-6 tracking-[-0.02em]"
        >
          We build what
          <br />
          <span className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
            powers you
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="font-body text-lg text-[var(--text-muted)] leading-relaxed mb-12 max-w-lg mx-auto"
        >
          Web scraping, browser automation, and AI pipelines for SaaS
          startups that need to scale fast without breaking things.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 bg-[var(--text-primary)] text-white font-body font-medium px-8 py-4 rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-lg shadow-stone-900/10"
          >
            View Our Work
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-stone-200 bg-white/50 backdrop-blur-sm text-[var(--text-primary)] font-body font-medium px-8 py-4 rounded-xl hover:border-amber-500/40 hover:text-amber-600 hover:bg-amber-50/30 transition-all duration-200"
          >
            Get a Quote →
          </Link>
        </motion.div>

        {/* ── Glass stat cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group glass-effect p-6 text-left hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="title font-display text-3xl font-bold mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="icon font-body text-[11px] font-semibold uppercase tracking-widest mb-1.5">
                {stat.label}
              </div>
              <div className="font-body text-xs text-[var(--text-muted)] leading-relaxed">
                {stat.sub}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
