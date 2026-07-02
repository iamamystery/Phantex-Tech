'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FadeIn from '@/components/ui/FadeIn'
import ArticleCard from '@/components/blog/ArticleCard'
import WhyPhantex from '@/components/blog/WhyPhantex'
import type { ArticleSummary, BlogCategory } from '@/content/types'
import { staggerDelay } from '@/lib/motion'

// ─── Prop shapes (slim DTOs kept out of the article bodies) ────────────────────

export interface TagChip {
  slug: string
  name: string
  count: number
}
export interface AuthorChip {
  slug: string
  name: string
  initials: string
  role: string
  expertise: string
  bio: string
  tech: string[]
  articleCount: number
}
export interface CaseStudyChip {
  slug: string
  client: string
  tag: string
  category: string
  metric: string
  metricLabel: string
  summary: string
}
export interface ResourceChip {
  slug: string
  title: string
  description: string
  pages: number
  format: string
}

interface BlogPageContentProps {
  articles: ArticleSummary[]
  featured: ArticleSummary
  trending: ArticleSummary[]
  mostRead: ArticleSummary[]
  editorsPicks: ArticleSummary[]
  categories: BlogCategory[]
  tags: TagChip[]
  authors: AuthorChip[]
  caseStudies: CaseStudyChip[]
  resources: ResourceChip[]
}

const Arrow = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

export default function BlogPageContent({
  articles,
  featured,
  trending,
  mostRead,
  editorsPicks,
  categories,
  tags,
  authors,
  caseStudies,
  resources,
}: BlogPageContentProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let list = articles
    if (activeCategory !== 'All') {
      list = list.filter((a) => a.category === activeCategory)
    }
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.categoryProfile.name.toLowerCase().includes(q) ||
          a.authorProfile.name.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [articles, activeCategory, searchQuery])

  const isFiltered = searchQuery.trim() !== '' || activeCategory !== 'All'

  const metrics = [
    { value: `${articles.length}`, label: 'Articles' },
    { value: `${categories.length}`, label: 'Categories' },
    { value: '50+', label: 'Projects' },
    { value: 'Weekly', label: 'Updated' },
  ]

  return (
    <main style={{ background: '#FAFAF8' }}>
      {/* ════════ HERO ════════ */}
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <span className="mb-6 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">
              Engineering Publication
            </span>
            <h1 className="mb-8 font-display font-black leading-[0.92] tracking-tight text-[#111111]" style={{ fontSize: 'clamp(46px, 7vw, 96px)' }}>
              Insights, systems, and<br />engineering lessons<br />that scale.
            </h1>
            <div className="mb-8" style={{ width: '56px', height: '3px', background: '#F59E0B' }} />
            <p className="mb-10 font-body leading-relaxed" style={{ fontSize: '18px', color: '#555555', maxWidth: '540px' }}>
              Explore practical knowledge on AI systems, automation, backend engineering, data infrastructure, and modern product development.
            </p>
            <div className="mb-14 flex flex-wrap items-center gap-4">
              <a href="#articles" className="group inline-flex items-center gap-3 rounded-xl px-7 py-3.5 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500" style={{ background: '#F59E0B' }}>
                Browse Articles
                <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#777777] transition-colors hover:text-amber-500">
                Book a Call <Arrow className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 overflow-hidden md:grid-cols-4" style={{ border: '1px solid #EDEAE4', borderRadius: '16px' }}>
              {metrics.map(({ value, label }, i) => (
                <div key={label} className="flex flex-col items-center justify-center px-4 py-6 text-center" style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8', borderRight: i < 3 ? '1px solid #EDEAE4' : 'none' }}>
                  <span className="mb-1.5 font-display font-black leading-none tracking-tight text-[#111111]" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}>{value}</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ SEARCH ════════ */}
      <section className="pb-14">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="flex items-center gap-3" style={{ background: '#FFFFFF', border: '1px solid #EDEAE4', borderRadius: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: '0 1.25rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="2" className="flex-shrink-0" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search articles by title, category, author, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
                className="flex-grow bg-transparent px-2 py-4 font-body text-[15px] text-[#111111] outline-none placeholder:text-stone-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="flex-shrink-0 rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:bg-stone-100">
                  Clear
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ FEATURED ════════ */}
      {!isFiltered && (
        <section className="pb-14">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <Link href={`/blog/${featured.slug}`} className="group relative block overflow-hidden" style={{ background: '#0C0C0C', borderRadius: '2rem' }}>
                <div className="pointer-events-none absolute" style={{ top: '-80px', right: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 65%)' }} />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: 'inset 0 0 0 1.5px rgba(245,158,11,0.4)' }} />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_360px]">
                  <div className="p-10 md:p-14 lg:p-16">
                    <div className="mb-8 flex items-center gap-3">
                      <span className="rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em]" style={{ background: 'rgba(245,158,11,0.12)', color: '#F5C518', border: '1px solid rgba(245,158,11,0.25)' }}>
                        {featured.categoryProfile.name}
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">Featured</span>
                    </div>
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">{featured.authorProfile.name}</p>
                    <h2 className="mb-6 font-display font-black leading-[0.98] tracking-tight text-white transition-colors duration-300 group-hover:text-amber-400" style={{ fontSize: 'clamp(28px, 3.6vw, 50px)' }}>
                      {featured.title}
                    </h2>
                    <p className="mb-8 font-body leading-relaxed text-stone-400" style={{ fontSize: '16px', maxWidth: '520px' }}>{featured.subtitle}</p>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-500">{featured.readingTime} min read</span>
                      <span className="text-stone-700" aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-stone-600">{featured.formattedDate}</span>
                    </div>
                  </div>
                  <div className="relative hidden items-center justify-center overflow-hidden lg:flex" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)', minHeight: '340px' }}>
                    <div className="relative z-10 w-full p-8">
                      <div className="mb-6 space-y-2.5">
                        {['Ingestion', 'Validation', 'Transform', 'Load', 'Analytics'].map((step, i) => (
                          <div key={step} className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: i === 0 ? '#F59E0B' : i < 3 ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.08)' }} />
                            <div className="flex h-8 flex-grow items-center rounded-lg px-3" style={{ background: i === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.025)', border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.04)'}` }}>
                              <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: i === 0 ? '#F59E0B' : 'rgba(255,255,255,0.2)' }}>{step}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ════════ TRENDING + MOST READ ════════ */}
      {!isFiltered && (
        <section className="pb-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
              <FadeIn>
                <div className="h-full" style={{ background: '#FFFFFF', border: '1px solid #EDEAE4', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '2rem' }}>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">Trending Now</span>
                      <h2 className="font-display text-[22px] font-black text-[#111111]">What people are reading</h2>
                    </div>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#F0EDE8' }}>
                    {trending.map((a, i) => (
                      <Link key={a.slug} href={`/blog/${a.slug}`} className="group flex items-center gap-5 py-4">
                        <span className="flex-shrink-0 font-display text-[28px] font-black leading-none" style={{ color: i === 0 ? '#F59E0B' : '#EDEAE4' }}>{String(i + 1).padStart(2, '0')}</span>
                        <div className="min-w-0 flex-grow">
                          <p className="mb-1 font-display text-[15px] font-bold leading-snug text-[#111111] transition-colors group-hover:text-amber-500 line-clamp-1">{a.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">{a.categoryProfile.name}</span>
                            <span className="text-stone-200" aria-hidden="true">·</span>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">{a.readingTime} min read</span>
                          </div>
                        </div>
                        <Arrow className="w-3 h-3 flex-shrink-0 text-stone-300 transition-colors group-hover:text-amber-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="flex h-full flex-col" style={{ background: '#0C0C0C', borderRadius: '20px', padding: '2rem' }}>
                  <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">Most Read</span>
                  <h2 className="mb-7 font-display text-[22px] font-black text-white">Top performing content</h2>
                  <div className="flex-grow space-y-5">
                    {mostRead.map((a, i) => (
                      <Link key={a.slug} href={`/blog/${a.slug}`} className="group flex items-start gap-4">
                        <span className="mt-0.5 flex-shrink-0 font-display text-[20px] font-black leading-none" style={{ color: i === 0 ? '#F59E0B' : 'rgba(255,255,255,0.07)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <p className="mb-1 font-display text-[14px] font-bold leading-snug text-white/80 transition-colors group-hover:text-amber-400 line-clamp-2">{a.title}</p>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-600">{a.readingTime} min read</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* ════════ CATEGORY FILTERS ════════ */}
      <section className="pb-10" id="articles">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="flex flex-wrap gap-2">
              {[{ slug: 'All', name: 'All' }, ...categories].map((cat) => {
                const active = activeCategory === cat.slug
                return (
                  <motion.button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    whileTap={{ scale: 0.96 }}
                    aria-pressed={active}
                    className="cursor-pointer rounded-full px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-200"
                    style={{
                      background: active ? '#F59E0B' : '#FFFFFF',
                      color: active ? '#111111' : '#777777',
                      border: active ? '1px solid #F59E0B' : '1px solid #EDEAE4',
                      boxShadow: active ? '0 4px 12px rgba(245,158,11,0.28)' : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    {cat.name}
                  </motion.button>
                )
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ ARTICLES GRID ════════ */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6">
          {filtered.length === 0 ? (
            <FadeIn>
              <div className="py-20 text-center">
                <p className="font-body text-stone-400" style={{ fontSize: '16px' }}>No articles found. Try a different search or category.</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All') }} className="mt-4 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-500 transition-colors hover:text-amber-600">
                  Clear filters
                </button>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <ArticleCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════ EDITOR'S PICKS ════════ */}
      {!isFiltered && editorsPicks.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn className="mb-10">
              <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">Curated</span>
              <h2 className="font-display font-black tracking-tight text-[#111111]" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Editor&apos;s Picks</h2>
              <p className="mt-2 font-body text-stone-500" style={{ fontSize: '15px' }}>Selected by the Phantex engineering team.</p>
            </FadeIn>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {editorsPicks.map((a, i) => (
                <FadeIn key={a.slug} delay={staggerDelay(i)}>
                  <Link href={`/blog/${a.slug}`} className="group relative flex h-full flex-col overflow-hidden" style={{ background: '#0C0C0C', borderRadius: '20px', padding: '2rem', minHeight: '260px' }}>
                    <div className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: 'inset 0 0 0 1.5px rgba(245,158,11,0.35)' }} />
                    <div className="relative z-10 flex flex-grow flex-col">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em]" style={{ background: 'rgba(245,158,11,0.12)', color: '#F5C518', border: '1px solid rgba(245,158,11,0.25)' }}>{a.categoryProfile.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-stone-700">{a.formattedDate}</span>
                      </div>
                      <h3 className="mb-4 font-display text-[22px] font-black leading-snug text-white transition-colors duration-300 group-hover:text-amber-400 line-clamp-3">{a.title}</h3>
                      <p className="flex-grow font-body text-[14px] leading-relaxed text-stone-500 line-clamp-3">{a.excerpt}</p>
                      <div className="mt-6 flex items-center justify-between pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-500">{a.readingTime} min read</span>
                        <Arrow className="w-4 h-4 text-stone-700 transition-colors group-hover:text-amber-500" />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ CLIENT CASE STUDIES ════════ */}
      {!isFiltered && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn className="mb-10">
              <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">Results</span>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display font-black tracking-tight text-[#111111]" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Client Results</h2>
                <Link href="/work" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#777777] transition-colors hover:text-amber-500">
                  View All Work <Arrow className="w-3 h-3" />
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {caseStudies.map((cs, i) => (
                <FadeIn key={cs.slug} delay={staggerDelay(i)}>
                  <Link href={`/blog/case-studies/${cs.slug}`} className="group block h-full transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]" style={{ background: '#FFFFFF', border: '1px solid #EDEAE4', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '2rem' }}>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em]" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.15)' }}>{cs.tag}</span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">{cs.category}</span>
                    </div>
                    <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#555555]">{cs.client}</p>
                    <div className="mb-4">
                      <span className="block font-display font-black leading-none tracking-tight text-[#111111]" style={{ fontSize: 'clamp(32px, 3vw, 44px)' }}>{cs.metric}</span>
                      <span className="font-body text-[14px] font-semibold text-stone-500">{cs.metricLabel}</span>
                    </div>
                    <p className="font-body text-[14px] leading-relaxed text-stone-500">{cs.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">Read case study <Arrow className="w-3 h-3" /></span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ FREE RESOURCES ════════ */}
      {!isFiltered && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn className="mb-10">
              <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">Free Resources</span>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display font-black tracking-tight text-[#111111]" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Free Engineering Resources</h2>
                <Link href="/resources" className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#777777] transition-colors hover:text-amber-500">
                  View All <Arrow className="w-3 h-3" />
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {resources.map((r, i) => (
                <FadeIn key={r.slug} delay={staggerDelay(i)}>
                  <Link href={`/resources/${r.slug}`} className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]" style={{ background: '#FFFFFF', border: '1px solid #EDEAE4', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '1.75rem' }}>
                    <div className="mb-5 flex items-center justify-center" style={{ width: '44px', height: '44px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px', color: '#F59E0B' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 className="mb-3 font-display text-[17px] font-black text-[#111111] group-hover:text-amber-600">{r.title}</h3>
                    <p className="mb-5 flex-grow font-body text-sm leading-relaxed text-stone-500">{r.description}</p>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">{r.pages} pages · {r.format}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 transition-all group-hover:gap-2.5">Open <Arrow className="w-3 h-3" /></span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ AUTHORS ════════ */}
      {!isFiltered && (
        <section className="relative overflow-hidden py-16" style={{ background: '#0A0A0A' }}>
          <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full" style={{ background: 'rgba(245,158,11,0.05)', filter: 'blur(120px)' }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn className="mb-10">
              <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">Authors</span>
              <h2 className="font-display font-black tracking-tight text-white" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Meet The Authors</h2>
            </FadeIn>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {authors.map((author, i) => (
                <FadeIn key={author.slug} delay={staggerDelay(i)}>
                  <Link href={`/blog/author/${author.slug}`} className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.75rem' }}>
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-display text-[16px] font-black text-amber-400" style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.20)' }}>{author.initials}</div>
                      <div>
                        <h3 className="font-display text-[16px] font-black text-white">{author.name}</h3>
                        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">{author.role}</p>
                      </div>
                    </div>
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-600">{author.expertise}</p>
                    <p className="mb-5 flex-grow font-body text-sm leading-relaxed text-stone-500 line-clamp-4">{author.bio}</p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {author.tech.map((t) => (
                        <span key={t} className="rounded-md px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-700">{author.articleCount} article{author.articleCount === 1 ? '' : 's'}</span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.18)' }}>
                        <Arrow className="w-3 h-3 text-amber-500" />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ TAG EXPLORER ════════ */}
      {!isFiltered && tags.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn className="mb-8">
              <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">Explore</span>
              <h2 className="font-display font-black tracking-tight text-[#111111]" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>Browse by Tag</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <Link key={tag.slug} href={`/blog/tag/${tag.slug}`} className="rounded-full bg-white px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#555555] transition-colors hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-600" style={{ border: '1px solid #EDEAE4', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    #{tag.name.replace(/\s+/g, '')} <span className="text-stone-400">{tag.count}</span>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ════════ WHY COMPANIES CHOOSE PHANTEX ════════ */}
      <WhyPhantex />

      {/* ════════ FINAL CTA ════════ */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="relative overflow-hidden text-center" style={{ background: '#111111', borderRadius: '2rem', padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem)' }}>
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 110%,rgba(245,158,11,0.09) 0%,transparent 60%)' }} />
              <div className="relative z-10">
                <span className="mb-6 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">Start Building</span>
                <h2 className="mx-auto mb-7 font-display font-black leading-[0.95] tracking-tight text-white" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', maxWidth: '760px' }}>READY TO BUILD SOMETHING BIG?</h2>
                <p className="mx-auto mb-10 font-body leading-relaxed" style={{ fontSize: '17px', color: 'rgba(255,255,255,0.52)', maxWidth: '560px' }}>Whether you&apos;re launching an MVP, scaling infrastructure, building AI systems, or automating operations, Phantex can help.</p>
                <Link href="/contact" className="group inline-flex items-center gap-3 rounded-xl px-8 py-4 font-display text-[12px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500" style={{ background: '#F59E0B' }}>
                  Book Your Call <Arrow className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
