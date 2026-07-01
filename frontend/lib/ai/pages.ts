// Single source of truth for the site's top-level pages the AI assistant is
// allowed to link to. Add a page here and it's automatically: (1) taught to
// the model via the system prompt, and (2) accepted as a valid action url by
// parseAIResponse. No chat component ever hardcodes a page/label pair.

export interface SitePage {
  url: string
  label: string
  description: string
}

export const SITE_PAGES: SitePage[] = [
  { url: '/about', label: 'About Phantex', description: 'company, leadership, founder, CEO, CTO, mission, story' },
  { url: '/services', label: 'View Services', description: 'AI systems, automation, backend, APIs, SaaS — what we do' },
  { url: '/work', label: 'View Our Work', description: 'portfolio, projects, case studies, previous work' },
  { url: '/blog', label: 'Read Our Blog', description: 'articles, guides, tutorials, insights' },
  { url: '/resources', label: 'Browse Resources', description: 'downloadable guides, playbooks, templates' },
  { url: '/contact', label: 'Contact Us', description: 'quotes, consultations, meetings, hiring, getting started' },
]

export const SITE_PAGE_URLS = new Set(SITE_PAGES.map((p) => p.url))

export function formatSitePagesForPrompt(): string {
  return SITE_PAGES.map((p) => `- ${p.url} → "${p.label}" (${p.description})`).join('\n')
}
