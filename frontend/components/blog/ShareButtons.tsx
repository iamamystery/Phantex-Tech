'use client'

import { useState } from 'react'

// Share buttons + copy-link. X/LinkedIn open share intents in a new tab; the
// copy button uses the clipboard API with a confirmed state. No external SDKs.
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      ),
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V24h-5V8z" />
      ),
    },
  ]

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
        Share
      </span>
      {targets.map((t) => (
        <a
          key={t.name}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${t.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
          style={{ border: '1px solid #EDEAE4' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {t.icon}
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="flex h-9 items-center gap-1.5 rounded-lg px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:bg-stone-100 hover:text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
        style={{ border: '1px solid #EDEAE4' }}
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  )
}
