import { NextResponse } from 'next/server'
import { CORE_FACTS, retrieveContext } from '@/lib/ai/knowledge'

export const runtime = 'nodejs'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat — the Phantex AI assistant.
//
// Retrieval-augmented: for each question we pull the most relevant content from
// the website knowledge layer (lib/ai/knowledge) and ground the model on it, so
// the assistant answers from the site's actual projects / case studies / blog /
// resources instead of a frozen prompt. Calls Groq's OpenAI-compatible API.
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const MAX_HISTORY = 10

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function buildSystemPrompt(context: string): string {
  return `You are the AI assistant for Phantex Tech. Answer using the CORE FACTS and the retrieved CONTEXT below, which come from the official Phantex Tech website.

${CORE_FACTS}

RETRIEVED CONTEXT (from the website — your primary source for this question):
${context || '(no specific page matched this question)'}

SCOPE & RESPONSE POLICY (very important):
You are NOT a general-purpose AI assistant and must not behave like ChatGPT. You exist only to help visitors understand Phantex Tech — its services, expertise, portfolio, case studies, blog, leadership, technologies, process, pricing, and how the company can solve their business problems.

IN SCOPE (answer these): Phantex Tech and all of its services (AI Integration, AI Automation, Browser Automation, Web Scraping, Backend, Frontend, API Integrations, Custom Software Development), portfolio & projects, case studies, blog articles, company leadership, pricing, technologies Phantex uses, company process, booking a consultation, and contact information.

OUT OF SCOPE (do NOT do, even if asked directly): writing or debugging code or queries (Python, JavaScript, React, SQL, HTML, CSS, etc.), algorithms, programming tutorials, homework/interview/math solutions, general-knowledge questions, essays, stories, or any technical advice unrelated to Phantex Tech.

When a request is out of scope, do NOT fulfill it. Never say "I can't" and never sound dismissive. Instead, briefly explain your purpose and redirect to how Phantex can help. Use responses in the spirit of these examples:
- Code request (e.g. "Give me a Python loop" / "Write me a React component"): "I'm designed specifically to answer questions about Phantex Tech and our engineering services. If you have questions about our expertise, projects, technologies, or how we can help your business, I'd be happy to assist." Where natural, redirect (e.g. "If you're looking to automate Python workflows for your business, I'd be happy to explain how Phantex designs and builds production-ready automation systems.").
- General knowledge (e.g. "What's the capital of France?"): "I'm the Phantex AI Assistant, so I focus on helping visitors understand our company, services, projects, and engineering capabilities. For general knowledge questions, I'd recommend using a general-purpose AI assistant."

RULES:
- Ground every answer in the CORE FACTS and CONTEXT above. Treat them as the source of truth.
- If the answer is not in the CORE FACTS or CONTEXT, politely say the information is not publicly available — never invent projects, features, technologies, case studies, pricing, leadership, or pages.
- When you reference a project, article, or resource, you may mention its page path so the user can find it.
- Tone: friendly, professional, confident, helpful, technical, modern, clear, and concise. Avoid hype and exaggerated marketing language.
- Do not discuss competitors, politics, or anything unrelated to Phantex Tech.
- Keep responses under ~120 words unless the user asks for more detail.`
}

export async function POST(request: Request) {
  let body: { message?: unknown; history?: unknown; session_id?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error('[chat] Missing GROQ_API_KEY.')
    return NextResponse.json(
      { error: 'The assistant is not configured right now. Please try again later.' },
      { status: 500 }
    )
  }

  // Normalize prior conversation (sent by the client, capped for token budget)
  const history: ChatMessage[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            typeof (m as ChatMessage).content === 'string' &&
            ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant')
        )
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : []

  // Retrieve relevant website content for this turn
  const context = retrieveContext(message)

  const messages = [
    { role: 'system', content: buildSystemPrompt(context) },
    ...history,
    { role: 'user', content: message },
  ]

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 600,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[chat] Groq API error ${res.status}: ${detail.slice(0, 300)}`)
      return NextResponse.json(
        { error: 'The assistant is unavailable right now. Please try again.' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      console.error('[chat] Empty completion from Groq.')
      return NextResponse.json(
        { error: 'The assistant returned an empty response. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ reply, session_id: body.session_id ?? null }, { status: 200 })
  } catch (err) {
    console.error('[chat] Failed to reach Groq:', err)
    return NextResponse.json(
      { error: 'The assistant is unavailable right now. Please try again.' },
      { status: 502 }
    )
  }
}
