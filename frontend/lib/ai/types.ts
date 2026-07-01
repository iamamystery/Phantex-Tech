// Shared shape for the AI assistant's structured replies. The model is
// instructed (see app/api/chat/route.ts) to return exactly this shape as
// JSON — the frontend never parses page references out of plain text.

export interface ChatAction {
  label: string
  url: string
}

export interface AIResponse {
  message: string
  actions?: ChatAction[]
}
