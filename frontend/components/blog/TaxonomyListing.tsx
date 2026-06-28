import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import ArticleCard from './ArticleCard'
import type { ArticleSummary } from '@/content/types'

// Shared layout for category / tag / author landing pages. Renders an eyebrow
// label, title, optional description, a "back to blog" link, and the article
// grid — with a graceful empty state so a valid-but-unused taxonomy never 404s.
export default function TaxonomyListing({
  eyebrow,
  title,
  description,
  articles,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  articles: ArticleSummary[]
  children?: React.ReactNode
}) {
  return (
    <main className="pt-32 pb-24" style={{ background: '#FAFAF8' }}>
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-12">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:text-amber-600"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Blog
          </Link>
          <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">
            {eyebrow}
          </span>
          <h1 className="font-display font-black tracking-tight text-[#111111]" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl font-body leading-relaxed text-stone-500" style={{ fontSize: '17px' }}>
              {description}
            </p>
          )}
          {children}
          <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-400">
            {articles.length} article{articles.length === 1 ? '' : 's'}
          </p>
        </FadeIn>

        {articles.length === 0 ? (
          <div className="rounded-2xl px-6 py-20 text-center" style={{ border: '1px dashed #E0DCD4' }}>
            <p className="font-body text-stone-500" style={{ fontSize: '16px' }}>
              No articles here yet — check back soon.
            </p>
            <Link href="/blog" className="mt-4 inline-block font-mono text-[11px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-600">
              Browse all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
