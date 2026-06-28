import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import CodeBlock from './CodeBlock'
import { slugifyHeading } from '@/content/utils'

// ─────────────────────────────────────────────────────────────────────────────
// A small, dependency-free Markdown renderer tuned for the publication. It is a
// server component: it parses the Markdown body to React elements at build time
// and embeds the client-side CodeBlock for code. Heading ids match exactly the
// ids produced by extractToc(), so the table of contents anchors line up.
//
// Supported: ## / ### headings, fenced code blocks, GitHub-style callouts
// (> [!NOTE|TIP|WARNING]), blockquotes, ordered/unordered lists, ---, and inline
// bold / italic / `code` / [links](url).
// ─────────────────────────────────────────────────────────────────────────────

const CALLOUTS = {
  NOTE: { label: 'Note', color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.25)' },
  TIP: { label: 'Tip', color: '#22c55e', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.25)' },
  WARNING: { label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.28)' },
} as const

type CalloutKind = keyof typeof CALLOUTS

// ─── Inline parsing ───────────────────────────────────────────────────────────

let inlineKey = 0

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // Priority: inline code, links, bold, italic.
  const pattern =
    /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/
  let remaining = text

  while (remaining.length > 0) {
    const match = pattern.exec(remaining)
    if (!match) {
      nodes.push(remaining)
      break
    }
    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index))
    }
    const token = match[0]

    if (token.startsWith('`')) {
      nodes.push(
        <code
          key={inlineKey++}
          className="rounded-md px-1.5 py-0.5 font-mono text-[0.85em]"
          style={{ background: 'rgba(245,158,11,0.10)', color: '#B45309', border: '1px solid rgba(245,158,11,0.18)' }}
        >
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith('[')) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token)!
      const [, label, href] = linkMatch
      const internal = href.startsWith('/')
      if (internal) {
        nodes.push(
          <Link key={inlineKey++} href={href} className="font-medium text-amber-600 underline decoration-amber-300 underline-offset-2 transition-colors hover:text-amber-700">
            {label}
          </Link>
        )
      } else {
        nodes.push(
          <a key={inlineKey++} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-600 underline decoration-amber-300 underline-offset-2 transition-colors hover:text-amber-700">
            {label}
          </a>
        )
      }
    } else if (token.startsWith('**')) {
      nodes.push(
        <strong key={inlineKey++} className="font-bold text-[#111111]">
          {parseInline(token.slice(2, -2))}
        </strong>
      )
    } else {
      // *italic* or _italic_
      nodes.push(
        <em key={inlineKey++} className="italic">
          {parseInline(token.slice(1, -1))}
        </em>
      )
    }

    remaining = remaining.slice(match.index + token.length)
  }

  return nodes
}

// ─── Block parsing ────────────────────────────────────────────────────────────

export default function Markdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  const headingSeen = new Map<string, number>()
  let i = 0
  let key = 0

  const headingId = (text: string): string => {
    let id = slugifyHeading(text)
    const count = headingSeen.get(id) ?? 0
    headingSeen.set(id, count + 1)
    if (count > 0) id = `${id}-${count}`
    return id
  }

  while (i < lines.length) {
    const line = lines[i]

    // Blank line
    if (line.trim() === '') {
      i++
      continue
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // closing fence
      blocks.push(<CodeBlock key={key++} code={codeLines.join('\n')} lang={lang} />)
      continue
    }

    // Headings (h2 / h3)
    const headingMatch = /^(#{2,3})\s+(.*)$/.exec(line)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = headingId(text)
      if (level === 2) {
        blocks.push(
          <h2
            key={key++}
            id={id}
            className="group scroll-mt-28 font-display text-[28px] md:text-[32px] font-black tracking-tight text-[#111111] mt-14 mb-5"
          >
            <a href={`#${id}`} className="no-underline">
              {parseInline(text)}
              <span className="ml-2 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">#</span>
            </a>
          </h2>
        )
      } else {
        blocks.push(
          <h3
            key={key++}
            id={id}
            className="group scroll-mt-28 font-display text-[21px] md:text-[23px] font-bold tracking-tight text-[#111111] mt-10 mb-4"
          >
            <a href={`#${id}`} className="no-underline">
              {parseInline(text)}
              <span className="ml-2 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">#</span>
            </a>
          </h3>
        )
      }
      i++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-10 border-0 border-t" style={{ borderColor: '#EDEAE4' }} />)
      i++
      continue
    }

    // Blockquote / callout
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      const first = quoteLines[0] ?? ''
      const calloutMatch = /^\[!(NOTE|TIP|WARNING)\]\s*$/.exec(first)
      if (calloutMatch) {
        const kind = calloutMatch[1] as CalloutKind
        const c = CALLOUTS[kind]
        const body = quoteLines.slice(1).join(' ').trim()
        blocks.push(
          <div
            key={key++}
            className="my-7 rounded-2xl p-5"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: c.color }}>
                {c.label}
              </span>
            </div>
            <p className="font-body text-[15px] leading-relaxed text-[#333333]">{parseInline(body)}</p>
          </div>
        )
      } else {
        const body = quoteLines.join(' ').trim()
        blocks.push(
          <blockquote
            key={key++}
            className="my-7 border-l-[3px] pl-5 font-body text-[17px] italic leading-relaxed text-stone-600"
            style={{ borderColor: '#F59E0B' }}
          >
            {parseInline(body)}
          </blockquote>
        )
      }
      continue
    }

    // Unordered list
    if (/^[-*]\s+/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={key++} className="my-5 space-y-2.5 pl-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex gap-3 font-body text-[17px] leading-relaxed text-[#333333]">
              <span className="mt-[10px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: '#F59E0B' }} aria-hidden="true" />
              <span>{parseInline(it)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push(
        <ol key={key++} className="my-5 space-y-2.5 pl-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex gap-3 font-body text-[17px] leading-relaxed text-[#333333]">
              <span className="mt-0.5 font-mono text-sm font-bold text-amber-500">{idx + 1}.</span>
              <span>{parseInline(it)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Paragraph (gather consecutive non-empty, non-special lines)
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^(#{2,3})\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    blocks.push(
      <p key={key++} className="my-5 font-body text-[17px] leading-[1.75] text-[#333333]">
        {parseInline(paraLines.join(' '))}
      </p>
    )
  }

  return <Fragment>{blocks}</Fragment>
}
