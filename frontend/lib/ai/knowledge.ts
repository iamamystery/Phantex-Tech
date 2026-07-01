import { FEATURED_PROJECT, PROJECTS } from '@/components/home/FeaturedWork'
import { getAllArticles } from '@/content'
import { getCaseStudies } from '@/content/case-studies'
import { getResources } from '@/content/resources'

// ─────────────────────────────────────────────────────────────────────────────
// Phantex AI knowledge layer.
//
// The chat assistant retrieves context from THIS module before answering, and
// this module reads the same source-of-truth content that powers the website
// (portfolio projects, case studies, blog articles, downloadable resources).
// Add a project/article/resource to the site and the assistant can answer about
// it automatically — no prompt edits required.
//
// Retrieval is a lightweight, dependency-free keyword scorer (no vector DB),
// which is plenty for this corpus size and keeps responses fast and grounded.
// ─────────────────────────────────────────────────────────────────────────────

export interface KnowledgeDoc {
  id: string
  title: string
  kind: 'project' | 'case-study' | 'article' | 'resource' | 'service' | 'page'
  url?: string
  keywords: string[]
  text: string
}

// ── Core, always-included facts (identity / leadership / booking / rules) ─────
export const CORE_FACTS = `COMPANY:
Phantex Tech (phantextech.com) is a premium software engineering company that builds AI systems, backend infrastructure, automation, and intelligent software for ambitious companies.

LEADERSHIP:
- Jawad Ahmad — Founder & Chief Executive Officer (CEO). Leads company vision, business strategy, engineering direction, product development, and client relationships.
- Awais — Chief Technology Officer (CTO). Leads technical architecture, AI systems, backend engineering, automation infrastructure, and technical execution.
Do not invent any other leaders or team members.

SERVICES: AI Integration & Pipelines, AI Automation, Browser Automation, Web Scraping, Backend Development, Frontend Development, API Integrations, Custom Software Development.

SITE NAVIGATION: Home (/), Studio/Services (/services), Work/Portfolio (/work), About (/about), Blog (/blog), Resources (/resources), Contact (/contact), AI Chat (/chat).

PRICING: Projects are scoped individually — never quote fixed prices. The inquiry form offers budget ranges (Under $5,000; $5k–$10k; $10k–$20k; $20k+) you may reference, but never as quotes.

BOOKING: There is NO /schedule page — never mention it. Say: "You can click the 'Book a Call' button available throughout the website or submit the Contact form. Our team typically responds within one business day." If the user says they're on the Contact page, instead say: "Complete the project inquiry form below and our team will get back to you within one business day."`

const SERVICES: { name: string; text: string }[] = [
  { name: 'AI Integration & Pipelines', text: 'LLM integration, RAG pipelines, and AI workflows embedded into your product.' },
  { name: 'AI Automation', text: 'Automating decisions and workflows with AI agents and intelligent pipelines.' },
  { name: 'Browser Automation', text: 'End-to-end automation of browser workflows: form submissions, data entry, scheduled tasks, monitoring.' },
  { name: 'Web Scraping', text: 'Structured data extraction at scale, handling JS rendering, anti-bot measures, and dynamic content.' },
  { name: 'Backend Development', text: 'Scalable REST/GraphQL APIs, microservices, and database design with Python (Django/FastAPI) and Node.js.' },
  { name: 'Frontend Development', text: 'Fast, SEO-optimised frontends with Next.js and React — landing pages, dashboards, admin panels.' },
  { name: 'API Integrations', text: 'Connecting systems via third-party APIs, webhooks, OAuth flows, and data transformation pipelines.' },
  { name: 'Custom Software Development', text: 'Bespoke, production-grade software built to scale around your specific business problem.' },
]

// ── Build the knowledge base from the live website content (memoised) ─────────
let CACHE: KnowledgeDoc[] | null = null

export function buildKnowledgeBase(): KnowledgeDoc[] {
  if (CACHE) return CACHE
  const docs: KnowledgeDoc[] = []

  // Portfolio projects (source of truth for the Work section)
  const projects = [FEATURED_PROJECT, ...PROJECTS]
  for (const p of projects) {
    const subtitle = 'subtitle' in p && p.subtitle ? `${p.subtitle}. ` : ''
    docs.push({
      id: `project-${p.slug}`,
      title: p.title,
      kind: 'project',
      url: p.href,
      keywords: [p.title, p.slug, p.category, ...p.stack],
      text: `${p.title} — ${subtitle}Category/Industry: ${p.category}. Impact: ${p.impact} Description: ${p.description} Technologies: ${p.stack.join(', ')}. Live demo: ${p.href}`,
    })
  }

  // Client case studies
  for (const c of getCaseStudies()) {
    docs.push({
      id: `case-${c.slug}`,
      title: c.title,
      kind: 'case-study',
      url: `/blog/case-studies/${c.slug}`,
      keywords: [c.title, c.client, c.category, c.tag, ...c.stack],
      text: `Case study "${c.title}" for ${c.client} (${c.category}). ${c.summary} Key result: ${c.metric} ${c.metricLabel}. Duration: ${c.duration}. Stack: ${c.stack.join(', ')}. Problem: ${c.problem} Solution: ${c.solution} Results: ${c.results}`,
    })
  }

  // Blog articles
  for (const a of getAllArticles()) {
    docs.push({
      id: `article-${a.slug}`,
      title: a.title,
      kind: 'article',
      url: `/blog/${a.slug}`,
      keywords: [a.title, a.category, ...a.tags],
      text: `Blog article "${a.title}"${a.subtitle ? ` — ${a.subtitle}` : ''}. Category: ${a.category}. Tags: ${a.tags.join(', ')}. ${a.excerpt} ${a.content.slice(0, 350).replace(/\s+/g, ' ')}`,
    })
  }

  // Downloadable resources
  for (const r of getResources()) {
    docs.push({
      id: `resource-${r.slug}`,
      title: r.title,
      kind: 'resource',
      url: `/resources/${r.slug}`,
      keywords: [r.title, r.format, ...r.tags],
      text: `Downloadable resource "${r.title}" (${r.format}, ${r.pages} pages). ${r.subtitle} ${r.description}`,
    })
  }

  // Services
  for (const s of SERVICES) {
    docs.push({
      id: `service-${s.name}`,
      title: s.name,
      kind: 'service',
      url: '/services',
      keywords: [s.name],
      text: `Service — ${s.name}: ${s.text}`,
    })
  }

  CACHE = docs
  return docs
}

// ── Retrieval ─────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'you', 'your', 'our', 'with', 'what', 'who', 'how',
  'can', 'does', 'about', 'tell', 'have', 'has', 'this', 'that', 'from', 'they',
  'their', 'them', 'whats', 'phantex', 'tech', 'project', 'projects',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
}

function scoreDoc(doc: KnowledgeDoc, queryTokens: string[], normalizedQuery: string): number {
  const title = doc.title.toLowerCase()
  const keywords = doc.keywords.join(' ').toLowerCase()
  const body = doc.text.toLowerCase()
  let score = 0

  for (const tok of queryTokens) {
    if (title.includes(tok)) score += 6
    if (keywords.includes(tok)) score += 4
    if (body.includes(tok)) score += 1
  }
  // Phrase bonus: full multi-word query appearing verbatim (e.g. "kingdom x")
  if (normalizedQuery.length >= 4 && (title.includes(normalizedQuery) || body.includes(normalizedQuery))) {
    score += 8
  }
  return score
}

// Listing-intent: "what projects do you have", "your services", etc. should
// surface a whole category rather than rely on per-document keyword matches.
const INTENTS: { re: RegExp; kind: KnowledgeDoc['kind']; cap: number }[] = [
  { re: /\b(portfolio|projects?|work|case stud(y|ies)|built|clients?)\b/, kind: 'project', cap: 12 },
  { re: /\b(case stud(y|ies))\b/, kind: 'case-study', cap: 12 },
  { re: /\b(services?|offer|do you (do|build|make)|capabilities|expertise)\b/, kind: 'service', cap: 12 },
  { re: /\b(blogs?|articles?|posts?|write|writing|read)\b/, kind: 'article', cap: 8 },
  { re: /\b(resources?|downloads?|guides?|playbooks?|ebooks?|whitepapers?|templates?)\b/, kind: 'resource', cap: 12 },
]

export function formatDoc(doc: KnowledgeDoc): string {
  const link = doc.url ? ` (${doc.url})` : ''
  return `[${doc.kind}: ${doc.title}]${link}\n${doc.text}`
}

/**
 * Return the most relevant website documents for `query`. Combines
 * category-listing intent (e.g. "your projects") with per-document keyword
 * scoring. Empty array when nothing is relevant — the caller then relies on
 * CORE_FACTS and the model says information isn't publicly available rather
 * than guessing.
 */
export function retrieveDocs(query: string, k = 6): KnowledgeDoc[] {
  const base = buildKnowledgeBase()
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const queryTokens = Array.from(new Set(tokenize(query)))

  const selected = new Map<string, KnowledgeDoc>()

  // 1) Category-listing intent — include the whole (capped) category.
  for (const { re, kind, cap } of INTENTS) {
    if (re.test(normalizedQuery)) {
      base.filter((d) => d.kind === kind).slice(0, cap).forEach((d) => selected.set(d.id, d))
    }
  }

  // 2) Per-document keyword scoring — top matches for specific questions.
  if (queryTokens.length > 0) {
    base
      .map((doc) => ({ doc, score: scoreDoc(doc, queryTokens, normalizedQuery) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .forEach((r) => selected.set(r.doc.id, r.doc))
  }

  // Keep the context bounded.
  return Array.from(selected.values()).slice(0, 14)
}

/** Formatted context block for the system prompt. See retrieveDocs for selection logic. */
export function retrieveContext(query: string, k = 6): string {
  return retrieveDocs(query, k).map(formatDoc).join('\n\n')
}
