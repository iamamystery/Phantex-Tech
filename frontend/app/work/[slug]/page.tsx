import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProject, getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import TechBadge from '@/components/ui/TechBadge'
import GlassCard from '@/components/ui/GlassCard'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug).catch(() => null)
  if (!project) return {}

  const seo = await getPageSEO(`project-${params.slug}`)
  return buildMetadata(seo, {
    title: `${project.title} | Case Study | Phantex Tech`,
    description: project.description,
    path: `/work/${params.slug}`,
  })
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug).catch(() => null)
  if (!project) notFound()

  const thumbUrl = getMediaUrl(project.thumbnail)
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Work', href: '/work' },
    { name: project.title, href: `/work/${project.slug}` },
  ]

  return (
    <main className="pt-32 pb-24">
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="mb-12">
          <SectionHeader
            label="Case Study"
            title={project.title}
          />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <FadeIn delay={0.1}>
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FadeIn delay={0.2} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">The Challenge</h3>
                <p className="font-body text-base text-[var(--text-muted)] leading-relaxed">
                  {project.challenge || project.description}
                </p>
              </FadeIn>
              <FadeIn delay={0.3} className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">The Solution</h3>
                <p className="font-body text-base text-[var(--text-muted)] leading-relaxed">
                  {project.solution || 'We implemented a custom high-performance solution tailored to the specific needs of this project.'}
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.4}>
              <GlassCard className="p-8 md:p-12 bg-amber-500/5 border-amber-500/10">
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">Key Results</h3>
                <p className="font-body text-lg text-[var(--text-primary)] leading-relaxed italic">
                  "{project.results || 'The project was delivered on time and significantly improved the client\'s operational efficiency.'}"
                </p>
              </GlassCard>
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <FadeIn delay={0.5}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-6">
                Project Info
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-body text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-2">Service</h4>
                  <p className="font-body text-sm font-bold text-[var(--text-primary)]">{project.service_type}</p>
                </div>
                {project.client && (
                  <div>
                    <h4 className="font-body text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-2">Client</h4>
                    <p className="font-body text-sm font-bold text-[var(--text-primary)]">{project.client}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-body text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tech_stack.map((tech: string) => (
                      <TechBadge key={tech} name={tech} />
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <GlassCard className="p-8 text-center bg-[var(--bg-secondary)] border-stone-200">
                <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">Start your automation journey</h3>
                <p className="font-body text-sm text-[var(--text-muted)] mb-6">
                  Need something similar for your business? Let's talk about it.
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full bg-amber-500 text-black font-medium px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-150"
                >
                  Get a Quote
                </Link>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  )
}
