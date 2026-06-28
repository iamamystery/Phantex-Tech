'use client'

import { useEffect, useState } from 'react'

// Sticky top reading-progress bar. Tracks scroll position over the document and
// fills an amber bar from 0–100%. Respects reduced motion implicitly (it's a
// width transition, not an animation loop).
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      const pct = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full origin-left transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%`, background: '#F59E0B' }}
      />
    </div>
  )
}
