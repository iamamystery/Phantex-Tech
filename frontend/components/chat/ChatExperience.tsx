'use client'

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ChatMarkdown from './ChatMarkdown'
import ActionButtons from './ActionButtons'
import type { ChatAction } from '@/lib/ai/types'

// ─────────────────────────────────────────────────────────────────────────────
// Phantex AI — the /chat workspace. A fully functional premium chat experience
// built on the existing Phantex design language (amber / black / white, Syne +
// DM Sans, glass + rounded cards, framer-motion micro-interactions). Talks to the
// Django backend at `${NEXT_PUBLIC_API_URL}/chat/message/` and reveals replies
// with a smooth client-side stream. Markdown / code / tables render via
// ChatMarkdown. Conversation persists for the browser session.
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
  actions?: ChatAction[]
}

const STORAGE_KEY = 'phantex-chat-session'
const ERROR_MESSAGE =
  "I couldn't reach the engine just now. Please try again in a moment — or [book a call](/contact) and our team will jump in directly."

const WELCOME = `Welcome to **Phantex AI** — your AI Engineering Consultant.

I can help you estimate projects, recommend technology stacks, explain our services, design architectures, plan AI systems, automate workflows, answer technical questions, and book a consultation.

How can I help today?`

const QUICK_PROMPTS = [
  { icon: 'cost', label: 'Estimate my SaaS MVP cost', prompt: 'Estimate the cost of building my SaaS MVP. Walk me through what drives the price.' },
  { icon: 'roadmap', label: 'Build my AI roadmap', prompt: 'Help me build an AI roadmap for my product. What should I prioritise first?' },
  { icon: 'stack', label: 'Recommend a backend architecture', prompt: 'Recommend a backend architecture for a data-heavy SaaS product.' },
  { icon: 'bolt', label: 'Explain your automation services', prompt: 'Explain your automation services and what kinds of workflows you can automate.' },
  { icon: 'compare', label: 'Compare FastAPI vs Django', prompt: 'Compare FastAPI vs Django for building a production API. Use a table.' },
  { icon: 'scrape', label: 'How much does web scraping cost?', prompt: 'How much does a web scraping project cost, and what affects the price?' },
  { icon: 'call', label: 'Book a consultation', prompt: 'I’d like to book a consultation. How do we get started?' },
] as const

const CAPABILITIES = [
  'AI Systems',
  'Automation',
  'Backend Development',
  'Web Scraping',
  'API Integration',
  'SaaS Development',
  'Architecture Reviews',
  'Project Estimation',
] as const

const FAQS = [
  'How much does an MVP cost?',
  'How long does SaaS development take?',
  'Do you build AI agents?',
  'Can you integrate OpenAI?',
  'Can you automate browser workflows?',
] as const

// ─── Small inline icons ─────────────────────────────────────────────────────
function PromptIcon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'cost':
      return <svg {...common}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    case 'roadmap':
      return <svg {...common}><path d="M3 12h4l3-9 4 18 3-9h4" /></svg>
    case 'stack':
      return <svg {...common}><path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
    case 'bolt':
      return <svg {...common}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>
    case 'compare':
      return <svg {...common}><path d="M8 3v18M16 3v18M3 8h5M16 8h5M3 16h5M16 16h5" /></svg>
    case 'scrape':
      return <svg {...common}><path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h12v4H3z" /></svg>
    case 'call':
      return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
    default:
      return null
  }
}

// ─── Message bubble (memoised so streaming ticks don't re-render history) ─────
const MessageBubble = memo(function MessageBubble({
  message,
  animate,
}: {
  message: Message
  animate: boolean
}) {
  const isUser = message.role === 'user'
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {}

  return (
    <motion.div
      {...motionProps}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <Avatar />}
      <div
        className={
          isUser
            ? 'max-w-[85%] rounded-2xl rounded-br-md border border-amber-200/70 bg-[#FFF7ED] px-4 py-2.5 text-[15px] leading-relaxed text-[#0F0F0F] shadow-sm'
            : 'max-w-[88%] rounded-2xl rounded-bl-md border border-[#E7E5E4] bg-white px-4 py-3 shadow-sm'
        }
      >
        {isUser ? (
          message.content
        ) : (
          <>
            <ChatMarkdown content={message.content} />
            <ActionButtons actions={message.actions} />
          </>
        )}
      </div>
    </motion.div>
  )
})

function Avatar() {
  return (
    <div
      className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0F0F0F] font-display text-[11px] font-bold text-amber-400 ring-1 ring-amber-400/30"
      aria-hidden="true"
    >
      PT
    </div>
  )
}

export default function ChatExperience() {
  const prefersReduced = useReducedMotion()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false) // waiting for first token
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [sessionId, setSessionId] = useState<string>(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `s-${Date.now()}`
  )
  const [hydrated, setHydrated] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatSectionRef = useRef<HTMLDivElement>(null)
  const streamTimer = useRef<number | null>(null)

  const busy = loading || streaming
  const hasConversation = messages.length > 0

  // ── Restore / persist the session ──────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages)
        if (typeof parsed.sessionId === 'string') setSessionId(parsed.sessionId)
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, sessionId }))
    } catch {
      /* storage may be unavailable */
    }
  }, [messages, sessionId, hydrated])

  // ── Keep the transcript pinned to the latest message ────────────────────────
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, streamingText, loading])

  // ── Cleanup the reveal timer on unmount ─────────────────────────────────────
  useEffect(() => () => {
    if (streamTimer.current) window.clearTimeout(streamTimer.current)
  }, [])

  const revealReply = useCallback(
    (full: string) =>
      new Promise<void>((resolve) => {
        setStreaming(true)
        if (prefersReduced) {
          setStreamingText(full)
          resolve()
          return
        }
        setStreamingText('')
        const tokens = full.split(/(\s+)/) // keep whitespace tokens
        let idx = 0
        const tick = () => {
          idx += 2 // a word plus its trailing whitespace
          setStreamingText(tokens.slice(0, idx).join(''))
          if (idx < tokens.length) {
            streamTimer.current = window.setTimeout(tick, 16)
          } else {
            resolve()
          }
        }
        streamTimer.current = window.setTimeout(tick, 16)
      }),
    [prefersReduced]
  )

  const resetTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (ta) ta.style.height = 'auto'
  }, [])

  const sendMessage = useCallback(
    async (override?: string) => {
      const text = (override ?? input).trim()
      if (!text || busy) return

      setInput('')
      resetTextarea()
      setMessages((prev) => [...prev, { role: 'user', content: text }])
      setLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, message: text, history: messages.slice(-10) }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const reply = (data?.reply ?? '').toString().trim()
        const actions: ChatAction[] | undefined = Array.isArray(data?.actions) ? data.actions : undefined
        setLoading(false)
        if (!reply) throw new Error('empty reply')

        await revealReply(reply)
        setMessages((prev) => [...prev, { role: 'assistant', content: reply, actions }])
        setStreaming(false)
        setStreamingText('')
      } catch {
        setLoading(false)
        setStreaming(false)
        setStreamingText('')
        setMessages((prev) => [...prev, { role: 'assistant', content: ERROR_MESSAGE }])
      }
    },
    [input, busy, sessionId, revealReply, resetTextarea]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    })
    window.setTimeout(() => textareaRef.current?.focus(), prefersReduced ? 0 : 500)
  }

  const startConversation = (prompt: string) => {
    scrollToChat()
    sendMessage(prompt)
  }

  const resetConversation = () => {
    if (streamTimer.current) window.clearTimeout(streamTimer.current)
    setMessages([])
    setStreaming(false)
    setStreamingText('')
    setLoading(false)
    setSessionId(
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `s-${Date.now()}`
    )
  }

  const fade = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--bg-primary)]">
      {/* ── Ambient brand background ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-12%', left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 900, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.03) 42%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: '35%', right: '-10%', width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* ── HERO ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-36 pb-12 text-center sm:pt-40">
        <motion.div
          {...(prefersReduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } })}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/60 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
            Phantex AI · Online
          </span>
        </motion.div>

        <motion.h1
          {...(prefersReduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] as const } })}
          className="font-display text-[44px] font-extrabold leading-[1.04] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[60px] lg:text-[72px]"
        >
          Meet{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Phantex AI
          </span>
        </motion.h1>

        <motion.p
          {...(prefersReduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] as const } })}
          className="mx-auto mt-4 font-display text-xl font-semibold text-[var(--text-primary)] sm:text-2xl"
        >
          Your AI Engineering Consultant
        </motion.p>

        <motion.p
          {...(prefersReduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] as const } })}
          className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
        >
          Get instant, expert guidance on AI systems, SaaS development, backend
          engineering, automation, web scraping, APIs, and architecture — plus
          pricing, MVP planning, technical consulting, and booking a call with
          our team.
        </motion.p>

        <motion.div
          {...(prefersReduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] as const } })}
          className="mt-9"
        >
          <button
            type="button"
            onClick={scrollToChat}
            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--text-primary)] px-8 py-4 font-body font-medium text-white shadow-lg shadow-stone-900/10 transition-all duration-200 hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Start a Conversation
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          </button>
        </motion.div>
      </section>

      {/* ── WORKSPACE ── */}
      <section
        ref={chatSectionRef}
        className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 pb-28 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7 lg:px-8"
      >
        {/* Chat column */}
        <motion.div {...fade} className="mx-auto flex w-full max-w-[1000px] flex-col">
          <div className="flex flex-col overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white/80 shadow-[0_20px_60px_-20px_rgba(15,15,15,0.18)] backdrop-blur-sm">
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-white/5 bg-[#0F0F0F] px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-display text-sm font-bold text-[#0F0F0F]">
                PT
              </div>
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold text-white">Phantex AI</p>
                <p className="truncate text-xs text-white/50">AI Engineering Consultant</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden items-center gap-1.5 sm:flex">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                    Always Available
                  </span>
                </span>
                {hasConversation && (
                  <button
                    type="button"
                    onClick={resetConversation}
                    aria-label="Start a new conversation"
                    title="New chat"
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 2v6h6M21 12A9 9 0 0 0 6 5.3L3 8M21 22v-6h-6M3 12a9 9 0 0 0 15 6.7l3-2.7" />
                    </svg>
                  </button>
                )}
              </div>
            </header>

            {/* Transcript */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="Conversation with Phantex AI"
              className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6"
              style={{ minHeight: '46vh', maxHeight: '62vh', scrollBehavior: prefersReduced ? 'auto' : 'smooth' }}
            >
              {!hasConversation ? (
                <EmptyState onPick={startConversation} reduced={!!prefersReduced} />
              ) : (
                <>
                  {messages.map((m, i) => (
                    <MessageBubble key={i} message={m} animate={!prefersReduced} />
                  ))}

                  {loading && (
                    <div className="flex justify-start gap-3">
                      <Avatar />
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#E7E5E4] bg-white px-4 py-3.5 shadow-sm">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}

                  {streaming && (
                    <div className="flex justify-start gap-3">
                      <Avatar />
                      <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-[#E7E5E4] bg-white px-4 py-3 shadow-sm">
                        <ChatMarkdown content={streamingText} />
                        <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-0.5 animate-pulse bg-amber-500 align-middle" aria-hidden="true" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            <div className="sticky bottom-0 border-t border-[#E7E5E4] bg-white/90 p-3 backdrop-blur-sm sm:p-4">
              <div className="flex items-end gap-2 rounded-2xl border border-[#E7E5E4] bg-[#FAFAF8] px-2 py-1.5 transition-colors focus-within:border-amber-400/70 focus-within:ring-2 focus-within:ring-amber-400/20">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  aria-label="Message Phantex AI"
                  placeholder="Describe your project or ask an engineering question..."
                  className="max-h-40 flex-1 resize-none self-center bg-transparent px-2 py-2 font-body text-[15px] leading-relaxed text-[#0F0F0F] outline-none placeholder:text-[#A8A29E]"
                />

                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="mb-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 text-[#0F0F0F] transition-all duration-200 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 px-1 text-center font-mono text-[10px] tracking-wide text-[#A8A29E]">
                Enter to send · Shift + Enter for a new line
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar (desktop only) */}
        <motion.aside
          {...fade}
          className="hidden flex-col gap-5 lg:flex"
          aria-label="Phantex AI capabilities and frequently asked questions"
        >
          <div className="rounded-2xl border border-[#E7E5E4] bg-white/70 p-5 backdrop-blur-sm">
            <h2 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
              Capabilities
            </h2>
            <ul className="grid grid-cols-1 gap-2.5">
              {CAPABILITIES.map((cap) => (
                <li key={cap} className="flex items-center gap-2.5 font-body text-sm text-[#44403C]">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#E7E5E4] bg-white/70 p-5 backdrop-blur-sm">
            <h2 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
              Frequently Asked
            </h2>
            <ul className="flex flex-col gap-1.5">
              {FAQS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => startConversation(q)}
                    disabled={busy}
                    className="group flex w-full items-center justify-between gap-2 rounded-xl border border-transparent px-3 py-2.5 text-left font-body text-sm text-[#44403C] transition-all duration-200 hover:border-amber-200/70 hover:bg-amber-50/60 hover:text-[#0F0F0F] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                  >
                    <span>{q}</span>
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-amber-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Reserved for future recent-conversation history */}
          <div className="rounded-2xl border border-dashed border-[#E7E5E4] bg-white/40 p-5">
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#A8A29E]">
              Recent Conversations
            </h2>
            <p className="font-body text-xs leading-relaxed text-[#A8A29E]">
              Your saved chats will appear here soon.
            </p>
          </div>
        </motion.aside>
      </section>
    </main>
  )
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyState({
  onPick,
  reduced,
}: {
  onPick: (prompt: string) => void
  reduced: boolean
}) {
  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } })}
      className="flex flex-col items-center px-1 py-4 text-center sm:py-6"
    >
      {/* Abstract engineering graphic */}
      <div className="relative mb-6 h-24 w-24" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#F59E0B" strokeOpacity="0.15" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="38" fill="none" stroke="#F59E0B" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="60" y1="22" x2="60" y2="44" stroke="#F59E0B" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="98" y1="60" x2="76" y2="60" stroke="#F59E0B" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="60" y1="98" x2="60" y2="76" stroke="#F59E0B" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="22" y1="60" x2="44" y2="60" stroke="#F59E0B" strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="60" cy="22" r="4" fill="#F59E0B" />
          <circle cx="98" cy="60" r="4" fill="#F59E0B" fillOpacity="0.7" />
          <circle cx="60" cy="98" r="4" fill="#F59E0B" fillOpacity="0.7" />
          <circle cx="22" cy="60" r="4" fill="#F59E0B" fillOpacity="0.7" />
          <circle cx="60" cy="60" r="13" fill="#0F0F0F" />
          <text x="60" y="64.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#F59E0B" fontFamily="monospace">PT</text>
        </svg>
      </div>

      <div className="mx-auto max-w-xl text-left sm:text-center">
        <ChatMarkdown content={WELCOME} />
      </div>

      <p className="mt-6 mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
        Try one of these
      </p>

      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.prompt)}
            className="group flex items-center gap-3 rounded-xl border border-[#E7E5E4] bg-white/80 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/80 hover:bg-amber-50/50 hover:shadow-md hover:shadow-amber-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200/60 transition-colors group-hover:bg-amber-100">
              <PromptIcon name={p.icon} />
            </span>
            <span className="font-body text-sm font-medium text-[#0F0F0F]">{p.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
