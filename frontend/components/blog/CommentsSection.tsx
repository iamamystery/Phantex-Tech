'use client'

import { useState } from 'react'

// Comments section structure. Authentication is not yet wired, so the composer
// prompts the reader to sign in and the submit path is intentionally gated. The
// markup, state, and accessibility are production-shaped so that connecting an
// auth provider later is a drop-in change rather than a rebuild.
export default function CommentsSection({ articleSlug }: { articleSlug: string }) {
  const [draft, setDraft] = useState('')
  // When auth lands, this becomes the real session user.
  const isAuthenticated = false

  return (
    <section aria-labelledby="comments-heading" className="mt-16 pt-12" style={{ borderTop: '1px solid #EDEAE4' }}>
      <div className="mb-8 flex items-center justify-between">
        <h2 id="comments-heading" className="font-display text-2xl font-black text-[#111111]">
          Discussion
        </h2>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
          0 comments
        </span>
      </div>

      {/* Composer */}
      <div className="rounded-2xl bg-white p-5" style={{ border: '1px solid #EDEAE4' }}>
        <label htmlFor={`comment-${articleSlug}`} className="sr-only">
          Write a comment
        </label>
        <textarea
          id={`comment-${articleSlug}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!isAuthenticated}
          rows={3}
          placeholder={isAuthenticated ? 'Share your thoughts…' : 'Sign in to join the discussion.'}
          className="w-full resize-none rounded-xl bg-[#F7F6F4] p-3 font-body text-sm text-[#111111] outline-none transition-colors focus:ring-2 focus:ring-amber-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ border: '1px solid #EDEAE4' }}
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
            Be respectful. Comments are moderated.
          </p>
          {isAuthenticated ? (
            <button
              type="button"
              disabled={!draft.trim()}
              className="rounded-lg px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500 disabled:opacity-50"
              style={{ background: '#F59E0B' }}
            >
              Post comment
            </button>
          ) : (
            <a
              href="/contact"
              className="rounded-lg px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500"
              style={{ background: '#F59E0B' }}
            >
              Sign in to comment
            </a>
          )}
        </div>
      </div>

      {/* Empty state */}
      <div className="mt-8 rounded-2xl px-6 py-12 text-center" style={{ border: '1px dashed #E0DCD4' }}>
        <p className="font-body text-sm text-stone-500">
          No comments yet — be the first to start the conversation.
        </p>
      </div>
    </section>
  )
}
