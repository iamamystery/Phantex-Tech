'use client'

import { useReducedMotion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// The hero's visual focal point — an original animated "engineering core":
// a softly glowing amber sphere, thin orbiting rings carrying connection nodes,
// a flowing energy ring, a soft radial glow beneath, and faint particles.
//
// Purely decorative (aria-hidden). Continuous motion is GPU CSS (slow rotation /
// pulse / dash-flow) and fully stilled under prefers-reduced-motion, leaving a
// calm static emblem. Entrance is handled by the parent via Framer Motion.
// ─────────────────────────────────────────────────────────────────────────────

const CORE_PARTICLES = [
  { left: '8%', top: '24%', size: 3, delay: 0, dur: 9 },
  { left: '88%', top: '32%', size: 2, delay: 2.5, dur: 11 },
  { left: '18%', top: '78%', size: 2, delay: 1.2, dur: 10 },
  { left: '82%', top: '72%', size: 3, delay: 3.5, dur: 12 },
  { left: '50%', top: '6%', size: 2, delay: 4, dur: 10 },
] as const

export default function EngineeringCore() {
  const reduced = useReducedMotion()
  const c = (cls: string) => (reduced ? '' : cls)

  return (
    <div
      className="relative mx-auto h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]"
      aria-hidden="true"
    >
      {/* Soft radial glow beneath the core */}
      <div
        className={`${c('core-glow-pulse')} absolute inset-[-22%]`}
        style={{
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245,158,11,0.26) 0%, rgba(245,158,11,0.07) 46%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />

      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="coreSphere" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="42%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
          <radialGradient id="coreHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.55)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </radialGradient>
        </defs>

        {/* Flowing energy ring (dashed, drifting) */}
        <circle
          cx="160" cy="160" r="74"
          fill="none"
          stroke="rgba(245,158,11,0.45)"
          strokeWidth="1"
          strokeDasharray="1.5 9"
          strokeLinecap="round"
          className={c('core-flow')}
        />

        {/* Orbiting ring 1 — wide, shallow */}
        <g className={c('core-spin')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <ellipse cx="160" cy="160" rx="146" ry="50" fill="none" stroke="rgba(245,158,11,0.32)" strokeWidth="1" />
          <circle cx="306" cy="160" r="3" fill="#F59E0B" />
          <circle cx="14" cy="160" r="2.5" fill="rgba(245,158,11,0.7)" />
        </g>

        {/* Orbiting ring 2 — upright circle, reverse */}
        <g className={c('core-spin-rev')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="160" cy="160" r="108" fill="none" stroke="rgba(245,158,11,0.22)" strokeWidth="1" />
          <circle cx="160" cy="52" r="3" fill="#F59E0B" />
          <circle cx="160" cy="268" r="2.5" fill="rgba(245,158,11,0.6)" />
        </g>

        {/* Orbiting ring 3 — tilted, slow */}
        <g className={c('core-spin-slow')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <g transform="rotate(58 160 160)">
            <ellipse cx="160" cy="160" rx="140" ry="84" fill="none" stroke="rgba(245,158,11,0.18)" strokeWidth="1" />
            <circle cx="300" cy="160" r="2.5" fill="rgba(245,158,11,0.7)" />
            <circle cx="20" cy="160" r="2" fill="rgba(245,158,11,0.55)" />
          </g>
        </g>

        {/* Glowing sphere */}
        <g className={c('core-sphere-pulse')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="160" cy="160" r="46" fill="url(#coreHalo)" />
          <circle cx="160" cy="160" r="27" fill="url(#coreSphere)" />
          <circle cx="151" cy="150" r="8" fill="#FFFFFF" opacity="0.45" />
        </g>
      </svg>

      {/* Faint floating particles around the core */}
      {!reduced && (
        <div className="absolute inset-0">
          {CORE_PARTICLES.map((p, i) => (
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
    </div>
  )
}
