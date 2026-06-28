import type { Metadata } from 'next'
import Link from 'next/link'
import { getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import FadeIn from '@/components/ui/FadeIn'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'
import { FEATURED_PROJECT, PROJECTS } from '@/components/home/FeaturedWork'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('work')
  return buildMetadata(seo, {
    title: 'Selected Work — Projects That Drive Results | Phantex',
    description:
      'Five production systems built for scale — SaaS platforms, automation pipelines, cloud infrastructure, and AI-powered tools.',
    path: '/work',
  })
}

/* ─── Featured card (full work page version) ────────────────────── */
function FeaturedCard() {
  const p = FEATURED_PROJECT
  return (
    <FadeIn>
      <div className="group relative rounded-2xl overflow-hidden" style={{ background: '#0C0C0C' }}>

        {/* Ambient glow orbs */}
        <div className="absolute pointer-events-none" style={{
          top: '-100px', right: '-80px', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,193,24,0.08) 0%, transparent 65%)',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '-80px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,193,24,0.04) 0%, transparent 65%)',
        }} />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Hover border ring */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(245,193,24,0.45)' }} />

        <div className="relative z-10 p-10 md:p-14 lg:p-16">

          {/* Meta row */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(245,193,24,0.12)', color: '#F5C518', border: '1px solid rgba(245,193,24,0.3)' }}>
                {p.category}
              </span>
            </div>
            <span className="font-display font-black leading-none select-none"
              style={{ fontSize: '56px', color: 'rgba(255,255,255,0.04)' }}>
              {p.number}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 mb-2.5">
                {p.subtitle}
              </p>
              <h2 className="font-display font-black text-white leading-[0.95] tracking-tight mb-6"
                style={{ fontSize: 'clamp(42px, 6vw, 72px)' }}>
                {p.title}
              </h2>

              {/* Impact */}
              <div className="flex items-start gap-3 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                <p className="font-body text-[16px] font-semibold text-amber-400 leading-snug max-w-xl">
                  {p.impact}
                </p>
              </div>

              {/* Description */}
              <p className="font-body text-[15px] text-stone-400 leading-[1.8] max-w-2xl mb-9">
                {p.description}
              </p>

              {/* Stack */}
              <div className="flex flex-wrap gap-2">
                {p.stack.map(t => (
                  <span key={t} className="font-mono text-[11px] px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA panel */}
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 font-body font-bold text-[14px] px-7 py-4 rounded-xl transition-all duration-200 hover:brightness-110"
                style={{ background: '#F5C518', color: '#0C0C0C', boxShadow: '0 4px 20px rgba(245,193,24,0.25)' }}
              >
                View Live Demo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="font-mono text-[10px] text-stone-600 text-center lg:text-right">
                Hosted on Vercel · Always live
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

/* ─── Secondary project card ─────────────────────────────────────── */
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <FadeIn delay={index * 0.07} className="h-full">
      <div className="group relative h-full bg-white rounded-2xl border flex flex-col p-8 transition-all duration-200"
        style={{ borderColor: '#EDEAE4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

        {/* Hover ring */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(245,193,24,0.5), 0 12px 32px rgba(0,0,0,0.07)' }} />

        {/* Top row */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#FEF9EC', color: '#B45309', border: '1px solid #FDE68A' }}>
            {project.category}
          </span>
          <span className="font-display font-black text-[28px] leading-none select-none text-stone-100">
            {project.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-stone-900 text-[20px] leading-snug mb-3 group-hover:text-amber-500 transition-colors duration-150 relative z-10">
          {project.title}
        </h3>

        {/* Impact */}
        <div className="flex items-start gap-2.5 mb-4 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
          <p className="font-body text-[13px] font-semibold text-amber-600 leading-snug">
            {project.impact}
          </p>
        </div>

        {/* Description */}
        <p className="font-body text-[13px] text-stone-500 leading-[1.78] flex-1 mb-6 relative z-10">
          {project.description}
        </p>

        {/* Divider */}
        <div className="h-px mb-5 relative z-10" style={{ background: '#F0EDE8' }} />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map(t => (
              <span key={t} className="font-mono text-[10px] text-stone-400 bg-stone-50 border border-stone-100 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span className="font-mono text-[10px] text-stone-300 self-center">+{project.stack.length - 3}</span>
            )}
          </div>
          <Link
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 font-body text-[12px] font-bold text-stone-400 group-hover:text-amber-500 transition-colors duration-150"
          >
            View Project
            <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default async function WorkPage() {
  return (
    <main className="bg-[var(--bg-primary)] min-h-screen">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Work', href: '/work' }]} />

      {/* ─── Hero ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-36 pb-14">
        <FadeIn>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-amber-400" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-amber-500">
              Selected Work
            </span>
          </div>
          <h1 className="font-display font-black text-[var(--text-primary)] text-[clamp(36px,5.5vw,68px)] leading-[1.02] tracking-tight mb-5 max-w-3xl">
            Projects That{' '}
            <span className="text-amber-500">Drive Results.</span>
          </h1>
          <p className="font-body text-[var(--text-muted)] text-lg leading-relaxed max-w-xl">
            Five production systems — automation, AI, cloud infrastructure, and SaaS platforms — built for companies that needed results, not prototypes.
          </p>
        </FadeIn>
      </div>

      {/* ─── Content ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-28">

        {/* KingdomX — Flagship */}
        <div className="mb-5">
          <FeaturedCard />
        </div>

        {/* Secondary — 2 × 2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>

      </div>

      {/* ─── Testimonials ───────────────────────────────────── */}
      <TestimonialMarquee />
    </main>
  )
}
