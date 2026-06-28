import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import FadeIn from '@/components/ui/FadeIn'
import { getCaseStudy, getCaseStudySlugs, getCaseStudies, formatCaseStudyDate } from '@/content/case-studies'

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = getCaseStudy(params.slug)
  if (!cs) return {}
  return buildMetadata(null, {
    title: `${cs.title} — Case Study | Phantex Tech`,
    description: cs.summary,
    path: `/blog/case-studies/${cs.slug}`,
    type: 'article',
  })
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug)
  if (!cs) notFound()

  const others = getCaseStudies().filter((c) => c.slug !== cs.slug)

  const sections = [
    { heading: 'The Problem', body: cs.problem },
    { heading: 'Architecture', body: cs.architecture },
    { heading: 'The Solution', body: cs.solution },
    { heading: 'Challenges', body: cs.challenges },
    { heading: 'Results', body: cs.results },
    { heading: 'Lessons Learned', body: cs.lessons },
  ]

  return (
    <main className="pb-24" style={{ background: '#FAFAF8' }}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: 'Case Studies', href: '/blog#articles' },
          { name: cs.client, href: `/blog/case-studies/${cs.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="pt-28" style={{ background: '#0C0C0C' }}>
        <div className="mx-auto max-w-5xl px-6 pb-16">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:text-amber-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Blog
          </Link>
          <FadeIn>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em]" style={{ background: 'rgba(245,158,11,0.12)', color: '#F5C518', border: '1px solid rgba(245,158,11,0.25)' }}>
                {cs.tag}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-600">{cs.category}</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-600">{formatCaseStudyDate(cs.slug)}</span>
            </div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">{cs.client}</p>
            <h1 className="mb-6 font-display font-black leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>{cs.title}</h1>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-stone-400">{cs.summary}</p>
          </FadeIn>
        </div>
      </section>

      {/* Outcomes + meta */}
      <section className="mx-auto -mt-10 max-w-5xl px-6">
        <FadeIn>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-3" style={{ background: '#EDEAE4', border: '1px solid #EDEAE4' }}>
            {cs.outcomes.map((o) => (
              <div key={o.label} className="bg-white p-7 text-center">
                <span className="block font-display font-black leading-none tracking-tight text-[#111111]" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>{o.value}</span>
                <span className="mt-2 block font-body text-[13px] font-semibold text-stone-500">{o.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Stack */}
      <section className="mx-auto mt-10 max-w-3xl px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">Stack</span>
          {cs.stack.map((t) => (
            <span key={t} className="rounded-full bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500" style={{ border: '1px solid #EDEAE4' }}>{t}</span>
          ))}
          <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400">Timeline: {cs.duration}</span>
        </div>
      </section>

      {/* Narrative */}
      <article className="mx-auto mt-12 max-w-3xl px-6">
        {sections.map((s, i) => (
          <FadeIn key={s.heading} delay={Math.min(i * 0.04, 0.2)}>
            <section className="mb-10">
              <h2 className="mb-4 font-display text-[28px] font-black tracking-tight text-[#111111]">{s.heading}</h2>
              <p className="font-body text-[17px] leading-[1.75] text-[#333333]">{s.body}</p>
            </section>
          </FadeIn>
        ))}

        {/* CTA */}
        <div className="mt-12 overflow-hidden rounded-3xl p-10 text-center" style={{ background: '#111111' }}>
          <h2 className="mx-auto mb-4 max-w-md font-display text-2xl font-black text-white md:text-3xl">Have a similar challenge?</h2>
          <p className="mx-auto mb-8 max-w-md font-body text-sm leading-relaxed text-stone-400">
            We help teams ship systems like this. Tell us what you&apos;re building.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl px-8 py-4 font-display text-[12px] font-bold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-amber-500" style={{ background: '#F59E0B' }}>
            Book a Call
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </article>

      {/* Other case studies */}
      {others.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl px-6">
          <h2 className="mb-8 font-display text-2xl font-black text-[#111111]">More case studies</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/blog/case-studies/${o.slug}`} className="group flex flex-col rounded-2xl bg-white p-7 transition-all hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]" style={{ border: '1px solid #EDEAE4' }}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em]" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.15)' }}>{o.tag}</span>
                  <span className="font-display text-2xl font-black text-[#111111]">{o.metric}</span>
                </div>
                <h3 className="font-display text-[17px] font-black text-[#111111] group-hover:text-amber-600">{o.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-stone-500 line-clamp-2">{o.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
