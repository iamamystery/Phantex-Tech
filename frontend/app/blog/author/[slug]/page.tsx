import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import JsonLd from '@/components/seo/JsonLd'
import TaxonomyListing from '@/components/blog/TaxonomyListing'
import { getAuthorSlugs, getAuthor, getArticlesByAuthor, toSummary } from '@/content'

const SITE_URL = 'https://phantextech.com'

export function generateStaticParams() {
  return getAuthorSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const author = getAuthor(params.slug)
  if (!author) return {}
  return buildMetadata(null, {
    title: `${author.name} — ${author.role} | Phantex Tech`,
    description: author.bio,
    path: `/blog/author/${author.slug}`,
  })
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthor(params.slug)
  if (!author) notFound()

  const articles = getArticlesByAuthor(author.slug).map(toSummary)
  const totalReadTime = articles.reduce((sum, a) => sum + a.readingTime, 0)

  const socials = [
    author.twitter && { name: 'X', href: author.twitter },
    author.linkedin && { name: 'LinkedIn', href: author.linkedin },
    author.github && { name: 'GitHub', href: author.github },
  ].filter(Boolean) as { name: string; href: string }[]

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.longBio,
    url: `${SITE_URL}/blog/author/${author.slug}`,
    knowsAbout: author.tech,
    worksFor: { '@type': 'Organization', name: 'Phantex Tech' },
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: author.name, href: `/blog/author/${author.slug}` },
        ]}
      />
      <JsonLd schema={personSchema} />
      <TaxonomyListing eyebrow={author.role} title={author.name} articles={articles}>
        <div className="mt-6 flex items-start gap-5">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl font-display text-xl font-black text-amber-700"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}
            aria-hidden="true"
          >
            {author.initials}
          </div>
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">{author.expertise}</p>
            <p className="mt-3 font-body leading-relaxed text-stone-600" style={{ fontSize: '16px' }}>{author.longBio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {author.tech.map((t) => (
                <span key={t} className="rounded-md bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500" style={{ border: '1px solid #EDEAE4' }}>{t}</span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-6">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-stone-400">
                {articles.length} article{articles.length === 1 ? '' : 's'}
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-stone-400">
                {totalReadTime} min total
              </span>
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-600">
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </TaxonomyListing>
    </>
  )
}
