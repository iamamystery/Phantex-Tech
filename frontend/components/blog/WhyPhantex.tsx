'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useInView } from 'framer-motion'
import FadeIn from '@/components/ui/FadeIn'
import { staggerDelay } from '@/lib/motion'

// ─────────────────────────────────────────────────────────────────────────────
// "Why Companies Choose Phantex" — the final trust-building section before the
// closing CTA. Black card with amber glow + engineering grid, four trust
// pillars in a 2x2 grid, a stats row with counters that animate into view, and
// two CTAs (booking flow + work page). Reuses FadeIn and framer-motion already
// in the project — no new dependencies.
// ─────────────────────────────────────────────────────────────────────────────

const Arrow = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

const PILLARS = [
  {
    title: 'Production-Ready Engineering',
    description: 'We build maintainable, scalable software designed for real users — not prototypes.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.2-.26 2.34-.73 3.37-.86 1.88-2.46 3.34-4.42 4.03A9.7 9.7 0 0112 20a9.7 9.7 0 01-3.85-.6c-1.96-.69-3.56-2.15-4.42-4.03A8.96 8.96 0 013 12V6.75c0-.41.25-.78.63-.93L12 2.25l8.37 3.57c.38.15.63.52.63.93V12z" />
    ),
  },
  {
    title: 'AI & Automation Experts',
    description: 'From AI agents to browser automation and intelligent workflows, we build systems that save time and scale operations.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2.25M15 3v2.25M9 18.75V21M15 18.75V21M3 9h2.25M3 15h2.25M18.75 9H21M18.75 15H21M6.75 6.75h10.5v10.5H6.75zM9.75 9.75h4.5v4.5h-4.5z" />
    ),
  },
  {
    title: 'End-to-End Product Development',
    description: 'From MVPs to production deployments, we handle architecture, backend, frontend, APIs, databases, and integrations.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75l8.25 4.5L12 12.75 3.75 8.25 12 3.75zM3.75 12l8.25 4.5L20.25 12M3.75 15.75l8.25 4.5 8.25-4.5" />
    ),
  },
  {
    title: 'Long-Term Technical Partnership',
    description: "We don't just deliver projects — we become a trusted engineering partner as your business grows.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 003.74-.92m-3.74.92a3 3 0 01-3.74-2.91v-.81a3 3 0 015.94-.66M18 18.72V15a6 6 0 00-9-5.2M3 19.24a9.09 9.09 0 013.74-.92m0 0a3 3 0 01.66-5.94M6.74 18.32A6 6 0 0112 6.5m-2.62 1.13A3 3 0 119.38 3.5" />
    ),
  },
]

interface Stat {
  target?: number
  suffix?: string
  text?: string
  label: string
}

const STATS: Stat[] = [
  { target: 50, suffix: '+', label: 'Projects Delivered' },
  { target: 120, suffix: '+', label: 'Engineering Articles' },
  { target: 100, suffix: 'K+', label: 'Records Processed Daily' },
  { text: 'AI', label: 'Automation Specialists' },
]

function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (stat.target === undefined || !inView) return

    // Respect reduced-motion: jump straight to the final value.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(stat.target)
      return
    }

    let raf = 0
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setValue(Math.round(stat.target! * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, stat.target])

  const display = stat.text ?? `${value}${stat.suffix ?? ''}`
  const finalLabel = stat.text ?? `${stat.target}${stat.suffix ?? ''}`

  return (
    <span
      ref={ref}
      className="block font-display font-black leading-none tracking-tight text-white"
      style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}
      aria-label={finalLabel}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  )
}

export default function WhyPhantex() {
  return (
    <section className="pb-14" aria-labelledby="why-phantex-heading">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div
            className="relative overflow-hidden"
            style={{ background: '#0C0C0C', borderRadius: '2rem', padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.75rem, 5vw, 3.5rem)' }}
          >
            {/* Amber glow */}
            <div
              className="pointer-events-none absolute"
              style={{ top: '-100px', right: '-80px', width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 65%)' }}
            />
            {/* Engineering grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '52px 52px' }}
            />

            <div className="relative z-10">
              {/* Heading */}
              <div className="mx-auto max-w-2xl text-center">
                <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">
                  Why Phantex
                </span>
                <h2 id="why-phantex-heading" className="font-display font-black leading-[1.0] tracking-tight text-white" style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>
                  Why Companies Choose Phantex
                </h2>
                <p className="mx-auto mt-4 font-body leading-relaxed" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.52)', maxWidth: '640px' }}>
                  We partner with startups and growing businesses to build AI systems, automation platforms, scalable SaaS products, and backend infrastructure designed for production from day one.
                </p>
              </div>

              {/* Trust pillars — 2x2 */}
              <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                {PILLARS.map((pillar, i) => (
                  <FadeIn key={pillar.title} delay={staggerDelay(i)}>
                    <div
                      className="group flex h-full items-start gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-amber-400 transition-colors duration-300 group-hover:text-amber-300"
                        style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.20)' }}
                        aria-hidden="true"
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          {pillar.icon}
                        </svg>
                      </span>
                      <div>
                        <h3 className="font-display text-[15px] font-bold text-white">{pillar.title}</h3>
                        <p className="mt-1.5 font-body text-[13px] leading-relaxed text-stone-400">{pillar.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Stats row */}
              <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-y-6 md:grid-cols-4">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="px-4 text-center md:px-2"
                    style={{ borderLeft: i % 2 === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <StatCounter stat={stat} />
                    <span className="mt-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors duration-200 hover:bg-amber-500 sm:w-auto"
                  style={{ background: '#F59E0B' }}
                >
                  Book a Strategy Call
                  <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/work"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-300 transition-colors duration-200 hover:border-amber-400/50 hover:text-white sm:w-auto"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                >
                  Explore Our Work
                  <Arrow className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
