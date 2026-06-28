'use client'

import { useRef, useState, useEffect, useEffect as ReactUseEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MagicCard } from '@/components/magicui/magic-card'
import { HowWeWorkSettings, WorkProcessStep } from '@/types'

/* ─── Defaults ────────────────────────────────────────────────── */
const DEFAULT_SETTINGS: HowWeWorkSettings = {
  id: 0,
  section_label: "Phantex Precision Framework",
  title_line_1: "HOW WE",
  title_line_2_highlight: "WORK",
  description: "Four phases. Zero guesswork. From brief to production — a structured system that ships fast and scales clean."
}

const DEFAULT_STEPS: WorkProcessStep[] = [
  {
    id: 1,
    phase_number: '01',
    phase_label: 'Phase One',
    title: 'Clarity Before Code',
    description: 'We map your product, constraints, and goals before writing a single line. No assumptions.',
    bullets: ['Stakeholder brief & goals', 'Technical & data audit', 'Competitor landscape', 'Scope definition'],
    deliverable: 'Signed project brief + architecture decision record',
    duration: '2–3 Days',
    tags: ['Requirements Audit', 'Scope Definition', 'Technical Audit'],
    theme_color: '#F5F0E8',
    order: 0
  },
  {
    id: 2,
    phase_number: '02',
    phase_label: 'Phase Two',
    title: 'The System, Designed',
    description: 'We architect the full technical stack — infrastructure, data flow, and delivery milestones.',
    bullets: ['Tech stack selection', 'API & data architecture', 'Sprint planning', 'Risk & edge-case mapping'],
    deliverable: 'Technical blueprint + project timeline',
    duration: '3–5 Days',
    tags: ['Tech Stack', 'API Architecture', 'Sprint Planning'],
    theme_color: '#ECEEF2',
    order: 1
  },
  {
    id: 3,
    phase_number: '03',
    phase_label: 'Phase Three',
    title: 'Code That Scales',
    description: 'Focused sprints, clean commits, zero shortcuts. We build exactly what was scoped — fast.',
    bullets: ['Agile two-week sprints', 'Daily async Loom updates', 'CI/CD pipeline from day one', 'Peer-reviewed code throughout'],
    deliverable: 'Tested, deployed codebase on your infrastructure',
    duration: '1–6 Weeks',
    tags: ['Agile Sprints', 'CI/CD', 'Code Review', 'Daily Updates'],
    theme_color: '#E8E2D8',
    order: 2
  },
  {
    id: 4,
    phase_number: '04',
    phase_label: 'Phase Four',
    title: 'Ship It. Own It.',
    description: 'We handle deployment, monitoring setup, and a structured handover so your team fully owns it.',
    bullets: ['Production deploy & smoke tests', 'Monitoring & alert setup', 'Full technical documentation', '30-day post-launch support'],
    deliverable: 'Live product + complete technical handover',
    duration: '1–2 Days',
    tags: ['Production Deploy', 'Monitoring', 'Documentation', '30-Day Support'],
    theme_color: '#F5C518',
    order: 3
  },
]

/* ─── Phase dots ─────────────────────────────────────────────── */
function PhaseDots({ lit, total, accent }: { lit: number, total: number, accent: string }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          animate={{
            backgroundColor: i < lit ? accent : 'rgba(12,12,12,0.12)',
            boxShadow: i < lit ? `0 0 8px ${accent}88` : 'none',
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

/* ─── Single process card ────────────────────────────────────── */
function ProcessCard({
  step,
  total,
  active,
  state, // "active", "above", "below"
}: {
  step: WorkProcessStep
  total: number
  active: boolean
  state: "active" | "above" | "below"
}) {
  const litCount = parseInt(step.phase_number)
  const [mounted, setMounted] = useState(false)
  
  ReactUseEffect(() => {
    setMounted(true)
  }, [])

  // Ultra-smooth, elegant 3D deck transitions to match isolated snapped scroll glide
  const variants = {
    active: { rotateX: 0, y: 0, z: 0, scale: 1, opacity: 1, zIndex: 10, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    above:  { rotateX: 12, y: -40, z: 30, scale: 0.94, opacity: 0, zIndex: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    below:  { rotateX: -22, y: 70, z: -80, scale: 0.88, opacity: 0, zIndex: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div
      className="absolute inset-x-2 inset-y-0 preserve-3d"
      initial="below"
      animate={state}
      variants={variants}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
    >
      <MagicCard
        className="w-full h-full rounded-[2.5rem] border-transparent"
        gradientColor="rgba(255,255,255,0.4)"
        style={{ '--color-background': step.theme_color } as React.CSSProperties}
      >
        {/* Solid Background Layer to override transparent glass with cloth texture */}
        <div 
          className="absolute inset-0 -z-20 rounded-[inherit]" 
          style={{
            backgroundColor: step.theme_color,
            backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />

        {/* Inner edge highlight / Business card rim light */}
        <div className="absolute inset-0 rounded-[inherit] border border-black/5 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.15)] pointer-events-none -z-10" />

        {/* Ghost number */}
        <span
          className="absolute pointer-events-none select-none font-black leading-none"
          style={{
            right: '-14px',
            bottom: '-20px',
            fontSize: '180px',
            color: 'rgba(0,0,0,0.04)',
            fontFamily: 'system-ui',
            letterSpacing: '-4px',
          }}
        >
          {step.phase_number}
        </span>

        {/* Phase dots */}
        <div className="absolute top-8 right-10">
          <PhaseDots lit={litCount} total={total} accent="rgba(0,0,0,0.7)" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full p-10 md:p-14 flex flex-col">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-7">
            <span
              className="font-mono text-xs tracking-widest px-3 py-1 rounded-full font-bold"
              style={{
                color: 'rgba(0,0,0,0.7)',
                background: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.6)',
              }}
            >
              {step.phase_number}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-stone-600 font-medium">
              {step.phase_label}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-display font-black leading-[1] tracking-tight text-stone-900 mb-5"
            style={{ fontSize: 'clamp(38px, 5vw, 58px)' }}
          >
            {step.title}
          </h3>

          {/* Desc */}
          <p className="font-body text-[14px] leading-[1.7] max-w-[460px] mb-6 text-stone-600 font-medium">
            {step.description}
          </p>

          {/* Bullets */}
          {step.bullets && step.bullets.length > 0 && (
            <ul className="flex flex-col gap-2 mb-6 flex-1">
              {step.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-[13px] text-stone-700 font-medium">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Divider */}
          <div className="w-full h-px mb-5" style={{ background: 'rgba(0,0,0,0.07)' }} />

          {/* Deliverable + Duration */}
          <div className="flex items-start justify-between gap-4 mb-5">
            {step.deliverable && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block mb-1">You get</span>
                <span className="font-body text-[13px] text-stone-700 font-semibold leading-snug">{step.deliverable}</span>
              </div>
            )}
            {step.duration && (
              <div className="flex-shrink-0 text-right">
                <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Duration</span>
                <span
                  className="font-mono text-[12px] font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.07)', color: 'rgba(0,0,0,0.7)' }}
                >
                  {step.duration}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom amber accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[2.5rem] z-50 pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.65, ease: [0.34, 1.2, 0.64, 1], delay: active ? 0.1 : 0 }}
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.6), transparent)',
            transformOrigin: 'left',
          }}
        />
      </MagicCard>
    </motion.div>
  )
}

/* ─── Section ─────────────────────────────────────────────────── */
export default function HowWeWork({ 
  settings: initialSettings, 
  steps: initialSteps 
}: { 
  settings?: HowWeWorkSettings | null
  steps?: WorkProcessStep[] 
}) {
  const settings = initialSettings || DEFAULT_SETTINGS
  const steps = (initialSteps && initialSteps.length > 0) ? initialSteps : DEFAULT_STEPS
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayStep, setDisplayStep] = useState(0)
  const [trackPct, setTrackPct] = useState(0)

  /* useScroll targets the outer container */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth continuous track height based on raw native scroll progress, smoothed by the hijack interceptor
  const smoothTrackHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  /* Drive step from raw window scroll progress */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {

      // Determine active card, add slight buffer zones so transitions aren't hyper-sensitive
      const stepInterval = 1 / steps.length;
      const next = Math.min(Math.floor(v / stepInterval), steps.length - 1);
      if (next !== displayStep) {
        setDisplayStep(next)
      }
    })
    return unsub
  }, [scrollYProgress, displayStep, steps.length])

  /* ─── NEW: Exact One-Scroll-One-Card Wheel Hijacker ─── */
  useEffect(() => {
    let isAnimating = false;
    let wheelAccumulator = 0;
    
    // Non-passive wheel listener for exact control over momentum
    const handleWheel = (e: WheelEvent) => {
      const el = containerRef.current;
      if (!el) return;
      
      const windowScrollY = window.scrollY;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const vh = window.innerHeight;
      
      // Ignore if completely outside section bounds
      if (windowScrollY < elTop - 5 || windowScrollY > elBottom - vh + 5) {
        return;
      }
      
      const currentStep = Math.round((windowScrollY - elTop) / vh);

      // Release native scroll at top edge (scrolling up)
      if (currentStep === 0 && e.deltaY < 0) return;

      // Exit section only when EXACTLY at the last snapped card position (not just approaching it).
      // Math.round maps a wide range to step N-1, so we guard with a tight pixel tolerance.
      const lastCardScrollY = elTop + (steps.length - 1) * vh;
      const isSettledAtLastCard = Math.abs(windowScrollY - lastCardScrollY) < 30;
      if (isSettledAtLastCard && e.deltaY > 0 && !isAnimating) {
        e.preventDefault();
        isAnimating = true;
        window.scrollTo({ top: elTop + el.offsetHeight, behavior: 'smooth' });
        setTimeout(() => { isAnimating = false; wheelAccumulator = 0; }, 1200);
        return;
      }

      // Inside section — hijack scroll
      e.preventDefault();

      if (isAnimating) return;

      wheelAccumulator += e.deltaY;

      if (Math.abs(wheelAccumulator) > 50) {
        const direction = wheelAccumulator > 0 ? 1 : -1;
        wheelAccumulator = 0;

        const nextStep = Math.min(Math.max(currentStep + direction, 0), steps.length - 1);

        if (nextStep !== currentStep) {
          isAnimating = true;
          window.scrollTo({ top: elTop + (nextStep * vh), behavior: 'smooth' });
          setTimeout(() => { isAnimating = false; }, 1200);
        }
      }
    };
    
    // passive: false is absolutely critical to allow e.preventDefault()
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [steps.length]);

  const currentAccent = steps[displayStep]?.theme_color || '#F5C518'

  /* Click nav item → exact 100vh jump interval to match wheel interceptor */
  function jumpToStep(i: number) {
    const el = containerRef.current
    if (!el) return
    const top = el.offsetTop + (i * window.innerHeight)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(steps.length + 1) * 100}vh` }} id="how-we-work">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-[#FAF7F0]">

        {/* Floating amber dots */}
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              background: '#F5C518',
              opacity: 0.08 + (i % 5) * 0.04,
            }}
            animate={{
              y: [0, i % 2 === 0 ? -26 : -18, 0],
              x: [0, i % 3 === 0 ? 12 : -10, 0],
            }}
            transition={{
              duration: 8 + (i % 5) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: -(i * 1.3),
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(12,12,12,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(12,12,12,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Inner layout */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-14 grid grid-cols-1 md:grid-cols-[330px_1fr] gap-10 md:gap-20 items-center">

          {/* ── LEFT PANEL ──────────────────────────── */}
          <div>
            {/* Label */}
            <div
              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
              style={{ color: '#F5C518' }}
            >
              <span className="w-6 h-[2px] bg-current" />
              {settings.section_label}
            </div>

            {/* Title */}
            <h2
              className="font-display font-black leading-[0.92] tracking-wide text-stone-900 mb-5"
              style={{ fontSize: 'clamp(44px, 5.5vw, 68px)' }}
            >
              {settings.title_line_1}<br />
              <em className="not-italic transition-colors duration-500" style={{ color: currentAccent }}>{settings.title_line_2_highlight}</em>
            </h2>

            <p className="font-body text-[15px] leading-[1.7] text-stone-500 max-w-[280px] mb-10">
              {settings.description}
            </p>

            {/* Step nav */}
            <nav className="relative flex flex-col" aria-label="Process steps">
              {/* Track bg */}
              <div
                className="absolute rounded-full"
                style={{
                  left: 17,
                  top: 24,
                  bottom: 24,
                  width: 3,
                  background: 'rgba(12,12,12,0.06)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                }}
              />
              {/* Track fill */}
              <motion.div
                className="absolute rounded-full"
                style={{ 
                  left: 17, 
                  top: 24, 
                  width: 3, 
                  height: smoothTrackHeight,
                  background: currentAccent,
                  zIndex: 1 
                }}
                animate={{ 
                  background: currentAccent,
                  boxShadow: `0 0 12px ${currentAccent}66, inset 0 0 4px rgba(255,255,255,0.5)`
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />

              {steps.map((s, i) => {
                const isActive = i === displayStep
                const isDone = i < displayStep
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpToStep(i)}
                    className="flex items-center gap-4 py-3.5 relative text-left focus:outline-none group"
                  >
                    <motion.div
                      className="flex items-center justify-center rounded-full flex-shrink-0 relative z-10 overflow-hidden"
                      animate={{
                        borderColor: isActive || isDone ? currentAccent : 'rgba(12,12,12,0.14)',
                        boxShadow: isActive ? `0 0 0 5px ${currentAccent}22` : 'none',
                        scale: isActive ? 1.12 : 1,
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        border: '2px solid',
                        backgroundColor: '#FAF7F0', // Always solid to block the track line behind it
                      }}
                      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      {/* Inner Tint Overlay */}
                      <motion.div 
                        className="absolute inset-0"
                        animate={{
                          background: isActive
                            ? currentAccent
                            : isDone
                            ? `${currentAccent}16` // slight tint for past steps
                            : 'transparent',
                        }}
                        transition={{ duration: 0.35 }}
                      />
                      <span
                        className="font-mono text-[11px] relative z-10"
                        style={{
                          color: isActive ? '#0C0C0C' : isDone ? currentAccent : '#9B928A',
                        }}
                      >
                        {s.phase_number}
                      </span>
                    </motion.div>

                    <motion.span
                      className="text-[14px] font-display font-bold tracking-[0.5px]"
                      animate={{ color: isActive ? '#0C0C0C' : isDone ? '#444' : '#9B928A' }}
                    >
                      {s.title}
                    </motion.span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* ── RIGHT PANEL: GSAP-style 3D card stack ────────── */}
          <div
            className="relative"
            style={{ height: 520, perspective: '1500px', perspectiveOrigin: '50% 50%' }}
          >
            {/* Render all cards at once absolute positioned, exactly like GSAP */}
            {steps.map((step, i) => {
              const state = i === displayStep ? "active" : i < displayStep ? "above" : "below"
              return (
                <ProcessCard
                  key={step.id}
                  step={step}
                  total={steps.length}
                  active={i === displayStep}
                  state={state}
                />
              )
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          animate={{
            opacity: displayStep > 0 ? 0 : 0.45,
            y: [0, 7, 0],
          }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
            Scroll
          </span>
          <div
            className="w-px h-9"
            style={{ background: 'linear-gradient(to bottom, transparent, #0C0C0C)' }}
          />
        </motion.div>
      </div>
    </div>
  )
}
