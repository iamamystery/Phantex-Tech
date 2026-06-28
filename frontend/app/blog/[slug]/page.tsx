import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { buildMetadata } from '@/components/seo/MetaTags'
import { getPageSEO } from '@/lib/api'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import JsonLd from '@/components/seo/JsonLd'
import FadeIn from '@/components/ui/FadeIn'

import Markdown from '@/components/blog/Markdown'
import ReadingProgress from '@/components/blog/ReadingProgress'
import TableOfContents from '@/components/blog/TableOfContents'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleNav from '@/components/blog/ArticleNav'
import RelatedArticles from '@/components/blog/RelatedArticles'
import CommentsSection from '@/components/blog/CommentsSection'

import {
  getArticle,
  getArticleSlugs,
  getRelatedArticles,
  getAdjacentArticles,
} from '@/content'
import { extractToc, formatDateLong } from '@/content/utils'

const SITE_URL = 'https://phantextech.com'

// Pre-render every article at build time — no route 404s, fully static.
export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const article = getArticle(params.slug)
  if (!article) return {}

  const seo = await getPageSEO(`blog-${params.slug}`)
  return buildMetadata(seo, {
    title: `${article.title} | Phantex Tech Blog`,
    description: article.excerpt,
    path: `/blog/${article.slug}`,
    type: 'article',
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const { authorProfile, categoryProfile } = article
  const toc = extractToc(article.content)
  const related = getRelatedArticles(article.slug, 3)
  const { previous, next } = getAdjacentArticles(article.slug)
  const url = `${SITE_URL}/blog/${article.slug}`

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: categoryProfile.name, href: `/blog/category/${categoryProfile.slug}` },
    { name: article.title, href: `/blog/${article.slug}` },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    url,
    wordCount: article.wordCount,
    keywords: article.tags.join(', '),
    articleSection: categoryProfile.name,
    author: { '@type': 'Person', name: authorProfile.name },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Phantex Tech',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return (
    <main style={{ background: '#FAFAF8' }}>
      <ReadingProgress />
      <BreadcrumbSchema items={breadcrumbItems} />
      <JsonLd schema={articleSchema} />

      <article className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              <li><Link href="/" className="transition-colors hover:text-amber-600">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="transition-colors hover:text-amber-600">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/blog/category/${categoryProfile.slug}`} className="transition-colors hover:text-amber-600">
                  {categoryProfile.name}
                </Link>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/blog/category/${categoryProfile.slug}`}
                  className="rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em]"
                  style={{
                    background: `${categoryProfile.accent}14`,
                    color: categoryProfile.accent,
                    border: `1px solid ${categoryProfile.accent}33`,
                  }}
                >
                  {categoryProfile.name}
                </Link>
                <time dateTime={article.date} className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {formatDateLong(article.date)}
                </time>
                <span className="text-stone-300" aria-hidden="true">·</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {article.readingTime} min read
                </span>
              </div>

              <h1 className="mb-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#111111] md:text-5xl lg:text-[56px]">
                {article.title}
              </h1>
              <p className="mb-8 font-body text-lg leading-relaxed text-stone-500">
                {article.subtitle}
              </p>

              {/* Author byline + share */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-y py-6" style={{ borderColor: '#EDEAE4' }}>
                <Link href={`/blog/author/${authorProfile.slug}`} className="group flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-black text-amber-700"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}
                    aria-hidden="true"
                  >
                    {authorProfile.initials}
                  </span>
                  <span>
                    <span className="block font-body text-sm font-bold text-[#111111] group-hover:text-amber-600">
                      {authorProfile.name}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-stone-400">
                      {authorProfile.role}
                    </span>
                  </span>
                </Link>
                <ShareButtons url={url} title={article.title} />
              </div>
            </div>
          </FadeIn>

          {/* Body + TOC */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="mx-auto w-full max-w-3xl lg:mx-0">
              <Markdown content={article.content} />

              {/* Tags */}
              <div className="mt-12 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">Tags</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="rounded-full bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:border-amber-300 hover:text-amber-600"
                    style={{ border: '1px solid #EDEAE4' }}
                  >
                    #{tag.replace(/-/g, '')}
                  </Link>
                ))}
              </div>

              {/* Bottom share + back */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: '#EDEAE4' }}>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:text-amber-600"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back to Blog
                </Link>
                <ShareButtons url={url} title={article.title} />
              </div>

              {/* Author bio card */}
              <div className="mt-12 rounded-2xl bg-white p-7" style={{ border: '1px solid #EDEAE4' }}>
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl font-display text-lg font-black text-amber-700"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}
                    aria-hidden="true"
                  >
                    {authorProfile.initials}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
                      Written by
                    </p>
                    <Link href={`/blog/author/${authorProfile.slug}`} className="font-display text-xl font-black text-[#111111] hover:text-amber-600">
                      {authorProfile.name}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-stone-400">{authorProfile.role}</p>
                    <p className="mt-3 font-body text-sm leading-relaxed text-stone-500">{authorProfile.bio}</p>
                    <Link
                      href={`/blog/author/${authorProfile.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-600"
                    >
                      View all articles
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CTA: Book a Call + Explore Work */}
              <div className="relative mt-10 overflow-hidden rounded-3xl p-8 text-center md:p-12" style={{ background: '#0C0C0C' }}>
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 110%,rgba(245,158,11,0.09) 0%,transparent 60%)' }} />
                <div className="relative z-10">
                  <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">
                    Enjoyed this article?
                  </span>
                  <h3 className="mx-auto mb-3 max-w-md font-display text-2xl font-black leading-tight text-white md:text-3xl">
                    Let&apos;s build something that scales
                  </h3>
                  <p className="mx-auto mb-7 max-w-md font-body text-sm leading-relaxed text-stone-400">
                    We help teams ship AI systems, automation, and production backends. Tell us what you&apos;re building.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/contact"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500 sm:w-auto"
                      style={{ background: '#F59E0B' }}
                    >
                      Book a Strategy Call
                      <svg className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                    <Link
                      href="/work"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-300 transition-colors hover:border-amber-400/50 hover:text-white sm:w-auto"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                    >
                      Explore Our Work
                    </Link>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <CommentsSection articleSlug={article.slug} />

              {/* Prev / Next */}
              <ArticleNav previous={previous} next={next} />
            </div>

            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents entries={toc} />
              </div>
            </aside>
          </div>

          {/* Related */}
          <div className="mx-auto max-w-7xl">
            <RelatedArticles articles={related} />
          </div>
        </div>
      </article>
    </main>
  )
}
