import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import FadeIn from '@/components/ui/FadeIn'
import { getResource, getResourceSlugs, getResources, formatResourceDate } from '@/content/resources'
import { resolveAuthor } from '@/content/authors'

export function generateStaticParams() {
  return getResourceSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const resource = getResource(params.slug)
  if (!resource) return {}
  return buildMetadata(null, {
    title: `${resource.title} — Free ${resource.format} | Phantex Tech`,
    description: resource.description,
    path: `/resources/${resource.slug}`,
  })
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = getResource(params.slug)
  if (!resource) notFound()

  const author = resolveAuthor(resource.author)
  const related = getResources().filter((r) => r.slug !== resource.slug).slice(0, 3)

  const meta = [
    { label: 'Format', value: resource.format },
    { label: 'Pages', value: `${resource.pages}` },
    { label: 'Version', value: `v${resource.version}` },
    { label: 'Updated', value: formatResourceDate(resource.slug) },
  ]

  return (
    <main className="pt-32 pb-24" style={{ background: '#FAFAF8' }}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: resource.title, href: `/resources/${resource.slug}` },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <Link href="/resources" className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:text-amber-600">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All Resources
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Main */}
          <FadeIn>
            <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">{resource.format}</span>
            <h1 className="mb-4 font-display font-black leading-[1.05] tracking-tight text-[#111111]" style={{ fontSize: 'clamp(34px, 4.5vw, 56px)' }}>{resource.title}</h1>
            <p className="mb-8 font-body text-lg leading-relaxed text-stone-500">{resource.subtitle}</p>

            {/* What's inside (preview from the same source as the PDF) */}
            <div className="rounded-2xl bg-white p-7" style={{ border: '1px solid #EDEAE4' }}>
              <h2 className="mb-6 font-display text-xl font-black text-[#111111]">What&apos;s inside</h2>
              <ol className="space-y-5">
                {resource.document.sections.map((section, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-display text-lg font-black text-amber-400">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-display text-[16px] font-bold text-[#111111]">
                        {section.heading.replace(/^\d+\.\s*/, '')}
                      </h3>
                      <p className="mt-1 font-body text-sm leading-relaxed text-stone-500">
                        {section.paragraphs[0]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          {/* Sidebar: download card */}
          <FadeIn delay={0.1}>
            <div className="sticky top-28 rounded-2xl bg-white p-7" style={{ border: '1px solid #EDEAE4', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              <div className="mb-6 grid grid-cols-2 gap-4">
                {meta.map((m) => (
                  <div key={m.label}>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">{m.label}</p>
                    <p className="mt-1 font-display text-sm font-bold text-[#111111]">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Real download — generates a PDF on the server. */}
              <a
                href={`/resources/${resource.slug}/download`}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[12px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500"
                style={{ background: '#F59E0B' }}
              >
                Download PDF
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </a>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-stone-400">Free · No email required</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 pt-6" style={{ borderTop: '1px solid #F0EDE8' }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full font-display text-xs font-black text-amber-700" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }} aria-hidden="true">{author.initials}</span>
                <div>
                  <Link href={`/blog/author/${author.slug}`} className="block font-body text-sm font-bold text-[#111111] hover:text-amber-600">{author.name}</Link>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-stone-400">{author.role}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {resource.tags.map((t) => (
                  <Link key={t} href={`/blog/tag/${t}`} className="rounded-full bg-stone-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:text-amber-600" style={{ border: '1px solid #EDEAE4' }}>
                    #{t.replace(/-/g, '')}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Related resources */}
        {related.length > 0 && (
          <section className="mt-16 pt-12" style={{ borderTop: '1px solid #EDEAE4' }}>
            <h2 className="mb-8 font-display text-2xl font-black text-[#111111]">More resources</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex flex-col rounded-2xl bg-white p-6 transition-all hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]" style={{ border: '1px solid #EDEAE4' }}>
                  <span className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">{r.format} · {r.pages} pages</span>
                  <h3 className="mb-2 font-display text-[16px] font-black text-[#111111] group-hover:text-amber-600">{r.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-stone-500 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
