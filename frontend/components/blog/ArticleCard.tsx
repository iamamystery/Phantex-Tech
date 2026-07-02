import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import type { ArticleSummary } from '@/content/types'
import { staggerDelay } from '@/lib/motion'

// ─────────────────────────────────────────────────────────────────────────────
// Redesigned article card — no image, no gradient header, no empty coloured box.
// A clean, typography-led engineering-publication card in the style of Vercel /
// GitHub Engineering: category, date, reading time, title, excerpt, author,
// optional views + featured badge, and a "Read article →" affordance.
// ─────────────────────────────────────────────────────────────────────────────

interface ArticleCardProps {
  article: ArticleSummary
  index?: number
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const { categoryProfile, authorProfile } = article

  return (
    <FadeIn delay={staggerDelay(index, 0.05, 0.3)} className="h-full">
      <Link
        href={`/blog/${article.slug}`}
        className="group flex h-full flex-col rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
        style={{ border: '1px solid #EDEAE4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        {/* Meta row: category badge + optional featured pill */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em]"
            style={{
              background: `${categoryProfile.accent}14`,
              color: categoryProfile.accent,
              border: `1px solid ${categoryProfile.accent}33`,
            }}
          >
            {categoryProfile.name}
          </span>
          {article.featured && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-amber-600">
              Featured
            </span>
          )}
        </div>

        {/* Date · reading time */}
        <div className="mb-3 flex items-center gap-2">
          <time
            dateTime={article.date}
            className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400"
          >
            {article.formattedDate}
          </time>
          <span className="text-stone-200" aria-hidden="true">·</span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">
            {article.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 font-display text-[19px] font-black leading-snug text-[#111111] transition-colors duration-200 line-clamp-2 group-hover:text-amber-600">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-5 flex-grow font-body text-sm leading-relaxed text-stone-500 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Footer: author + read affordance */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-display text-[10px] font-black text-amber-700"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}
              aria-hidden="true"
            >
              {authorProfile.initials}
            </span>
            <span className="font-body text-xs font-semibold text-[#111111]">
              {authorProfile.name}
            </span>
          </div>
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Read
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>
    </FadeIn>
  )
}
