import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'
import { getProjects } from '@/lib/api'
import { getMediaUrl } from '@/lib/utils'
import TechBadge from '@/components/ui/TechBadge'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'

const SERVICE_LABELS: Record<string, string> = {
  scraping: 'Web Scraping',
  automation: 'Browser Automation',
  backend: 'Backend',
  frontend: 'Frontend',
  api: 'API Integration',
  ai: 'AI Integration',
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const thumbUrl = getMediaUrl(project.thumbnail)

  return (
    <FadeIn delay={index * 0.1} className="h-full">
      <Link
        href={`/work/${project.slug}`}
        className="group flex flex-col h-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
        aria-label={`View case study: ${project.title}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-stone-800">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              quality={85}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-amber-500/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/10" />
              </div>
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-300" />
          {/* Service tag */}
          <div className="absolute top-4 left-4">
            <span className="font-body text-xs font-medium px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-amber-400 border border-amber-500/20">
              {SERVICE_LABELS[project.service_type] ?? project.service_type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors duration-150">
            {project.title}
          </h3>
          <p className="font-body text-sm text-stone-400 leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Stack badges */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs bg-stone-800 border border-stone-700 text-stone-400 px-2.5 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="font-mono text-xs text-stone-500 px-2 py-1">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </FadeIn>
  )
}

export default async function FeaturedWork() {
  let projects: Project[] = []
  try {
    const data = await getProjects()
    projects = data.results.filter((p) => p.is_featured).slice(0, 3)
  } catch {
    // API unavailable — section omitted gracefully
  }

  if (projects.length === 0) return null

  return (
    <section className="pt-12 pb-10 bg-stone-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <FadeIn>
            <SectionHeader
              label="Our Work"
              title="Projects that ship and actually work"
              dark
            />
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/work"
              className="font-body text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              View all projects
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
