import type { BlogAuthor } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Authors registry. Each author has a dedicated landing page at
// /blog/author/<slug>. Social links left as empty strings are simply not
// rendered — never a broken link.
// ─────────────────────────────────────────────────────────────────────────────

export const AUTHORS: BlogAuthor[] = [
  {
    slug: 'amir-karimi',
    name: 'Amir Karimi',
    initials: 'AK',
    role: 'Founder & Lead Engineer',
    expertise: 'AI Systems · Backend Architecture',
    bio: 'Leads technical strategy and system design. Specializes in AI integration, scalable infrastructure, and automation platforms.',
    longBio:
      'Amir founded Phantex Tech after a decade building backend and data platforms for high-growth startups. He leads technical strategy across every engagement, with a focus on AI system design, distributed architecture, and the unglamorous reliability work that keeps production systems alive. He believes most "AI problems" are actually data and systems problems wearing a costume.',
    tech: ['Python', 'FastAPI', 'LLMs', 'PostgreSQL'],
    twitter: '',
    linkedin: '',
    github: '',
  },
  {
    slug: 'zara-malik',
    name: 'Zara Malik',
    initials: 'ZM',
    role: 'Backend Engineer',
    expertise: 'APIs · Database Design',
    bio: 'Backend specialist focused on designing APIs and data models that support high-growth product teams without technical debt.',
    longBio:
      'Zara designs the APIs and data models that sit under Phantex client products. Her work centres on the decisions made at v1 that determine whether v2 is an evolution or a rewrite — schema design, indexing strategy, contract versioning, and the careful boundaries that let a product team move fast without accumulating crippling debt.',
    tech: ['Django', 'FastAPI', 'PostgreSQL', 'Redis'],
    twitter: '',
    linkedin: '',
    github: '',
  },
  {
    slug: 'leo-chen',
    name: 'Leo Chen',
    initials: 'LC',
    role: 'Automation Engineer',
    expertise: 'Browser Automation · Data Pipelines',
    bio: 'Builds scraping infrastructure and automation systems that operate reliably at scale across complex web environments.',
    longBio:
      'Leo builds the scraping and automation infrastructure that quietly powers a lot of Phantex client operations. He has spent years on the unforgiving edge of browser automation — anti-bot systems, session management, and the kind of distributed orchestration that turns a flaky single-machine script into a system that processes hundreds of thousands of records a day.',
    tech: ['Playwright', 'Selenium', 'Python', 'Docker'],
    twitter: '',
    linkedin: '',
    github: '',
  },
  {
    slug: 'priya-nair',
    name: 'Priya Nair',
    initials: 'PN',
    role: 'AI Systems Engineer',
    expertise: 'AI Agents · LLM Integration',
    bio: 'Designs and implements AI agent workflows, RAG pipelines, and LLM integrations for production SaaS products.',
    longBio:
      'Priya designs the AI agent workflows, retrieval pipelines, and LLM integrations that ship inside Phantex client products. Her focus is the gap between an impressive demo and a system that behaves predictably for real users — evaluation harnesses, tool-use design, memory layers, and the guardrails that keep generative systems from going off the rails in production.',
    tech: ['Claude', 'LangGraph', 'pgvector', 'Python'],
    twitter: '',
    linkedin: '',
    github: '',
  },
]

const AUTHOR_BY_SLUG = new Map(AUTHORS.map((a) => [a.slug, a]))

export function getAuthor(slug: string): BlogAuthor | undefined {
  return AUTHOR_BY_SLUG.get(slug)
}

/** Safe resolver — falls back to a neutral team profile so rendering never breaks. */
export function resolveAuthor(slug: string): BlogAuthor {
  return (
    AUTHOR_BY_SLUG.get(slug) ?? {
      slug: 'phantex-engineering',
      name: 'Phantex Engineering',
      initials: 'PE',
      role: 'Engineering Team',
      expertise: 'Engineering',
      bio: 'The Phantex engineering team.',
      longBio: 'Articles written collaboratively by the Phantex engineering team.',
      tech: [],
      twitter: '',
      linkedin: '',
      github: '',
    }
  )
}
