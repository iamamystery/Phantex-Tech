import Link from 'next/link'
import type { ResolvedArticle } from '@/content/types'

// Previous / next article navigation. Either side may be absent (first/last
// article), in which case that half collapses cleanly rather than rendering a
// broken link.
export default function ArticleNav({
  previous,
  next,
}: {
  previous: ResolvedArticle | null
  next: ResolvedArticle | null
}) {
  if (!previous && !next) return null

  return (
    <nav aria-label="Article navigation" className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="group flex flex-col rounded-2xl bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
          style={{ border: '1px solid #EDEAE4' }}
        >
          <span className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Previous
          </span>
          <span className="font-display text-[15px] font-bold leading-snug text-[#111111] line-clamp-2 group-hover:text-amber-600">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col rounded-2xl bg-white p-5 text-right transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
          style={{ border: '1px solid #EDEAE4' }}
        >
          <span className="mb-2 flex items-center justify-end gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
          <span className="font-display text-[15px] font-bold leading-snug text-[#111111] line-clamp-2 group-hover:text-amber-600">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}
