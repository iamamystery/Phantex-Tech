import type { AIResponse, ChatAction } from './types'
import { SITE_PAGE_URLS } from './pages'

const MAX_ACTIONS = 3

function isValidAction(value: unknown, allowedUrls: Set<string>): value is ChatAction {
  if (!value || typeof value !== 'object') return false
  const label = (value as Record<string, unknown>).label
  const url = (value as Record<string, unknown>).url
  return (
    typeof label === 'string' &&
    label.trim().length > 0 &&
    typeof url === 'string' &&
    url.startsWith('/') &&
    allowedUrls.has(url)
  )
}

/**
 * Turn the model's raw completion into a validated AIResponse. The model is
 * instructed to return `{ message, actions? }` JSON, but this never trusts
 * that blindly: actions are dropped unless their url is one of the site's
 * known static pages or a url that was actually retrieved for this turn
 * (contextUrls) — the model can reference real content but can't invent links.
 * If the completion isn't valid JSON, it degrades to a plain message with no
 * actions rather than failing the request.
 */
export function parseAIResponse(raw: string, contextUrls: string[] = []): AIResponse {
  const allowedUrls = new Set(Array.from(SITE_PAGE_URLS).concat(contextUrls))

  try {
    const parsed = JSON.parse(raw)
    const message = typeof parsed?.message === 'string' ? parsed.message.trim() : ''
    if (!message) throw new Error('AI response missing "message"')

    const actions = Array.isArray(parsed.actions)
      ? parsed.actions.filter((a: unknown) => isValidAction(a, allowedUrls)).slice(0, MAX_ACTIONS)
      : []

    return actions.length > 0 ? { message, actions } : { message }
  } catch {
    return { message: raw.trim() }
  }
}
