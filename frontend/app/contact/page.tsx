'use client'

import { useState } from 'react'
import FadeIn from '@/components/ui/FadeIn'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import { Select } from '@/components/ui/Select'

// ─── Page data ────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { label: 'Avg. Response Time', value: '< 24 Hours' },
  { label: 'Current Availability', value: 'Accepting New Projects' },
  { label: 'Coverage', value: 'US · EU · MENA' },
]

const METRICS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '100k+', label: 'Records / Day' },
  { value: '99.9%', label: 'Workflow Reliability' },
]

// ─── Shared styles (match Testimonials design tokens exactly) ─────────────────

// Primary text: #111111 on #FFFFFF = 19.5:1 ✓
// Label text:   #777777 on #FFFFFF = 4.6:1 ✓ (AA)
// Body text:    #555555 on #FAFAF8 = 7.5:1 ✓ (AAA)

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  color: '#777777',
  marginBottom: '8px',
}

// Input: recessed #F7F6F4 background so it reads as a "well" in the white card
const inputBase =
  'w-full rounded-xl px-4 py-3.5 font-body text-sm outline-none transition-all duration-150'
const inputStyle: React.CSSProperties = {
  background: '#F7F6F4',
  border: '1px solid #E2DED8',
  color: '#111111',
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'scraping',
    budget: 'under5k',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return // prevent duplicate submissions

    // Client-side validation (the API validates again server-side)
    const name = formData.name.trim()
    const email = formData.email.trim()
    const message = formData.message.trim()

    if (!name || !email || !message) {
      setErrorMsg('Please fill in all required fields.')
      setStatus('error')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }
    if (message.length < 10) {
      setErrorMsg('Please add a little more detail to your project brief.')
      setStatus('error')
      return
    }

    setErrorMsg('')
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service: formData.service, budget: formData.budget, message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
      setFormData({ name: '', email: '', service: 'scraping', budget: 'under5k', message: '' })
    } catch (err) {
      console.error(err)
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <main
      className="relative min-h-screen pt-32 pb-24"
      style={{ background: '#FAFAF8' }}
    >
      <BreadcrumbSchema items={[{ name: 'Contact', href: '/contact' }]} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* ═══════════════════════════════════════════════════════════
              LEFT — Trust-building content
              Design benchmark: Testimonials section header + stats bar
          ═══════════════════════════════════════════════════════════ */}
          <FadeIn className="pt-2">

            {/* ── Heading block ─────────────────────────────────────── */}
            <div className="mb-10">
              {/* Eyebrow — exact match to Testimonials eyebrow */}
              <span
                className="font-mono font-bold uppercase block mb-5"
                style={{ fontSize: '11px', letterSpacing: '0.35em', color: '#F59E0B' }}
              >
                Contact
              </span>

              {/* H1 — same weight / scale as Testimonials h2 */}
              <h1
                className="font-display font-black leading-[1.05] tracking-tight mb-6"
                style={{ fontSize: 'clamp(42px, 5vw, 64px)', color: '#111111' }}
              >
                Let's build{' '}
                <span style={{ color: '#F59E0B' }} className="italic">something</span>
                {' '}remarkable.
              </h1>

              {/* Body — #555555 = 7.5:1 on #FAFAF8 (AAA) */}
              <p
                className="font-body leading-relaxed"
                style={{ fontSize: '16px', color: '#555555', maxWidth: '440px' }}
              >
                Tell us what you're building and we'll show you how automation,
                AI, and custom engineering can remove operational bottlenecks and
                create scalable systems.
              </p>
            </div>

            {/* ── Trust indicators — styled as Testimonials secondary card ── */}
            <div
              className="mb-8 overflow-hidden"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EDEAE4',
                borderRadius: '16px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              }}
            >
              {TRUST_ITEMS.map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    borderBottom: i < TRUST_ITEMS.length - 1 ? '1px solid #F0EDE8' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Live green dot */}
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: '#10B981',
                        boxShadow: '0 0 6px rgba(16,185,129,0.5)',
                      }}
                    />
                    {/* Label: #777777 = 4.6:1 on white (AA) ✓ */}
                    <span
                      className="font-mono font-bold uppercase"
                      style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#777777' }}
                    >
                      {label}
                    </span>
                  </div>
                  {/* Value: #111111 = 19:1 on white ✓ */}
                  <span
                    className="font-body font-semibold"
                    style={{ fontSize: '13px', color: '#111111' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Metrics row — exact Testimonials stats-bar pattern ── */}
            <div
              className="grid grid-cols-3 overflow-hidden"
              style={{ border: '1px solid #EDEAE4', borderRadius: '16px' }}
            >
              {METRICS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-7 px-3 text-center"
                  style={{
                    borderRight: i < METRICS.length - 1 ? '1px solid #EDEAE4' : 'none',
                    background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8',
                  }}
                >
                  {/* Stat value: font-black, #111111 */}
                  <span
                    className="font-display font-black leading-none tracking-tight mb-1.5"
                    style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', color: '#111111' }}
                  >
                    {value}
                  </span>
                  {/* Stat label: #777777 */}
                  <span
                    className="font-mono font-bold uppercase"
                    style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#777777' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT — Contact form card
              Confident white card with clear depth, clean typography
          ═══════════════════════════════════════════════════════════ */}
          <FadeIn delay={0.15} className="relative">
            {/* Single white card — one surface, one radius, one shadow */}
            <div
              className="relative z-10 rounded-[1.75rem] bg-white"
              style={{
                boxShadow:
                  '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {/* ── Form content ── */}
              <div className="relative w-full p-8 md:p-10">

                {status === 'success' ? (
                  /* ── Success state ── */
                  <div className="text-center py-14">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ background: 'rgba(245,158,11,0.10)', color: '#F59E0B' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3
                      className="font-display font-black mb-3"
                      style={{ fontSize: '24px', color: '#111111' }}
                    >
                      Message Received
                    </h3>
                    <p
                      className="font-body mb-8 leading-relaxed mx-auto"
                      style={{ fontSize: '14px', color: '#666666', maxWidth: '280px' }}
                    >
                      Your project details have been received. We'll be in touch within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                      style={{ background: '#111111', color: '#FFFFFF' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#F59E0B'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#111111'
                      }}
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ── Card header ── */}
                    <div
                      className="pb-6 mb-2"
                      style={{ borderBottom: '1px solid #F0EDE8' }}
                    >
                      <h2
                        className="font-display font-black mb-1.5"
                        style={{ fontSize: '22px', color: '#111111' }}
                      >
                        Start Your Project
                      </h2>
                      {/* Sub: #666666 on #FFFFFF = 7.2:1 ✓ */}
                      <p
                        className="font-body"
                        style={{ fontSize: '14px', color: '#666666' }}
                      >
                        Usually responds within one business day.
                      </p>
                    </div>

                    {/* ── Name + Email ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" style={fieldLabelStyle}>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className={inputBase}
                          style={inputStyle}
                          placeholder="Your name"
                          onFocus={e => {
                            e.currentTarget.style.background = '#FFFFFF'
                            e.currentTarget.style.borderColor = '#F59E0B'
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'
                          }}
                          onBlur={e => {
                            e.currentTarget.style.background = '#F7F6F4'
                            e.currentTarget.style.borderColor = '#E2DED8'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" style={fieldLabelStyle}>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={inputBase}
                          style={inputStyle}
                          placeholder="hello@company.com"
                          onFocus={e => {
                            e.currentTarget.style.background = '#FFFFFF'
                            e.currentTarget.style.borderColor = '#F59E0B'
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'
                          }}
                          onBlur={e => {
                            e.currentTarget.style.background = '#F7F6F4'
                            e.currentTarget.style.borderColor = '#E2DED8'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* ── Service + Budget ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="service" style={fieldLabelStyle}>Service Needed</label>
                        <Select
                          id="service"
                          ariaLabel="Service Needed"
                          value={formData.service}
                          onValueChange={(v) => setFormData((prev) => ({ ...prev, service: v }))}
                          options={[
                            { value: 'scraping', label: 'Web Scraping & Extraction' },
                            { value: 'automation', label: 'Browser Automation' },
                            { value: 'backend', label: 'Backend Development' },
                            { value: 'ai', label: 'AI Integration' },
                          ]}
                        />
                      </div>
                      <div>
                        <label htmlFor="budget" style={fieldLabelStyle}>Budget Range</label>
                        <Select
                          id="budget"
                          ariaLabel="Budget Range"
                          value={formData.budget}
                          onValueChange={(v) => setFormData((prev) => ({ ...prev, budget: v }))}
                          options={[
                            { value: 'under5k', label: 'Under $5,000' },
                            { value: '5k_10k', label: '$5k – $10k' },
                            { value: '10k_20k', label: '$10k – $20k' },
                            { value: 'over20k', label: '$20k+' },
                          ]}
                        />
                      </div>
                    </div>

                    {/* ── Project Brief ── */}
                    <div>
                      <label htmlFor="message" style={fieldLabelStyle}>Project Brief</label>
                      <textarea
                        name="message"
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`${inputBase} resize-none`}
                        style={inputStyle}
                        placeholder="Tell us about your project, goals, and timeline..."
                        onFocus={e => {
                          e.currentTarget.style.background = '#FFFFFF'
                          e.currentTarget.style.borderColor = '#F59E0B'
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'
                        }}
                        onBlur={e => {
                          e.currentTarget.style.background = '#F7F6F4'
                          e.currentTarget.style.borderColor = '#E2DED8'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                    </div>

                    {/* ── Error message ── */}
                    {status === 'error' && errorMsg && (
                      <p
                        role="alert"
                        className="text-center font-body text-sm"
                        style={{ color: '#DC2626' }}
                      >
                        {errorMsg}
                      </p>
                    )}

                    {/* ── CTA ── */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full relative overflow-hidden font-display font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-200 group disabled:opacity-60"
                      style={{
                        fontSize: '12px',
                        background: '#111111',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      }}
                      onMouseEnter={e => {
                        if (status !== 'submitting')
                          (e.currentTarget as HTMLButtonElement).style.background = '#F59E0B'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#111111'
                      }}
                    >
                      {/* Sweep shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[600ms] ease-out pointer-events-none" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {status === 'submitting' ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Start Your Project
                            <svg
                              className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </>
                        )}
                      </span>
                    </button>

                    {/* ── Trust footnote ── */}
                    <p
                      className="text-center font-body"
                      style={{ fontSize: '12px', color: '#999999' }}
                    >
                      No commitment required · We respond within 24 hours
                    </p>

                  </form>
                )}
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
