'use client'

import { useReducedMotion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// Layered ambient lighting for the homepage — the shared atmospheric system that
// replaces flat single-colour glows. Soft warm radials at several depths, a very
// faint engineering grid masked to fade at the edges, a subtle vignette, and a
// bottom fade that blends each section into the next. GPU-friendly; the slow
// aurora drift is disabled under prefers-reduced-motion. No particles.
//
//   variant="hero"    — full atmosphere (grid + vignette + drift)
//   variant="section" — quieter (one or two radials + faint grid)
// ─────────────────────────────────────────────────────────────────────────────

interface AmbientBackgroundProps {
  variant?: 'hero' | 'section'
  grid?: boolean
  className?: string
}

export default function AmbientBackground({
  variant = 'hero',
  grid = true,
  className = '',
}: AmbientBackgroundProps) {
  const reduced = useReducedMotion()
  const isHero = variant === 'hero'

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Primary warm key light — top center */}
      <div
        className={!reduced && isHero ? 'animate-aurora' : ''}
        style={{
          position: 'absolute',
          top: isHero ? '-14%' : '-30%',
          left: '50%',
          width: isHero ? 1100 : 900,
          height: isHero ? 820 : 560,
          marginLeft: isHero ? -550 : -450,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.04) 42%, transparent 70%)',
          filter: 'blur(50px)',
          willChange: 'transform',
        }}
      />

      {/* Warm fill light — right */}
      <div
        style={{
          position: 'absolute',
          top: isHero ? '28%' : '10%',
          right: '-8%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Warm rim light — bottom left (hero only) */}
      {isHero && (
        <div
          style={{
            position: 'absolute',
            bottom: '-8%',
            left: '-10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      )}

      {/* Faint engineering grid, masked to fade toward the edges */}
      {grid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(15,15,15,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,15,15,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: isHero
              ? 'radial-gradient(ellipse 78% 62% at 50% 34%, black 0%, transparent 78%)'
              : 'radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 82%)',
            WebkitMaskImage: isHero
              ? 'radial-gradient(ellipse 78% 62% at 50% 34%, black 0%, transparent 78%)'
              : 'radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 82%)',
            opacity: isHero ? 0.6 : 0.4,
          }}
        />
      )}

      {/* Subtle vignette for depth (hero only) */}
      {isHero && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 120% 100% at 50% 30%, transparent 55%, rgba(120,113,108,0.06) 100%)',
          }}
        />
      )}

      {/* Bottom fade into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  )
}
