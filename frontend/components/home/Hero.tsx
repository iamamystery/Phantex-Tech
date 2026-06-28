'use client'

import Link from 'next/link'
import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useEntranceGate } from '@/lib/useEntranceGate'
import EngineeringCore from '@/components/home/EngineeringCore'

const EASE = [0.22, 1, 0.36, 1] as const

// Faint floating particles — deterministic positions (no hydration drift)
const PARTICLES = [
  { left: '14%', top: '30%', size: 3, delay: 0, dur: 16 },
  { left: '26%', top: '68%', size: 2, delay: 4, dur: 19 },
  { left: '42%', top: '22%', size: 2, delay: 7, dur: 17 },
  { left: '58%', top: '74%', size: 3, delay: 2, dur: 21 },
  { left: '72%', top: '34%', size: 2, delay: 5, dur: 18 },
  { left: '84%', top: '62%', size: 2, delay: 1, dur: 20 },
  { left: '90%', top: '40%', size: 2, delay: 8, dur: 16 },
  { left: '34%', top: '50%', size: 2, delay: 6, dur: 22 },
] as const

const FUTURE = 'FUTURE'

export default function Hero() {
  const started = useEntranceGate()
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // ── Mouse parallax for the ambient glow ──
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 })
  const glowX = useTransform(sx, [-0.5, 0.5], reduced ? [0, 0] : [-26, 26])
  const glowY = useTransform(sy, [-0.5, 0.5], reduced ? [0, 0] : [-20, 20])
  const gridX = useTransform(sx, [-0.5, 0.5], reduced ? [0, 0] : [10, -10])
  const gridY = useTransform(sy, [-0.5, 0.5], reduced ? [0, 0] : [8, -8])

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  // ── Shared reveal (fade + lift, gated on the intro completing) ──
  const reveal = (delay: number, y = 24) => ({
    initial: { opacity: 0, y: reduced ? 0 : y },
    animate: started ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : y },
    transition: { duration: reduced ? 0.2 : 0.7, delay: reduced ? 0 : delay, ease: EASE },
  })

  const Word = ({ children, delay }: { children: string; delay: number }) => (
    <motion.span className="inline-block" {...reveal(delay, 28)}>
      {children}
    </motion.span>
  )

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* ───────────────── Living background ───────────────── */}

      {/* Faint engineering grid (mouse parallax, masked to fade at edges) */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          x: gridX,
          y: gridY,
          backgroundImage:
            'linear-gradient(rgba(15,15,15,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,15,15,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 78% 60% at 50% 44%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 78% 60% at 50% 44%, black 0%, transparent 80%)',
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      {/* Amber radial glow behind the headline (parallax + slow drift) */}
      <motion.div
        className={reduced ? 'pointer-events-none absolute' : 'pointer-events-none absolute animate-aurora'}
        style={{
          x: glowX,
          y: glowY,
          top: '50%',
          left: '50%',
          width: 880,
          height: 660,
          marginLeft: -440,
          marginTop: -360,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.025) 42%, transparent 70%)',
          filter: 'blur(55px)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Secondary warm fill — bottom, for depth */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: '-12%', left: '50%', width: 700, height: 460, marginLeft: -350,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(234,88,12,0.025) 0%, transparent 70%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: p.left, top: p.top,
                width: `${p.size}px`, height: `${p.size}px`,
                animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Background noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Bottom fade into the next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      {/* ───────────────── Content ───────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center">

        {/* Engineering core — the visual focal point */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
          animate={started ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
          transition={{ duration: reduced ? 0.2 : 1.1, delay: 0, ease: EASE }}
          className="mb-12 sm:mb-14"
        >
          <EngineeringCore />
        </motion.div>

        {/* Headline — word by word */}
        <h1 className="mx-auto max-w-[820px] font-display font-bold uppercase leading-[1.04] tracking-[-0.02em] text-[var(--text-primary)] text-[clamp(38px,6.4vw,84px)]">
          <span className="block">
            <Word delay={0.35}>WE</Word> <Word delay={0.45}>ENGINEER</Word>
          </span>
          <span className="block">
            <Word delay={0.55}>THE</Word>{' '}
            <motion.span className="relative inline-block" {...reveal(0.65, 28)}>
              <span className="animate-gradient-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                {FUTURE}
              </span>
              {/* Gradient shine sweep across FUTURE */}
              {!reduced && started && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.95) 50%, transparent 58%)',
                    backgroundSize: '250% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                  initial={{ backgroundPosition: '150% 0%' }}
                  animate={{ backgroundPosition: '-150% 0%' }}
                  transition={{ duration: 1.0, delay: 1.3, ease: 'easeInOut' }}
                >
                  {FUTURE}
                </motion.span>
              )}
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          {...reveal(0.85)}
          className="mx-auto mt-8 max-w-[600px] font-body text-[19px] leading-relaxed text-[var(--text-muted)] md:text-[20px]"
        >
          Building AI systems, backend infrastructure, automation, and intelligent
          software for ambitious companies.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...reveal(1.0)}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/contact"
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--text-primary)] px-8 py-4 font-body font-medium text-white shadow-lg shadow-stone-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-900/20 sm:w-auto"
          >
            <span className="relative z-10">Book a Strategy Call</span>
            <svg className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
            {/* Sheen sweep on hover */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" aria-hidden="true" />
          </Link>

          <Link
            href="/work"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white/50 px-8 py-4 font-body font-medium text-[var(--text-primary)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-amber-50/40 hover:text-amber-600 hover:shadow-lg hover:shadow-amber-500/10 sm:w-auto"
          >
            Explore Our Work
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <Link
            href="/chat"
            aria-label="Talk to AI"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-8 py-4 font-body font-medium text-[var(--text-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/50 hover:text-amber-600 hover:shadow-lg hover:shadow-amber-500/10 sm:w-auto"
          >
            <svg className="h-4 w-4 text-amber-500 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-[18deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
            Talk to AI
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
