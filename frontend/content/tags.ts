import type { BlogTag } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Tags registry. Tags are cross-cutting topic labels. Every tag listed here is
// guaranteed a working /blog/tag/<slug> page (even if no article uses it yet,
// the page renders an empty state rather than 404ing).
// ─────────────────────────────────────────────────────────────────────────────

export const TAGS: BlogTag[] = [
  { slug: 'fastapi', name: 'FastAPI' },
  { slug: 'django', name: 'Django' },
  { slug: 'python', name: 'Python' },
  { slug: 'automation', name: 'Automation' },
  { slug: 'ai-agents', name: 'AI Agents' },
  { slug: 'playwright', name: 'Playwright' },
  { slug: 'selenium', name: 'Selenium' },
  { slug: 'supabase', name: 'Supabase' },
  { slug: 'postgresql', name: 'PostgreSQL' },
  { slug: 'apis', name: 'APIs' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'data-engineering', name: 'Data Engineering' },
  { slug: 'llms', name: 'LLMs' },
  { slug: 'infrastructure', name: 'Infrastructure' },
  { slug: 'rag', name: 'RAG' },
  { slug: 'event-driven', name: 'Event-Driven' },
  { slug: 'rest', name: 'REST' },
  { slug: 'scaling', name: 'Scaling' },
  { slug: 'redis', name: 'Redis' },
  { slug: 'testing', name: 'Testing' },
]

const TAG_BY_SLUG = new Map(TAGS.map((t) => [t.slug, t]))

export function getTag(slug: string): BlogTag | undefined {
  return TAG_BY_SLUG.get(slug)
}

export function resolveTag(slug: string): BlogTag {
  return TAG_BY_SLUG.get(slug) ?? { slug, name: slug.replace(/-/g, ' ') }
}
