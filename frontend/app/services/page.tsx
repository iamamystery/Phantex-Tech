import type { Metadata } from 'next'
import { getPageSEO, getHowWeWorkSettings, getWorkProcesses } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import ServiceSchema from '@/components/seo/schemas/ServiceSchema'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'
import Link from 'next/link'
import HowWeWork from '@/components/services/HowWeWork'
import { staggerDelay } from '@/lib/motion'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('services')
  return buildMetadata(seo, {
    title: 'Automation and Scraping Services Agency | Phantex Tech',
    description:
      'Scale your SaaS with production-ready web scraping, browser automation, and AI-powered data pipelines. Built to scale, not breaking on every update.',
    path: '/services',
  })
}

// ─── Service Icons (inline SVGs, brand-consistent) ───────────────────────────
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'web-scraping': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  'automation': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  'backend': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  ),
  'frontend': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
    </svg>
  ),
  'api': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  ),
  'ai': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
}

interface Service {
  slug: string
  name: string
  description: string
  longDescription: string
  tools: string[]
}

const SERVICES: Service[] = [
  {
    slug: 'web-scraping',
    name: 'Web Scraping & Data Extraction',
    description: 'Extract structured data from any website at scale. We handle JS rendering, anti-bot measures, and complex site structures.',
    longDescription: 'We build custom scrapers that are resilient and scalable, ensuring you get the data you need without the maintenance headache.',
    tools: ['Playwright', 'Selenium', 'requests', 'bs4'],
  },
  {
    slug: 'automation',
    name: 'Browser Automation',
    description: 'Automate complex browser workflows end-to-end. Form submissions, data entry, and scheduled multi-step interactions.',
    longDescription: 'Industry-standard tools like Playwright ensure fast, reliable, and headless execution at any volume.',
    tools: ['Playwright', 'Selenium', 'Botasaurus'],
  },
  {
    slug: 'backend',
    name: 'Backend Development',
    description: 'Scalable REST APIs and backend services built with Python. Django for complex apps, FastAPI for high-performance.',
    longDescription: 'Secure, performant, and maintainable API architectures that serve as the foundation of your SaaS.',
    tools: ['Python', 'Django', 'FastAPI'],
  },
  {
    slug: 'frontend',
    name: 'Frontend Development',
    description: 'Fast, SEO-optimised frontends with Next.js and React. From landing pages to complex SaaS dashboards.',
    longDescription: 'Blazing fast, responsive, and SEO-friendly frontends using the latest Next.js features.',
    tools: ['Next.js', 'React', 'TypeScript'],
  },
  {
    slug: 'api',
    name: 'API Integration',
    description: 'Connect disparate systems seamlessly. Third-party API integration, webhooks, and data transformation.',
    longDescription: 'We integrate everything from payment gateways to CRM systems, ensuring data flows smoothly across your stack.',
    tools: ['REST', 'GraphQL', 'OAuth', 'FastAPI'],
  },
  {
    slug: 'ai',
    name: 'AI Integration & Pipelines',
    description: 'Embed LLM-powered features into your product. Custom AI pipelines and intelligent automation.',
    longDescription: 'We build RAG systems and custom LLM pipelines that solve real-world problems for your users.',
    tools: ['OpenAI', 'LangChain', 'GPT-4', 'FastAPI'],
  },
]

// ─── Service Card Content ─────────────────────────────────────────────────────
function ServiceCardContent({ service, index }: { service: Service; index: number }) {
  const icon = SERVICE_ICONS[service.slug]
  return (
    <div className="flex flex-col h-[23rem] w-full relative z-10 p-2">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-5">
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0 transition-colors duration-300 group-hover:bg-amber-500/20">
          {icon}
        </div>
        {/* Service index number */}
        <span className="font-mono text-[10px] font-bold text-stone-400 dark:text-stone-600 tracking-[0.3em] pt-1">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-xl font-bold text-stone-900 dark:text-white leading-snug mb-3">
        {service.name}
      </h3>

      {/* Description */}
      <p className="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
        {service.description}
      </p>

      {/* Divider */}
      <div className="my-5 h-px bg-stone-100 dark:bg-white/[0.06] transition-colors duration-300 group-hover:dark:bg-white/[0.1] group-hover:bg-stone-200" />

      {/* Tool Tags */}
      <div className="flex flex-wrap gap-2">
        {service.tools.map((tool) => (
          <span
            key={tool}
            className="inline-flex items-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-white/[0.04] border border-stone-200/50 dark:border-white/[0.08] px-3 py-1.5 rounded-full shadow-sm"
          >
            {tool}
          </span>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-auto pt-5 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] group-hover:text-amber-500 transition-colors duration-300">
          Learn More
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-all duration-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[var(--text-muted)] group-hover:text-amber-500 transform group-hover:translate-x-0.5 transition-all duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ServicesPage() {
  const [settings, steps] = await Promise.all([
    getHowWeWorkSettings(),
    getWorkProcesses()
  ])

  return (
    <main className="pt-32 pb-40">
      <div className="overflow-x-clip">
      <ServiceSchema
        name="Phantex Tech Automation Services"
        description="High-end web automation, scraping and AI integration for SaaS startups."
        url="https://phantextech.com/services"
      />

      {/* ─── Hero / Header ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-4 flex items-center gap-3 justify-center">
            <span className="h-px w-8 bg-amber-500/60" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500">
              Our Expertise
            </span>
            <span className="h-px w-8 bg-amber-500/60" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black text-center text-[var(--text-primary)] leading-tight tracking-tight mb-6 max-w-4xl mx-auto">
            Enterprise-Grade{' '}
            <span className="text-amber-500">Automation</span> Services
          </h1>
          <p className="font-body text-lg text-[var(--text-muted)] text-center max-w-2xl mx-auto leading-relaxed">
            Production-ready automation solutions built for SaaS companies that need reliability, scale, and speed — without the maintenance overhead.
          </p>
        </FadeIn>

        {/* ─── Stats Bar ───────────────────────────────────────── */}
        <FadeIn delay={0.2}>
          <div className="mt-16 mb-4 grid grid-cols-3 divide-x divide-stone-200 dark:divide-white/5 border border-stone-200 dark:border-white/[0.06] rounded-2xl overflow-hidden bg-stone-50 dark:bg-white/[0.02]">
            {[
              { value: '6', label: 'Core Services' },
              { value: '99%', label: 'Uptime SLA' },
              { value: '< 48h', label: 'Avg. Delivery' },
            ].map(({ value, label }) => (
              <div key={label} className="py-8 text-center">
                <div className="font-display text-3xl font-black text-[var(--text-primary)] mb-1">{value}</div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ─── Engineered Service Cards Grid ─────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.slug} delay={staggerDelay(i)}>
              <Link
                href={`/services/${service.slug}`}
                className="group relative block w-full p-6 rounded-3xl bg-stone-50 dark:bg-[#0c0c0c] border border-stone-200 dark:border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden"
              >
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/50 transition-all duration-500" />
                
                <ServiceCardContent service={service} index={i} />
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ─── How We Work ─────────────────────────────────────── */}
      <HowWeWork settings={settings} steps={steps} />

      {/* ─── Testimonials ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <SectionHeader
          label="Client Feedback"
          title="Trusted by engineering teams"
          subtitle="We build tools that engineering leads and product managers love to use."
          align="center"
        />
        <TestimonialMarquee />
      </div>
      </div>
    </main>
  )
}
