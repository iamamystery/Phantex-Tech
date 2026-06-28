'use client'

import { useEffect, useState } from 'react'
import type { TocEntry } from '@/content/types'

// Sticky table of contents with active-section highlighting driven by an
// IntersectionObserver. Clicking an entry smooth-scrolls to the heading (the
// browser handles smooth scroll via `scroll-behavior: smooth` on <html>).
export default function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (entries.length === 0) return
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((o) => o.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: [0, 1] }
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
        On this page
      </p>
      <ul className="space-y-1 border-l" style={{ borderColor: '#EDEAE4' }}>
        {entries.map((entry) => {
          const active = entry.id === activeId
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="-ml-px block border-l-2 py-1.5 font-body text-[13px] leading-snug transition-colors duration-150"
                style={{
                  paddingLeft: entry.level === 3 ? '1.5rem' : '0.85rem',
                  borderColor: active ? '#F59E0B' : 'transparent',
                  color: active ? '#B45309' : '#777777',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {entry.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
