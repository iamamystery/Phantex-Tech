'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Syntax-highlighted code block with a copy button. Highlighting is a small,
// dependency-free tokenizer covering the languages we actually write about
// (python, ts/js, bash, sql, json). It is intentionally conservative: unknown
// languages render as plain (but still styled) text.
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  keyword: '#c792ea',
  string: '#c3e88d',
  comment: '#5c6370',
  number: '#f78c6c',
  function: '#82aaff',
  plain: '#d4d4d4',
} as const

const KEYWORDS: Record<string, string[]> = {
  python: ['def','class','return','if','elif','else','for','while','try','except','finally','with','as','import','from','async','await','yield','raise','in','not','and','or','is','None','True','False','lambda','pass','break','continue','global','nonlocal','assert','del','self'],
  javascript: ['const','let','var','function','return','if','else','for','while','try','catch','finally','await','async','class','extends','new','import','export','from','default','typeof','instanceof','this','null','undefined','true','false','of','in','throw','switch','case','break','continue'],
  typescript: ['const','let','var','function','return','if','else','for','while','try','catch','finally','await','async','class','extends','interface','type','enum','new','import','export','from','default','typeof','instanceof','this','null','undefined','true','false','of','in','throw','switch','case','break','continue','public','private','readonly','as','implements'],
  bash: ['if','then','else','fi','for','do','done','while','case','esac','function','return','export','echo','cd','sudo','source'],
  sql: ['select','from','where','insert','into','values','update','set','delete','create','table','alter','add','drop','index','primary','key','foreign','references','on','conflict','do','nothing','unique','not','null','and','or','order','by','group','limit','join','left','right','inner','partition','range','check','default','concurrently','using','enable','row','level','security','policy'],
}

const LINE_COMMENT: Record<string, string> = {
  python: '#',
  bash: '#',
  javascript: '//',
  typescript: '//',
  sql: '--',
}

interface Token {
  text: string
  type: keyof typeof COLORS
}

function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = []
  const keywords = new Set(KEYWORDS[lang] ?? [])
  const lineComment = LINE_COMMENT[lang]
  let i = 0
  const n = line.length

  while (i < n) {
    const rest = line.slice(i)

    // Line comments
    if (lineComment && rest.startsWith(lineComment)) {
      tokens.push({ text: rest, type: 'comment' })
      break
    }

    const ch = line[i]

    // Strings (single, double, backtick)
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1
      while (j < n && line[j] !== ch) {
        if (line[j] === '\\') j++
        j++
      }
      tokens.push({ text: line.slice(i, Math.min(j + 1, n)), type: 'string' })
      i = j + 1
      continue
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i
      while (j < n && /[0-9_.xXa-fA-F]/.test(line[j])) j++
      tokens.push({ text: line.slice(i, j), type: 'number' })
      i = j
      continue
    }

    // Identifiers / keywords
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i
      while (j < n && /[A-Za-z0-9_$]/.test(line[j])) j++
      const word = line.slice(i, j)
      const lower = lang === 'sql' ? word.toLowerCase() : word
      const isCall = line[j] === '('
      if (keywords.has(lower)) {
        tokens.push({ text: word, type: 'keyword' })
      } else if (isCall) {
        tokens.push({ text: word, type: 'function' })
      } else {
        tokens.push({ text: word, type: 'plain' })
      }
      i = j
      continue
    }

    // Everything else (punctuation / whitespace)
    tokens.push({ text: ch, type: 'plain' })
    i++
  }

  return tokens
}

export default function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  const language = (lang || '').toLowerCase()
  const known = language in KEYWORDS || language in LINE_COMMENT

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  const lines = code.replace(/\n$/, '').split('\n')

  return (
    <div
      className="group relative my-7 overflow-hidden rounded-2xl"
      style={{ background: '#0C0C0C', border: '1px solid #1f1f1f' }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: '1px solid #1a1a1a' }}
      >
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:bg-white/5 hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15V5a2 2 0 012-2h10" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed" style={{ color: COLORS.plain }}>
        <code className="font-mono">
          {lines.map((line, li) => (
            <span key={li} className="block min-h-[1.4em]">
              {known
                ? tokenizeLine(line, language).map((t, ti) => (
                    <span key={ti} style={{ color: COLORS[t.type] }}>
                      {t.text}
                    </span>
                  ))
                : line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
