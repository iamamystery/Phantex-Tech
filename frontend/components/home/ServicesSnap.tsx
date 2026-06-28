'use client'

import type { ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import AmbientBackground from '@/components/home/AmbientBackground'

/* ─── Types ───────────────────────────────────────────────────── */
interface ServiceItem {
  href: string
  name: string
  description: string
  tools: string[]
  number: string
  icon: ReactNode
}

/* ─── Data ────────────────────────────────────────────────────── */
const SERVICES: ServiceItem[] = [
  {
    href: '/services/web-scraping',
    name: 'Web Scraping',
    number: '01',
    description:
      'Extract structured data from any website at scale. Custom scrapers that handle JS rendering, anti-bot measures, and dynamic content.',
    tools: ['Playwright', 'Selenium', 'requests', 'bs4'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    href: '/services/automation',
    name: 'Browser Automation',
    number: '02',
    description:
      'Automate complex browser workflows end-to-end. Form submissions, data entry, scheduled tasks, and multi-step interactions.',
    tools: ['Playwright', 'Selenium', 'Botasaurus'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    href: '/services/backend',
    name: 'Backend Development',
    number: '03',
    description:
      'Scalable REST APIs built with Python. Django for complex apps, FastAPI for high-performance data pipelines.',
    tools: ['Python', 'Django', 'FastAPI'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    href: '/services/frontend',
    name: 'Frontend Development',
    number: '04',
    description:
      'Fast, SEO-optimised frontends with Next.js and React. From polished landing pages to complex SaaS dashboards.',
    tools: ['Next.js', 'React', 'TypeScript'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    href: '/services/api',
    name: 'API Integration',
    number: '05',
    description:
      'Connect disparate systems seamlessly. Third-party APIs, webhooks, OAuth flows, and data transformation pipelines.',
    tools: ['REST', 'GraphQL', 'OAuth', 'FastAPI'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    href: '/services/ai',
    name: 'AI Integration',
    number: '06',
    description:
      'Embed LLM-powered features into your product. Custom AI pipelines, RAG systems, and intelligent automation using the latest models.',
    tools: ['OpenAI', 'LangChain', 'GPT-4', 'FastAPI'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
  },
]

/* ─── Individual Card ─────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
  className = '',
  featured = false,
}: {
  service: ServiceItem
  index: number
  className?: string
  featured?: boolean
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(245,158,11,0.13), transparent 75%)`

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      <Link
        href={service.href}
        className="block h-full rounded-[22px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label={`Learn more about ${service.name}`}
      >
        <div
          className="relative h-full rounded-[22px] overflow-hidden cursor-pointer group bg-[#0E0D0C]"
          onMouseMove={onMouseMove}
          style={{
            border: '1px solid rgba(245,158,11,0.14)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          {/* Amber hairline top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

          {/* Mouse-tracking spotlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[22px]"
            style={{ background: spotlight }}
          />

          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Ghost background number */}
          <span
            className="absolute pointer-events-none select-none font-black text-white leading-none"
            style={{
              fontSize: featured ? '11rem' : '8.5rem',
              bottom: featured ? '-1.5rem' : '-1rem',
              right: featured ? '1.5rem' : '1rem',
              opacity: 0.028,
              fontFamily: 'var(--font-display, system-ui)',
              letterSpacing: '-0.04em',
            }}
          >
            {service.number}
          </span>

          {/* Bottom ambient glow */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: 'linear-gradient(to top, rgba(245,158,11,0.07), transparent)' }}
          />

          {/* Content */}
          <div className={`relative z-10 flex flex-col h-full ${featured ? 'p-8' : 'p-6'}`}>

            {/* Icon orb */}
            <div
              className="flex-shrink-0 flex items-center justify-center text-amber-400 mb-6 transition-all duration-300 group-hover:scale-105"
              style={{
                width: featured ? '52px' : '44px',
                height: featured ? '52px' : '44px',
                borderRadius: '14px',
                background: 'radial-gradient(circle at 40% 35%, rgba(245,158,11,0.22) 0%, rgba(245,158,11,0.06) 100%)',
                border: '1px solid rgba(245,158,11,0.28)',
                boxShadow: '0 0 18px rgba(245,158,11,0.10), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {service.icon}
            </div>

            {/* Name */}
            <h3
              className="font-display font-bold text-white leading-snug mb-2.5 transition-colors duration-200 group-hover:text-amber-50"
              style={{ fontSize: featured ? '1.35rem' : '1.05rem' }}
            >
              {service.name}
            </h3>

            {/* Description */}
            <p
              className="font-body text-stone-400 leading-relaxed flex-1 mb-5"
              style={{ fontSize: featured ? '0.9375rem' : '0.875rem' }}
            >
              {service.description}
            </p>

            {/* Tool chips */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {service.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center px-2.5 py-[3px] rounded-full font-mono font-semibold text-amber-400/75 transition-colors duration-200 group-hover:text-amber-400"
                  style={{
                    fontSize: '10.5px',
                    background: 'rgba(245,158,11,0.07)',
                    border: '1px solid rgba(245,158,11,0.14)',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* Learn more */}
            <div className="flex items-center gap-1.5 font-semibold text-amber-500/80 group-hover:text-amber-400 transition-colors duration-200"
              style={{ fontSize: '0.8125rem' }}
            >
              <span>Learn more</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─── CTA card (bento slot) ───────────────────────────────────── */
function CTACard() {
  return (
    <motion.div
      className="col-span-6 md:col-span-3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative h-full rounded-[22px] overflow-hidden flex flex-col items-start justify-between p-8"
        style={{
          background: 'linear-gradient(140deg, rgba(245,158,11,0.12) 0%, rgba(234,88,12,0.07) 60%, rgba(14,13,12,0.04) 100%)',
          border: '1px solid rgba(245,158,11,0.22)',
          minHeight: '220px',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-amber-600/70 mb-3">
            Don&apos;t see what you need?
          </p>
          <h3 className="font-display text-2xl font-black text-stone-900 leading-snug mb-2">
            We build<br />
            <span className="text-amber-600">custom solutions.</span>
          </h3>
          <p className="font-body text-sm text-stone-500 max-w-xs">
            Every project is different. Tell us about yours and we&apos;ll scope it within 48 hours.
          </p>
        </div>

        <Link
          href="/contact"
          className="relative z-10 mt-6 group inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-body font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)] hover:-translate-y-0.5"
        >
          Let&apos;s talk
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

/* ─── Section ─────────────────────────────────────────────────── */
export default function ServicesSnap() {
  return (
    <section className="py-24 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden">

      {/* Section divider hairline + quiet ambient lighting (no grid here) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/15 to-transparent" aria-hidden="true" />
      <AmbientBackground variant="section" grid={false} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Header ────────────────────────────────────── */}
        <FadeIn className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-amber-600/80 mb-3">
              What We Do
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-stone-900 leading-[1.1] tracking-tight">
              Services built for
              <br />
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(90deg, #B45309 0%, #D97706 40%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                modern SaaS teams
              </span>
            </h2>
            <p className="font-body text-base text-stone-500 mt-4 max-w-lg leading-relaxed">
              Every service is production-ready, documented, and built to scale.
              No duct-tape solutions.
            </p>
          </div>

          <Link
            href="/services"
            className="group flex-shrink-0 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-500 transition-colors whitespace-nowrap mb-1"
          >
            View all services
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </FadeIn>

        {/* ── Bento grid ───────────────────────────────── */}
        <div className="grid grid-cols-6 gap-4">

          {/* Row 1: featured (wide) + normal */}
          <ServiceCard
            service={SERVICES[0]}
            index={0}
            className="col-span-6 md:col-span-4"
            featured
          />
          <ServiceCard
            service={SERVICES[1]}
            index={1}
            className="col-span-6 md:col-span-2"
          />

          {/* Row 2: three equal */}
          <ServiceCard service={SERVICES[2]} index={2} className="col-span-6 md:col-span-2" />
          <ServiceCard service={SERVICES[3]} index={3} className="col-span-6 md:col-span-2" />
          <ServiceCard service={SERVICES[4]} index={4} className="col-span-6 md:col-span-2" />

          {/* Row 3: service card + CTA card */}
          <ServiceCard
            service={SERVICES[5]}
            index={5}
            className="col-span-6 md:col-span-3"
            featured
          />
          <CTACard />
        </div>
      </div>
    </section>
  )
}
