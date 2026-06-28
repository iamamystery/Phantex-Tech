// ─────────────────────────────────────────────────────────────────────────────
// Content layer types
//
// The Phantex engineering publication is driven by a typed, file-based content
// layer (this directory). Articles are authored in Markdown and rendered by the
// custom renderer in components/blog/Markdown.tsx. Everything is statically
// generated, so no route ever 404s and no running backend is required.
// ─────────────────────────────────────────────────────────────────────────────

/** A category groups articles by engineering discipline. */
export interface BlogCategory {
  /** Stable identifier used in URLs: /blog/category/<slug> */
  slug: string
  /** Display name, e.g. "Backend Engineering" */
  name: string
  /** One-line description shown on the category landing page. */
  description: string
  /** Accent colour used for badges and category covers. */
  accent: string
}

/** A tag is a lightweight, cross-cutting topic label. */
export interface BlogTag {
  slug: string
  name: string
}

/** An author profile. Authors get their own landing page. */
export interface BlogAuthor {
  slug: string
  name: string
  /** Two-letter monogram used where avatars are not available. */
  initials: string
  role: string
  /** Short expertise summary, e.g. "AI Systems · Backend Architecture". */
  expertise: string
  bio: string
  /** Longer biography shown on the author landing page. */
  longBio: string
  tech: string[]
  /** Social links — empty string means "not provided" (no broken links rendered). */
  twitter: string
  linkedin: string
  github: string
}

/**
 * A blog article. The body lives in `content` as Markdown. Reading time and the
 * table of contents are derived automatically, so they never drift from the
 * actual text.
 */
export interface Article {
  slug: string
  title: string
  /** Sub-headline shown under the title on the article page. */
  subtitle: string
  excerpt: string
  /** Author slug — resolved against the authors registry. */
  author: string
  /** Category slug — resolved against the categories registry. */
  category: string
  /** Tag slugs — resolved against the tags registry. */
  tags: string[]
  /** ISO date (YYYY-MM-DD). */
  date: string
  /** Hand-set when an article should be pinned to the top hero. */
  featured?: boolean
  /** Editorial flag — surfaces the piece in the "Editor's Picks" rail. */
  editorsPick?: boolean
  /** Seed popularity used to order Trending / Most Read deterministically. */
  popularity: number
  /** Markdown body. */
  content: string
}

/** An article enriched with its resolved author/category/derived fields. */
export interface ResolvedArticle extends Article {
  authorProfile: BlogAuthor
  categoryProfile: BlogCategory
  /** Estimated reading time in minutes, derived from the body. */
  readingTime: number
  /** Word count, derived from the body. */
  wordCount: number
  /** Human-formatted date, e.g. "Jun 12, 2025". */
  formattedDate: string
}

/**
 * An article without its (large) Markdown body — the shape passed to client
 * components for listings, search, and cards, so article bodies never bloat the
 * client payload.
 */
export type ArticleSummary = Omit<ResolvedArticle, 'content'>

/** A single entry in an article's table of contents. */
export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

// ─── Case studies ─────────────────────────────────────────────────────────────

export interface CaseStudySection {
  heading: string
  /** Markdown body for the section. */
  body: string
}

export interface CaseStudy {
  slug: string
  client: string
  tag: string
  category: string
  title: string
  summary: string
  /** Headline metric, e.g. "6 Hours". */
  metric: string
  /** Metric caption, e.g. "Saved Per Analyst Weekly". */
  metricLabel: string
  date: string
  duration: string
  stack: string[]
  /** Bulleted outcome metrics shown in the results panel. */
  outcomes: { value: string; label: string }[]
  problem: string
  architecture: string
  solution: string
  challenges: string
  results: string
  lessons: string
}

// ─── Resources (downloadable guides) ───────────────────────────────────────────

export interface ResourceSection {
  heading: string
  /** Paragraphs of body copy. */
  paragraphs: string[]
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[]
}

export interface Resource {
  slug: string
  title: string
  subtitle: string
  description: string
  /** "PDF Guide" | "PDF Checklist" | "PDF Blueprint" etc. */
  format: string
  pages: number
  version: string
  /** ISO date the resource was last updated. */
  updated: string
  tags: string[]
  /** Author slug. */
  author: string
  /** The structured document used both for the preview and the generated PDF. */
  document: {
    title: string
    subtitle: string
    sections: ResourceSection[]
  }
}
