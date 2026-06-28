import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Nodemailer needs the Node.js runtime (not Edge).
export const runtime = 'nodejs'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact — receives a contact submission, validates + sanitizes it,
// and emails it to CONTACT_RECEIVER via Gmail SMTP (Nodemailer). Credentials are
// read only from env (EMAIL_USER / EMAIL_PASS / CONTACT_RECEIVER) and never
// reach the client. The frontend never talks to SMTP directly.
// ─────────────────────────────────────────────────────────────────────────────

// Human-readable labels for the form's option values (used in the email).
const SERVICE_LABELS: Record<string, string> = {
  scraping: 'Web Scraping & Extraction',
  automation: 'Browser Automation',
  backend: 'Backend Development',
  ai: 'AI Integration',
}

const BUDGET_LABELS: Record<string, string> = {
  under5k: 'Under $5,000',
  '5k_10k': '$5k – $10k',
  '10k_20k': '$10k – $20k',
  over20k: '$20k+',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactPayload {
  name: string
  email: string
  service: string
  budget: string
  message: string
}

/** Escape user input before embedding it in HTML (prevents HTML/markup injection). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Validate + normalize the raw request body. Returns clean data or a list of errors. */
function parsePayload(body: unknown):
  | { ok: true; data: ContactPayload }
  | { ok: false; errors: string[] } {
  const errors: string[] = []
  const b = (body ?? {}) as Record<string, unknown>

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const name = str(b.name)
  const email = str(b.email)
  const service = str(b.service)
  const budget = str(b.budget)
  const message = str(b.message)

  if (!name) errors.push('Name is required.')
  else if (name.length > 100) errors.push('Name is too long.')

  if (!email) errors.push('Email is required.')
  else if (!EMAIL_RE.test(email) || email.length > 254) errors.push('A valid email address is required.')

  if (!service) errors.push('Service is required.')
  if (!budget) errors.push('Budget is required.')

  if (!message) errors.push('Project brief is required.')
  else if (message.length < 10) errors.push('Project brief must be at least 10 characters.')
  else if (message.length > 5000) errors.push('Project brief is too long.')

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, data: { name, email, service, budget, message } }
}

function buildEmail(data: ContactPayload) {
  const serviceLabel = SERVICE_LABELS[data.service] ?? data.service
  const budgetLabel = BUDGET_LABELS[data.budget] ?? data.budget
  const submitted = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  }) + ' UTC'

  // Escaped values for the HTML body.
  const e = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    service: escapeHtml(serviceLabel),
    budget: escapeHtml(budgetLabel),
    message: escapeHtml(data.message).replace(/\n/g, '<br/>'),
    submitted: escapeHtml(submitted),
  }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #EEEEEE;">
        <div style="font:700 10px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#999999;margin-bottom:6px;">${label}</div>
        <div style="font:400 15px/1.5 'Helvetica Neue',Arial,sans-serif;color:#111111;">${value}</div>
      </td>
    </tr>`

  const html = `
  <div style="background:#F5F4F1;padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);">
      <tr>
        <td style="background:#0F0F0F;padding:28px 32px;">
          <div style="font:700 18px/1 'Helvetica Neue',Arial,sans-serif;color:#FFFFFF;">Phan<span style="color:#F59E0B;">tex</span> Tech</div>
          <div style="font:700 11px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#F59E0B;margin-top:10px;">New Project Inquiry</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${row('Name', e.name)}
            ${row('Email', `<a href="mailto:${e.email}" style="color:#B45309;text-decoration:none;">${e.email}</a>`)}
            ${row('Service', e.service)}
            ${row('Budget', e.budget)}
            ${row('Project Brief', e.message)}
            ${row('Submitted', e.submitted)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px;background:#FAFAF8;border-top:1px solid #EEEEEE;">
          <div style="font:400 12px/1.5 'Helvetica Neue',Arial,sans-serif;color:#999999;">Reply directly to this email to respond to ${e.name}.</div>
        </td>
      </tr>
    </table>
  </div>`

  const text = [
    'New Project Inquiry — Phantex Tech',
    '',
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Service: ${serviceLabel}`,
    `Budget:  ${budgetLabel}`,
    '',
    'Project Brief:',
    data.message,
    '',
    `Submitted: ${submitted}`,
  ].join('\n')

  return { html, text }
}

export async function POST(request: Request) {
  // 1) Parse + validate
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = parsePayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.errors.join(' ') }, { status: 400 })
  }

  // 2) Ensure SMTP config is present (server-side only)
  const { EMAIL_USER, EMAIL_PASS, CONTACT_RECEIVER } = process.env
  if (!EMAIL_USER || !EMAIL_PASS || !CONTACT_RECEIVER) {
    console.error('[contact] Missing email env vars. Set EMAIL_USER, EMAIL_PASS, CONTACT_RECEIVER.')
    return NextResponse.json(
      { error: 'Email service is not configured. Please try again later.' },
      { status: 500 }
    )
  }

  // 3) Send
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })

    const { html, text } = buildEmail(parsed.data)

    await transporter.sendMail({
      from: `Phantex Tech <${EMAIL_USER}>`,
      to: CONTACT_RECEIVER,
      replyTo: `${parsed.data.name} <${parsed.data.email}>`,
      subject: '🚀 New Project Inquiry — Phantex Tech',
      text,
      html,
    })

    console.info(`[contact] Inquiry sent from ${parsed.data.email}`)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[contact] Failed to send email:', err)
    return NextResponse.json(
      { error: 'We could not send your message right now. Please try again.' },
      { status: 502 }
    )
  }
}
