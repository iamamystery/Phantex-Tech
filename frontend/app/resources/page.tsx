import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import FadeIn from '@/components/ui/FadeIn'
import { getResources } from '@/content/resources'
import { staggerDelay } from '@/lib/motion'

export const metadata: Metadata = buildMetadata(null, {
  title: 'Free Engineering Resources | Phantex Tech',
  description:
    'Free, downloadable engineering guides, checklists, and blueprints on web scraping, AI agents, backend scalability, and shipping SaaS MVPs.',
  path: '/resources',
})

export default function ResourcesPage() {
  const resources = getResources()

  return (
    <main className="pt-32 pb-24" style={{ background: '#FAFAF8' }}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-12">
          <span className="mb-4 block font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-amber-500">
            Free Resources
          </span>
          <h1 className="font-display font-black tracking-tight text-[#111111]" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            Engineering guides,<br />free to download.
          </h1>
          <p className="mt-5 max-w-2xl font-body leading-relaxed text-stone-500" style={{ fontSize: '17px' }}>
            Practical, no-fluff guides distilled from real client work — every one a complete PDF you can download and keep.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {resources.map((r, i) => (
            <FadeIn key={r.slug} delay={staggerDelay(i)}>
              <Link
                href={`/resources/${r.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                style={{ border: '1px solid #EDEAE4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">
                    {r.format}
                  </span>
                </div>
                <h2 className="mb-2 font-display text-xl font-black text-[#111111] group-hover:text-amber-600">{r.title}</h2>
                <p className="mb-6 flex-grow font-body text-sm leading-relaxed text-stone-500">{r.description}</p>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {r.pages} pages · v{r.version}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 transition-all group-hover:gap-2.5">
                    View
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  )
}
