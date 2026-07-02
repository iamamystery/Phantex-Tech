/**
 * Shared motion constants — the site's house easing curve was previously
 * hand-typed as `[0.22, 1, 0.36, 1]` in Hero.tsx, ServicesSnap.tsx,
 * ChatExperience.tsx and globals.css independently. Single source of truth
 * so every entrance/hover animation stays in sync.
 */

/** Framer Motion cubic-bezier tuple — snappy start, long smooth decel. */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const

/** Same curve as a CSS string, for inline `style.transition` / keyframes. */
export const EASE_PREMIUM_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const DURATION = {
  fast: 0.2,
  base: 0.3,
  medium: 0.45,
  slow: 0.6,
} as const

/** Default per-item entrance stagger step, in seconds. */
export const STAGGER_STEP = 0.08

/** Ceiling so long lists don't accumulate multi-second trailing delays. */
export const STAGGER_MAX_DELAY = 0.4

/**
 * Capped stagger delay for list/grid entrance animations. Without a cap,
 * a 20-item grid at a 0.08s step reaches a 1.6s delay on the last item.
 */
export function staggerDelay(index: number, step: number = STAGGER_STEP, max: number = STAGGER_MAX_DELAY): number {
  return Math.min(index * step, max)
}
