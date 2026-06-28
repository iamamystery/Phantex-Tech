import type { TocEntry } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers used to derive reading time, word counts, table of contents, and
// heading anchors from Markdown article bodies. Kept dependency-free so they run
// identically on the server (RSC) and client.
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a heading's text into a stable, URL-safe anchor id. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Strip fenced code blocks so their contents never leak into word counts or the
 * table of contents.
 */
function stripCodeFences(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, ' ')
}

export function countWords(markdown: string): number {
  const text = stripCodeFences(markdown)
    .replace(/[#>*_`~\-]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return 0
  return text.split(' ').length
}

/** Reading time in minutes at ~220 wpm, with a sane floor of 1. */
export function estimateReadingTime(markdown: string): number {
  return Math.max(1, Math.round(countWords(markdown) / 220))
}

/**
 * Extract h2/h3 headings for the table of contents. Headings inside fenced code
 * blocks are ignored. Anchor ids are de-duplicated so repeated headings still
 * scroll correctly.
 */
export function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split('\n')
  const entries: TocEntry[] = []
  const seen = new Map<string, number>()
  let inFence = false

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.*)$/.exec(line)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = match[2].replace(/`/g, '').trim()
    let id = slugifyHeading(text)

    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    if (count > 0) id = `${id}-${count}`

    entries.push({ id, text, level })
  }

  return entries
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
