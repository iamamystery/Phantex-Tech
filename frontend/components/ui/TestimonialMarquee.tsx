'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Rotating headline words ────────────────────────────────────── */
const WORDS = ['speak', 'scale', 'deliver', 'convert', 'compound']

/* ─── Isolated rotating word — only THIS re-renders on each tick ─── */
function RotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="relative inline-block text-amber-400" style={{ verticalAlign: 'bottom' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[index]}
          className="inline-block"
          style={{ willChange: 'opacity, transform' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ─── Data ──────────────────────────────────────────────────────── */

const FEATURED = {
  name: 'Aryan Mehra',
  role: 'Co-founder & CTO',
  company: 'Liveflow — Revenue Analytics SaaS',
  quote:
    'We were manually pulling data from 12 platforms into spreadsheets every Monday morning. Phantex replaced that entire workflow with a single automated pipeline. Six hours back, every week, per analyst.',
  metric: '6+ hrs saved · per analyst · per week',
  initial: 'A',
}

const SECONDARIES = [
  {
    name: 'Nadia Osei',
    role: 'Head of Operations',
    company: 'Series A Fintech',
    quote:
      "Our data refresh cycle went from 24 hours to 15 minutes. We didn't realise how much time we were losing until it was gone.",
    metric: '96× faster refresh',
    initial: 'N',
  },
  {
    name: 'Tom Bergqvist',
    role: 'Founder',
    company: 'B2B SaaS',
    quote:
      'They built our entire Supabase backend in three weeks — clean schema, solid RLS policies, full API docs on delivery. No back-and-forth.',
    metric: null,
    initial: 'T',
  },
  {
    name: 'Priya Nair',
    role: 'Product Lead',
    company: 'E-commerce Platform',
    quote:
      'The scraper handles 50k+ SKUs daily. Zero failures in four months. That kind of reliability is genuinely hard to find.',
    metric: '50k+ SKUs/day · 0 failures',
    initial: 'P',
  },
  {
    name: 'Kieran Walsh',
    role: 'CTO',
    company: 'Proptech Startup',
    quote:
      'Clean code, proper docs, no scope creep. It felt like working with a senior engineer who was already part of the team.',
    metric: null,
    initial: 'K',
  },
  {
    name: 'Mei-Lin Zhao',
    role: 'Data Lead',
    company: 'Logistics SaaS',
    quote:
      'Our pipeline went from an 8-hour overnight job to under 2 hours. That unlocked same-day reporting for our entire ops team.',
    metric: '4× faster pipeline',
    initial: 'M',
  },
  {
    name: 'Rafael Santos',
    role: 'CEO',
    company: 'Marketplace Startup',
    quote:
      'They automated our lead enrichment flow end to end. 80% less manual work, same output quality, none of the overhead.',
    metric: '80% less manual work',
    initial: 'R',
  },
]

const STATS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '40h+', label: 'Avg. Hours Saved / Month' },
  { value: '4.9', label: 'Average Rating' },
]

/* ─── Avatar initial bubble ─────────────────────────────────────── */
function Avatar({ initial, dark = false }: { initial: string; dark?: boolean }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0"
      style={
        dark
          ? { background: 'rgba(245,193,24,0.15)', color: '#F5C518' }
          : { background: '#F5F0E8', color: '#0C0C0C' }
      }
    >
      {initial}
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function TestimonialMarquee() {
  return (
    <section className="w-full py-28 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-amber-500 font-bold block mb-4">
            Client Standout
          </span>
          <h2 className="font-display font-black text-[var(--text-primary)] text-[clamp(36px,4.5vw,56px)] leading-[1.05] tracking-tight mb-4">
            {'The results '}<RotatingWord />{'.'}
          </h2>
          <p className="font-body text-[var(--text-muted)] text-base leading-relaxed max-w-md">
            Across 50+ projects, one pattern holds — when the system works, teams get their time back.
          </p>
        </motion.div>

        {/* ── Featured card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
          className="mb-6"
        >
          <div
            className="relative w-full rounded-[2rem] overflow-hidden p-10 md:p-14"
            style={{ background: '#0C0C0C' }}
          >
            {/* Subtle amber glow bottom-right */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '-60px',
                right: '-60px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,193,24,0.08) 0%, transparent 70%)',
              }}
            />

            {/* Decorative quote mark */}
            <span
              className="absolute top-8 right-12 font-display font-black leading-none pointer-events-none select-none"
              style={{ fontSize: '120px', color: 'rgba(255,255,255,0.04)' }}
            >
              "
            </span>

            {/* Quote */}
            <blockquote
              className="font-display font-semibold text-white leading-[1.45] tracking-[-0.01em] mb-10 relative z-10"
              style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', maxWidth: '780px' }}
            >
              "{FEATURED.quote}"
            </blockquote>

            {/* Divider */}
            <div className="w-full h-px mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Author + metric */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <Avatar initial={FEATURED.initial} dark />
                <div>
                  <p className="font-display font-bold text-white text-sm">{FEATURED.name}</p>
                  <p className="font-body text-stone-400 text-xs mt-0.5">{FEATURED.role}</p>
                  <p className="font-mono text-stone-500 text-[10px] uppercase tracking-widest mt-0.5">{FEATURED.company}</p>
                </div>
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start sm:self-auto"
                style={{ background: 'rgba(245,193,24,0.12)', border: '1px solid rgba(245,193,24,0.25)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="font-mono text-amber-400 text-[11px] font-bold tracking-wide">{FEATURED.metric}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Secondary grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {SECONDARIES.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.07 }}
            >
              <div
                className="h-full p-7 rounded-2xl border transition-all duration-300 group"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#EDEAE4',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(245,193,24,0.45)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = '#EDEAE4'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}
              >
                <blockquote className="font-body text-[14px] text-stone-600 leading-[1.72] mb-6 font-medium">
                  "{t.quote}"
                </blockquote>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar initial={t.initial} />
                    <div>
                      <p className="font-display font-bold text-stone-900 text-[13px]">{t.name}</p>
                      <p className="font-body text-stone-400 text-[11px] mt-0.5">{t.role} · {t.company}</p>
                    </div>
                  </div>
                  {t.metric && (
                    <span
                      className="flex-shrink-0 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ background: '#FEF9EC', color: '#B45309', border: '1px solid #FDE68A' }}
                    >
                      {t.metric}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{ border: '1px solid #EDEAE4' }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-8 px-4 text-center"
              style={{
                borderRight: i < STATS.length - 1 ? '1px solid #EDEAE4' : 'none',
                background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8',
              }}
            >
              <span className="font-display font-black text-[var(--text-primary)] text-[clamp(26px,3vw,36px)] leading-none tracking-tight mb-1.5">
                {s.value}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
