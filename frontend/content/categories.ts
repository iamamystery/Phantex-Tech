import type { BlogCategory } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Categories registry. The order here is the order chips render in. Accent
// colours match the Phantex palette used across the site.
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES: BlogCategory[] = [
  {
    slug: 'ai-systems',
    name: 'AI Systems',
    description:
      'Designing multi-agent systems, retrieval pipelines, and LLM integrations that behave predictably under real production traffic.',
    accent: '#8b5cf6',
  },
  {
    slug: 'automation',
    name: 'Automation',
    description:
      'Workflow automation and browser orchestration that turns hours of manual work into reliable, scheduled jobs.',
    accent: '#f59e0b',
  },
  {
    slug: 'backend-engineering',
    name: 'Backend Engineering',
    description:
      'APIs, services, and the architectural patterns that keep backends maintainable as products and teams grow.',
    accent: '#3b82f6',
  },
  {
    slug: 'web-scraping',
    name: 'Web Scraping',
    description:
      'Scalable, resilient data extraction across hostile web environments — from single scripts to distributed fleets.',
    accent: '#22c55e',
  },
  {
    slug: 'data-engineering',
    name: 'Data Engineering',
    description:
      'Ingestion pipelines, schema design, and data infrastructure built to survive scale and failure.',
    accent: '#06b6d4',
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    description:
      'The platform layer — databases, caching, deployment, and the operational decisions that production demands.',
    accent: '#a855f7',
  },
  {
    slug: 'product-development',
    name: 'Product Development',
    description:
      'Shipping SaaS products end-to-end, from architecture decisions to launch, without accumulating crippling debt.',
    accent: '#6366f1',
  },
]

const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]))

export function getCategory(slug: string): BlogCategory | undefined {
  return CATEGORY_BY_SLUG.get(slug)
}

export function resolveCategory(slug: string): BlogCategory {
  return (
    CATEGORY_BY_SLUG.get(slug) ?? {
      slug: 'engineering',
      name: 'Engineering',
      description: 'Engineering articles from the Phantex team.',
      accent: '#f59e0b',
    }
  )
}
