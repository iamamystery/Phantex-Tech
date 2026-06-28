'use client'

import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import CodeBlock from '@/components/blog/CodeBlock'

// ─────────────────────────────────────────────────────────────────────────────
// Chat-tuned Markdown renderer. Shares the publication's dependency-free approach
// (see components/blog/Markdown.tsx) but is sized for conversational bubbles and
// adds GitHub-style table support. Reuses the blog CodeBlock for fenced code so
// copy-to-clipboard + syntax highlighting stay consistent across the site.
//
// Supported: ## / ### headings, fenced code, blockquotes, ordered / unordered
// lists, tables, ---, and inline bold / italic / `code` / [links](url).
// ─────────────────────────────────────────────────────────────────────────────

let inlineKey = 0

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern =
    /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/
  let remaining = text

  while (remaining.length > 0) {
    const match = pattern.exec(remaining)
    if (!match) {
      nodes.push(remaining)
      break
    }
    if (match.index > 0) nodes.push(remaining.slice(0, match.index))
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
        <strong key={inlineKey++} className="font-semibold text-[#0F0F0F]">
          {parseInline(token.slice(2, -2))}
        </strong>
      )
    } else {
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

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

const isTableSeparator = (line: string) =>
  /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line)

export default function ChatMarkdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    // Fenced code block (handles an unclosed fence gracefully while streaming)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // closing fence (if present)
      blocks.push(<CodeBlock key={key++} code={codeLines.join('\n')} lang={lang} />)
      continue
    }

    // Table: a pipe row immediately followed by a separator row
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push(
        <div key={key++} className="my-4 overflow-x-auto rounded-xl border border-[#E7E5E4]">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-[#FFF7ED]">
                {header.map((h, hi) => (
                  <th key={hi} className="border-b border-[#E7E5E4] px-4 py-2.5 font-display text-[13px] font-bold text-[#0F0F0F]">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="even:bg-[#FAFAF8]">
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-[#F0EEEA] px-4 py-2.5 align-top text-[#44403C] last:border-0">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Headings
    const headingMatch = /^(#{2,4})\s+(.*)$/.exec(line)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const cls =
        level === 2
          ? 'font-display text-[19px] font-bold text-[#0F0F0F] mt-5 mb-2.5'
          : 'font-display text-[16px] font-bold text-[#0F0F0F] mt-4 mb-2'
      blocks.push(
        <p key={key++} className={cls}>
          {parseInline(text)}
        </p>
      )
      i++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-5 border-0 border-t border-[#EDEAE4]" />)
      i++
      continue
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-4 border-l-[3px] border-amber-400 pl-4 text-[15px] italic leading-relaxed text-stone-600"
        >
          {parseInline(quoteLines.join(' ').trim())}
        </blockquote>
      )
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
        <ul key={key++} className="my-3 space-y-2 pl-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex gap-2.5 text-[15px] leading-relaxed text-[#44403C]">
              <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
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
        <ol key={key++} className="my-3 space-y-2 pl-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex gap-2.5 text-[15px] leading-relaxed text-[#44403C]">
              <span className="mt-0.5 font-mono text-[13px] font-bold text-amber-500">{idx + 1}.</span>
              <span>{parseInline(it)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Paragraph
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^(#{2,4})\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim()) &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    if (paraLines.length > 0) {
      blocks.push(
        <p key={key++} className="my-2.5 text-[15px] leading-[1.7] text-[#44403C] first:mt-0 last:mb-0">
          {parseInline(paraLines.join(' '))}
        </p>
      )
    }
  }

  return <Fragment>{blocks}</Fragment>
}
