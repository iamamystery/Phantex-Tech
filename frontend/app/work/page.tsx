import type { Metadata } from 'next'
import { getProjects, getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'
import { PinContainer } from '@/components/ui/3d-pin'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('work')
  return buildMetadata(seo, {
    title: 'Automation and Scraping Projects Portfolio | Phantex Tech',
    description:
      'Case studies of our successful web scraping, browser automation, and AI integration projects for SaaS startups.',
    path: '/work',
  })
}

const SERVICE_LABELS: Record<string, string> = {
  'web-scraping': 'Web Scraping',
  'automation': 'Browser Automation',
  'backend': 'Backend',
  'frontend': 'Frontend',
  'api': 'API Integration',
  'ai': 'AI Integration',
}

// ─── Service type color accents ───────────────────────────────────────────────
const SERVICE_COLORS: Record<string, string> = {
  'web-scraping': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  'automation': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
  'backend': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
  'frontend': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  'api': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
  'ai': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
}

export default async function WorkPage() {
  let projects: any[] = []
  try {
    const data = await getProjects()
    projects = data.results
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_BUILD_MODE !== '1') {
        console.warn('Work: API unreachable at build time. Dynamic content will be fetched at runtime.')
      }
    } else {
      console.error('Failed to fetch projects:', error)
    }
  }

  return (
    <main className="pt-32 pb-12 overflow-x-hidden">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Work', href: '/work' }]} />

      {/* ─── Hero / Header ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-500/60" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500">
              Case Studies
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black text-[var(--text-primary)] leading-tight tracking-tight mb-6 max-w-3xl">
            Projects That{' '}
            <span className="text-amber-500">Drive Results</span>
          </h1>
          <p className="font-body text-lg text-[var(--text-muted)] max-w-xl leading-relaxed">
            Real-world automation and data extraction projects built for modern SaaS companies.
          </p>
        </FadeIn>


      </div>

      {/* ─── Projects Grid with 3D Pin ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-40 mt-8">
            {projects.map((project, i) => {
              const thumbUrl = getMediaUrl(project.thumbnail)
              const badgeColor = SERVICE_COLORS[project.service_type] ?? 'bg-stone-50 text-stone-600 border-stone-200'

              return (
                <FadeIn key={project.slug} delay={i * 0.08}>
                  <div className="flex items-start justify-center pt-20">
                    <PinContainer
                      title={project.title}
                      href={`/work/${project.slug}`}
                    >
                      <div className="flex flex-col w-[24rem] h-auto min-h-[30rem] pb-4">

                        {/* ── Thumbnail ──────────────────────────── */}
                        <div className="relative w-full h-44 overflow-hidden rounded-xl bg-stone-100 dark:bg-white/[0.04] border border-stone-200 dark:border-white/[0.06] mb-5 flex-shrink-0">
                          {thumbUrl ? (
                            <Image
                              src={thumbUrl}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-xl bg-amber-500/8 border border-amber-500/15 flex items-center justify-center text-amber-500/60">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                              </div>
                            </div>
                          )}

                          {/* Service type badge — pill, color-coded */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex items-center font-mono text-[8px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${badgeColor}`}>
                              {SERVICE_LABELS[project.service_type] ?? project.service_type}
                            </span>
                          </div>

                          {/* View count */}
                          {project.view_count > 0 && (
                            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                              <svg className="w-3 h-3 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
                              </svg>
                              <span className="text-white/60 text-[9px] font-mono font-bold">{project.view_count}</span>
                            </div>
                          )}
                        </div>

                        {/* ── Title & Description ────────────────── */}
                        <h2 className="font-display text-xl font-bold text-stone-900 dark:text-white leading-snug mb-2">
                          {project.title}
                        </h2>
                        <p className="font-body text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2 mb-auto">
                          {project.description}
                        </p>

                        {/* ── Divider ───────────────────────────── */}
                        <div className="my-4 h-px bg-stone-100 dark:bg-white/[0.06]" />

                        {/* ── Tech Stack ───────────────────── */}
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.slice(0, 4).map((tech: string) => (
                            <span
                              key={tech}
                              className="inline-flex items-center font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.10] px-3 py-1.5 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 4 && (
                            <span className="inline-flex items-center font-mono text-[8px] text-stone-400 dark:text-stone-500 self-center">
                              +{project.tech_stack.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </PinContainer>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        ) : (
          /* ─── Empty State ──────────────────────────────────── */
          <FadeIn>
            <div className="mt-24 flex flex-col items-center justify-center text-center py-32 rounded-3xl border border-dashed border-stone-200 dark:border-white/[0.06]">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3">
                Portfolio Coming Soon
              </h3>
              <p className="font-body text-[var(--text-muted)] max-w-sm">
                We are currently preparing our case studies. Check back soon to explore our work.
              </p>
            </div>
          </FadeIn>
        )}
      </div>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <SectionHeader
          label="Wall of Love"
          title="What our partners say about us"
          subtitle="Don't just take our word for it. Here is what SaaS founders and engineering leads have to say."
          align="center"
        />
        <TestimonialMarquee />
      </div>
    </main>
  )
}
