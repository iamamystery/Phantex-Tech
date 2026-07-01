'use client'

import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Triggers the homepage's entrance animations as soon as it mounts. There is no
// intro/splash — the page renders immediately and its sections animate in on
// load (and on scroll). Returns `false` for the first paint so Framer holds the
// `initial` state, then `true` right after mount to play the reveal.
// ─────────────────────────────────────────────────────────────────────────────

export function useEntranceGate(): boolean {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setStarted(true)
  }, [])

  return started
}
