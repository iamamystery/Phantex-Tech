'use client'

import { useState } from 'react'
import { submitContact } from '@/lib/api'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import GlassCard from '@/components/ui/GlassCard'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import Link from 'next/link'
import { MagicCard } from '@/components/magicui/magic-card'
import { useTheme } from 'next-themes'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'web-scraping',
    budget: '5k-10k',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      // @ts-ignore - aligning budget/service values with backend expectations
      await submitContact(formData)
      setStatus('success')
    } catch (error) {
      console.error('Submission error:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <BreadcrumbSchema items={[{ name: 'Contact', href: '/contact' }]} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Side: Text Content */}
          <FadeIn className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-[var(--accent)]/60" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--accent)]">
                  Contact
                </span>
              </div>
              <h1 className="font-display text-6xl md:text-7xl font-bold text-[var(--text-primary)] dark:text-white leading-[1.1] tracking-tight mb-8">
                Let's build <br />
                <span className="text-[var(--accent)] italic">something </span> 
                remarkable.
              </h1>
              <p className="font-body text-xl text-[var(--text-muted)] dark:text-white/60 max-w-lg leading-relaxed">
                Whether you're scaling a data pipeline or automating complex browser workflows, our engineering team is ready to deploy.
              </p>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-3 group cursor-default">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">Digital Correspondence</p>
                <p className="font-body text-lg font-medium text-[var(--text-primary)] dark:text-white transition-all group-hover:translate-x-1">hello@phantextech.com</p>
              </div>
              <div className="space-y-3 group cursor-default">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">Operating Base</p>
                <p className="font-body text-lg font-medium text-[var(--text-primary)] dark:text-white transition-all group-hover:translate-x-1">San Francisco, CA</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-8 pt-6">
              {['Twitter', 'GitHub', 'LinkedIn'].map((platform) => (
                <Link 
                  key={platform} 
                  href="#" 
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-all hover:-translate-y-0.5"
                >
                  {platform}
                </Link>
              ))}
            </div>
          </FadeIn>

          {/* Form Side */}
          <FadeIn delay={0.2} className="relative">
            <MagicCard
              className="relative z-10 m-0 overflow-hidden rounded-[2.5rem] border border-[var(--border)] dark:border-white/[0.08] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] bg-transparent p-0"
              gradientColor="rgba(255,255,255,0.4)"
            >
              {/* STUDIO-STYLE FULL-BLEED BACKGROUND LAYER */}
              <div 
                className="absolute inset-0 -z-10 rounded-[2.5rem]" 
                style={{
                  backgroundColor: theme === 'dark' ? '#0c0c0c' : '#FFFBEB',
                  backgroundImage: `
                    repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px),
                    repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
                  `
                }}
              />
              
              {/* Top Shimmer Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--accent)]/0 to-transparent group-hover/card:via-[var(--accent)]/40 transition-all duration-700 z-20" />

              {/* Content wrapper with correct Studio-style padding */}
              <div className="relative z-20 w-full h-full p-8 md:p-14">
                {status === 'success' ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto mb-8 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="font-display text-3xl font-bold text-[var(--text-primary)] dark:text-white mb-4">Message Transmitted</h3>
                    <p className="font-body text-[var(--text-muted)] dark:text-white/60 mb-10 text-lg max-w-sm mx-auto">
                      Your project details have been received. Our team will review them within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-8 py-3 rounded-full bg-[var(--text-primary)] text-white dark:bg-white dark:text-black font-bold hover:bg-[var(--accent)] hover:text-white transition-all shadow-lg"
                    >
                      Send Another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4 group/field relative">
                        <label htmlFor="name" className="block font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)] dark:text-white/40 group-focus-within/field:text-[var(--accent)] transition-colors">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full relative z-10 bg-white/40 dark:bg-black/20 border border-[var(--border)] dark:border-white/[0.08] rounded-2xl px-6 py-5 font-body text-base text-[var(--text-primary)] dark:text-white outline-none focus:ring-4 focus:ring-[var(--accent)]/5 focus:border-[var(--accent)]/40 transition-all placeholder:text-[var(--text-muted)]/50"
                          placeholder="Your identity..."
                        />
                      </div>
                      <div className="space-y-4 group/field relative">
                        <label htmlFor="email" className="block font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)] dark:text-white/40 group-focus-within/field:text-[var(--accent)] transition-colors">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full relative z-10 bg-white/40 dark:bg-black/20 border border-[var(--border)] dark:border-white/[0.08] rounded-2xl px-6 py-5 font-body text-base text-[var(--text-primary)] dark:text-white outline-none focus:ring-4 focus:ring-[var(--accent)]/5 focus:border-[var(--accent)]/40 transition-all placeholder:text-[var(--text-muted)]/50"
                          placeholder="hello@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4 group/field relative">
                        <label htmlFor="service" className="block font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)] dark:text-white/40 group-focus-within/field:text-[var(--accent)] transition-colors">
                          Category
                        </label>
                        <div className="relative">
                          <select
                            name="service"
                            id="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full relative z-10 bg-white/40 dark:bg-black/20 border border-[var(--border)] dark:border-white/[0.08] rounded-2xl px-6 py-5 font-body text-base text-[var(--text-primary)] dark:text-white outline-none focus:ring-4 focus:ring-[var(--accent)]/5 focus:border-[var(--accent)]/40 transition-all appearance-none cursor-pointer"
                          >
                            <option value="scraping">Web Scraping & Extraction</option>
                            <option value="automation">Operational Automation</option>
                            <option value="backend">Backend Development</option>
                            <option value="ai">AI Integration</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 group/field relative">
                        <label htmlFor="budget" className="block font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)] dark:text-white/40 group-focus-within/field:text-[var(--accent)] transition-colors">
                          Budget Range
                        </label>
                        <div className="relative">
                          <select
                            name="budget"
                            id="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full relative z-10 bg-white/40 dark:bg-black/20 border border-[var(--border)] dark:border-white/[0.08] rounded-2xl px-6 py-5 font-body text-base text-[var(--text-primary)] dark:text-white outline-none focus:ring-4 focus:ring-[var(--accent)]/5 focus:border-[var(--accent)]/40 transition-all appearance-none cursor-pointer"
                          >
                            <option value="under5k">&lt; $5,000</option>
                            <option value="5k_10k">$5k - $10k</option>
                            <option value="10k_20k">$10k - $20k</option>
                            <option value="over20k">$20k+</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 group/field relative">
                      <label htmlFor="message" className="block font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)] dark:text-white/40 group-focus-within/field:text-[var(--accent)] transition-colors">
                        Project Brief
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full relative z-10 bg-white/40 dark:bg-black/20 border border-[var(--border)] dark:border-white/[0.08] rounded-3xl px-6 py-6 font-body text-base text-[var(--text-primary)] dark:text-white outline-none focus:ring-4 focus:ring-[var(--accent)]/5 focus:border-[var(--accent)]/40 transition-all resize-none placeholder:text-[var(--text-muted)]/50"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full relative isolate bg-[var(--text-primary)] text-white dark:bg-white dark:text-[var(--text-primary)] font-display font-bold text-xs uppercase tracking-[0.3em] py-6 rounded-2xl overflow-hidden hover:bg-[var(--accent)] hover:text-white dark:hover:bg-[var(--accent)] dark:hover:text-white active:scale-98 transition-all group shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                      <span className="flex items-center justify-center gap-3 relative z-10">
                        {status === 'submitting' ? 'Transmitting...' : 'Initialize Inquiry'}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </MagicCard>
          </FadeIn>
        </div>
      </div>
    </main>
  )
}
