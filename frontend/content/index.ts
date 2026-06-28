import type {
  Article,
  ResolvedArticle,
  ArticleSummary,
  BlogCategory,
  BlogTag,
} from './types'
import { ARTICLES } from './articles'
import { CATEGORIES, getCategory, resolveCategory } from './categories'
import { TAGS, resolveTag } from './tags'
import { AUTHORS, resolveAuthor } from './authors'
import { estimateReadingTime, countWords, formatDate } from './utils'

// ─────────────────────────────────────────────────────────────────────────────
// Public content API. Every page in the publication reads from these functions
// so there is a single source of truth and nothing 404s: every slug returned by
// a `*Slugs()` helper has a corresponding statically generated page.
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve an article's author/category and derive reading time, etc. */
export function resolveArticle(article: Article): ResolvedArticle {
  return {
    ...article,
    authorProfile: resolveAuthor(article.author),
    categoryProfile: resolveCategory(article.category),
    readingTime: estimateReadingTime(article.content),
    wordCount: countWords(article.content),
    formattedDate: formatDate(article.date),
  }
}

const RESOLVED: ResolvedArticle[] = ARTICLES.map(resolveArticle).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

const RESOLVED_BY_SLUG = new Map(RESOLVED.map((a) => [a.slug, a]))

export function getAllArticles(): ResolvedArticle[] {
  return RESOLVED
}

/** Strip the Markdown body — used when handing data to client components. */
export function toSummary(a: ResolvedArticle): ArticleSummary {
  const { content, ...rest } = a
  return rest
}

export function getAllSummaries(): ArticleSummary[] {
  return RESOLVED.map(toSummary)
}

export function getArticle(slug: string): ResolvedArticle | undefined {
  return RESOLVED_BY_SLUG.get(slug)
}

export function getArticleSlugs(): string[] {
  return RESOLVED.map((a) => a.slug)
}

export function getFeaturedArticle(): ResolvedArticle {
  return RESOLVED.find((a) => a.featured) ?? RESOLVED[0]
}

export function getEditorsPicks(limit = 3): ResolvedArticle[] {
  return RESOLVED.filter((a) => a.editorsPick).slice(0, limit)
}

/** Highest-popularity articles, used for the Trending rail. */
export function getTrending(limit = 5): ResolvedArticle[] {
  return [...RESOLVED]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

/** Most Read uses the same popularity seed but is a distinct, longer-lived rail. */
export function getMostRead(limit = 5): ResolvedArticle[] {
  return [...RESOLVED]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

export function getArticlesByCategory(categorySlug: string): ResolvedArticle[] {
  return RESOLVED.filter((a) => a.category === categorySlug)
}

export function getArticlesByTag(tagSlug: string): ResolvedArticle[] {
  return RESOLVED.filter((a) => a.tags.includes(tagSlug))
}

export function getArticlesByAuthor(authorSlug: string): ResolvedArticle[] {
  return RESOLVED.filter((a) => a.author === authorSlug)
}

/**
 * Related articles: same category first, then any article sharing a tag, ranked
 * by number of shared tags. Always returns up to `limit` items (never empty when
 * other articles exist) so the rail is never blank.
 */
export function getRelatedArticles(slug: string, limit = 3): ResolvedArticle[] {
  const current = RESOLVED_BY_SLUG.get(slug)
  if (!current) return RESOLVED.slice(0, limit)

  const scored = RESOLVED.filter((a) => a.slug !== slug).map((a) => {
    let score = 0
    if (a.category === current.category) score += 3
    score += a.tags.filter((t) => current.tags.includes(t)).length
    return { article: a, score }
  })

  scored.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score
    return new Date(y.article.date).getTime() - new Date(x.article.date).getTime()
  })

  return scored.slice(0, limit).map((s) => s.article)
}

/** Previous (older) and next (newer) article in chronological order. */
export function getAdjacentArticles(slug: string): {
  previous: ResolvedArticle | null
  next: ResolvedArticle | null
} {
  const index = RESOLVED.findIndex((a) => a.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    next: index > 0 ? RESOLVED[index - 1] : null,
    previous: index < RESOLVED.length - 1 ? RESOLVED[index + 1] : null,
  }
}

// ─── Categories & tags ──────────────────────────────────────────────────────

export function getCategories(): BlogCategory[] {
  return CATEGORIES
}

export function getCategoryWithCount(): (BlogCategory & { count: number })[] {
  return CATEGORIES.map((c) => ({
    ...c,
    count: getArticlesByCategory(c.slug).length,
  }))
}

/** Tags that are actually used by at least one article, with usage counts. */
export function getUsedTags(): (BlogTag & { count: number })[] {
  const counts = new Map<string, number>()
  for (const a of RESOLVED) {
    for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return TAGS.map((t) => ({ ...t, count: counts.get(t.slug) ?? 0 })).filter(
    (t) => t.count > 0
  )
}

export function getAllTagSlugs(): string[] {
  // Every registered tag gets a page; used tags are guaranteed non-empty.
  return TAGS.map((t) => t.slug)
}

export function getAuthorSlugs(): string[] {
  return AUTHORS.map((a) => a.slug)
}

export { CATEGORIES, TAGS, AUTHORS, getCategory, resolveCategory, resolveTag }
export { getAuthor } from './authors'
export { getTag } from './tags'
