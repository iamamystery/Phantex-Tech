import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import AmbientBackground from '@/components/home/AmbientBackground'
import { staggerDelay } from '@/lib/motion'

/* ─── Project data ───────────────────────────────────────────────── */

export const FEATURED_PROJECT = {
  slug: 'kingdomx',
  number: '01',
  category: 'Flagship Product',
  title: 'KingdomX',
  subtitle: 'Full-Stack SaaS Platform',
  impact: 'Real-time collaboration, AI workflows, and role-based access — shipped as one production system.',
  description:
    'KingdomX is a production-grade SaaS platform built to scale from day one. It ships with real-time collaboration via Socket.IO, modular microservices for chat and notifications, AI-powered helpers, complete auth with JWT, and a full RBAC system. Built to deploy, not to demo.',
  stack: ['Next.js', 'Node.js', 'Prisma', 'PostgreSQL', 'Socket.IO', 'Tailwind'],
  href: 'https://kingdomx-demo.vercel.app/',
}

export const PROJECTS = [
  {
    slug: 'cloud-infrastructure',
    number: '02',
    category: 'Cloud · DevOps',
    title: 'Cloud Infrastructure Manager',
    impact: 'One control plane for AWS, Azure, and GCP — monitoring, deployments, and cost analytics unified.',
    description:
      'Enterprise SaaS for multi-cloud operations. Replaces the chaos of three separate cloud consoles with a single dashboard for monitoring, automated deployments, and real-time cost tracking.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis'],
    href: 'https://cloud-infra-manager.vercel.app/',
  },
  {
    slug: 'luxecart',
    number: '03',
    category: 'E-Commerce · AI',
    title: 'LuxeCart',
    impact: 'AI-driven recommendations and intelligent search that sell without manual merchandising.',
    description:
      'Full-stack commerce platform powered by ML. Handles product recommendations, intelligent search, inventory management, and a complete order lifecycle — from browse to delivery.',
    stack: ['React', 'Node.js', 'MongoDB', 'FastAPI', 'Tailwind', 'AI/ML'],
    href: 'https://frontend-murex-rho-51.vercel.app/',
  },
  {
    slug: 'dboptima',
    number: '04',
    category: 'Database · AI',
    title: 'DBOptima',
    impact: 'AI-powered query analysis that catches slow database operations before they reach production.',
    description:
      'Connects to live databases and surfaces bottlenecks, index gaps, and performance anomalies in real time. AI-generated fix recommendations — reviewed once, applied in seconds.',
    stack: ['Next.js', 'PostgreSQL', 'Redis', 'Python', 'FastAPI', 'AI/ML'],
    href: 'https://databaseoptimization.vercel.app/',
  },
  {
    slug: 'analytics-dashboard',
    number: '05',
    category: 'Analytics · BI',
    title: 'Analytics Dashboard',
    impact: 'Live KPIs, revenue forecasting, and role-based reports — no BI team required.',
    description:
      'Business intelligence platform built for operators. Real-time KPI tracking, customizable charts, automated reporting, and revenue forecasting with clean role-based access controls.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis'],
    href: 'https://analyticsdashboard-nine.vercel.app/',
  },
]

/* ─── Featured card (KingdomX) ───────────────────────────────────── */
function FeaturedCard() {
  const p = FEATURED_PROJECT
  return (
    <FadeIn>
      <div className="group relative rounded-2xl overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5" style={{ background: '#0C0C0C' }}>

        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{
          top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,193,24,0.07) 0%, transparent 65%)',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '-60px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,193,24,0.04) 0%, transparent 65%)',
        }} />

        {/* Hover ring — restrained amber + soft glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(245,193,24,0.28), 0 30px 80px -30px rgba(245,193,24,0.20)' }} />

        <div className="relative z-10 p-8 md:p-12 lg:p-14">
          {/* Top row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(245,193,24,0.12)', color: '#F5C518', border: '1px solid rgba(245,193,24,0.25)' }}>
                {p.category}
              </span>
            </div>
            <span className="font-display font-black text-[42px] leading-none select-none"
              style={{ color: 'rgba(255,255,255,0.04)' }}>
              {p.number}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              {/* Title block */}
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 mb-2">
                {p.subtitle}
              </p>
              <h3 className="font-display font-black text-white leading-none tracking-tight mb-5"
                style={{ fontSize: 'clamp(36px, 5vw, 58px)' }}>
                {p.title}
              </h3>

              {/* Impact */}
              <div className="flex items-start gap-2.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <p className="font-body text-[15px] font-semibold text-amber-400 leading-snug">
                  {p.impact}
                </p>
              </div>

              {/* Description */}
              <p className="font-body text-[14px] text-stone-400 leading-[1.8] max-w-2xl mb-8">
                {p.description}
              </p>

              {/* Stack */}
              <div className="flex flex-wrap gap-2">
                {p.stack.map(t => (
                  <span key={t} className="font-mono text-[10px] px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <Link
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-body font-bold text-[13px] px-6 py-3.5 rounded-xl transition-all duration-200"
                style={{ background: '#F5C518', color: '#0C0C0C' }}
              >
                View Live Demo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

/* ─── Secondary card ─────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <FadeIn delay={staggerDelay(index)} className="h-full">
      <div className="group relative h-full bg-white rounded-2xl border flex flex-col p-7 transition-all duration-300 ease-out hover:-translate-y-1"
        style={{ borderColor: '#EDEAE4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

        {/* Hover ring — subtle elevation, soft shadow, restrained amber */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(245,193,24,0.25), 0 18px 44px -18px rgba(0,0,0,0.16)' }} />

        {/* Top */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#FEF9EC', color: '#B45309', border: '1px solid #FDE68A' }}>
            {project.category}
          </span>
          <span className="font-display font-black text-[24px] leading-none select-none text-stone-100">
            {project.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-stone-900 text-[18px] leading-snug mb-2.5 group-hover:text-amber-500 transition-colors duration-150 relative z-10">
          {project.title}
        </h3>

        {/* Impact */}
        <div className="flex items-start gap-2 mb-3 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
          <p className="font-body text-[13px] font-semibold text-amber-600 leading-snug">
            {project.impact}
          </p>
        </div>

        {/* Description */}
        <p className="font-body text-[13px] text-stone-500 leading-[1.75] flex-1 mb-5 relative z-10">
          {project.description}
        </p>

        {/* Divider */}
        <div className="h-px mb-5 relative z-10" style={{ background: '#F0EDE8' }} />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map(t => (
              <span key={t} className="font-mono text-[10px] text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full">
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
            className="flex-shrink-0 inline-flex items-center gap-1 font-body text-[12px] font-semibold text-stone-400 group-hover:text-amber-500 transition-colors duration-150"
          >
            View Project
            <svg className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}

/* ─── Homepage section ───────────────────────────────────────────── */
export default function FeaturedWork() {
  return (
    <section className="relative overflow-hidden py-28 md:py-32 bg-[var(--bg-primary)]">
      {/* Section divider hairline + quiet ambient lighting (grid) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" aria-hidden="true" />
      <AmbientBackground variant="section" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <FadeIn>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-amber-500 font-bold block mb-3">
                Selected Work
              </span>
              <h2 className="font-display font-black text-[var(--text-primary)] text-[clamp(28px,3.5vw,42px)] leading-tight tracking-tight">
                Projects that drive results.
              </h2>
            </div>
            <Link href="/work"
              className="font-body text-sm font-semibold text-stone-400 hover:text-amber-500 transition-colors duration-150 flex items-center gap-1.5">
              View all five
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        {/* Featured */}
        <div className="mb-5">
          <FeaturedCard />
        </div>

        {/* Secondary grid — first 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.slice(0, 2).map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
