'use client'

import Link from 'next/link'
import type { ChatAction } from '@/lib/ai/types'

// ─────────────────────────────────────────────────────────────────────────────
// Renders the navigation buttons attached to a structured AI reply (see
// lib/ai/types.ts). Styling mirrors the existing FAQ / quick-prompt buttons in
// ChatExperience.tsx — same border, radius, amber hover treatment, and chevron
// icon — so these read as part of the same chat surface rather than a new
// pattern. Uses next/link for client-side navigation. Renders nothing when
// there are no actions, so callers never need to branch on this themselves.
// ─────────────────────────────────────────────────────────────────────────────

export default function ActionButtons({ actions }: { actions?: ChatAction[] }) {
  if (!actions || actions.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.url}
          href={action.url}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-[#E7E5E4] bg-white px-4 py-2 font-body text-[13px] font-semibold text-[#0F0F0F] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/80 hover:bg-amber-50/60 hover:shadow-md hover:shadow-amber-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
        >
          {action.label}
          <svg
            className="h-3 w-3 flex-shrink-0 text-amber-500 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  )
}
