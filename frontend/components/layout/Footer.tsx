import Link from 'next/link'
import { Globe } from '@/registry/magicui/globe'
import { socialLinks } from '@/lib/social'

const SERVICE_LINKS = [
  { href: '/services/web-scraping', label: 'Web Scraping' },
  { href: '/services/automation', label: 'Browser Automation' },
  { href: '/services/backend', label: 'Backend Development' },
  { href: '/services/frontend', label: 'Frontend Development' },
  { href: '/services/api', label: 'API Integration' },
  { href: '/services/ai', label: 'AI Integration' },
]

const COMPANY_LINKS = [
  { href: '/work', label: 'Our Work' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] relative overflow-hidden">
      {/* Globe as background decoration */}
      <div className="absolute inset-x-0 bottom-0 z-0 flex items-center justify-center opacity-70">
        <span className="pointer-events-none absolute top-10 translate-y-[-20%] bg-linear-to-b from-amber-900/20 to-amber-500/10 bg-clip-text text-center text-8xl leading-none font-bold whitespace-pre-wrap text-transparent">
          Phantex Tech
        </span>
        <Globe />
      </div>

      {/* Radial gradient to blend globe into background - slightly more transparent center */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_120%,rgba(238,242,255,0.3)_0%,var(--bg-secondary)_90%)]" />

      {/* Content wrapper with higher z-index */}
      <div className="relative z-10">
        {/* Indigo gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="font-display font-semibold text-2xl text-[var(--text-primary)] hover:opacity-80 transition-opacity duration-150 inline-block"
              >
                Phan<span className="text-amber-400">tex</span> Tech
              </Link>
              <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
                We build what powers you — helping SaaS startups scale with
                web scraping, automation, and AI pipelines.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-amber-500 hover:border-amber-300 transition-all duration-150 cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: s.iconSvg }}
                  />
                ))}
              </div>
            </div>

            {/* Services column */}
            <div>
              <h3 className="font-body text-xs font-medium uppercase tracking-widest text-[var(--text-primary)] mb-6">
                Services
              </h3>
              <ul className="flex flex-col gap-3">
                {SERVICE_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="font-body text-sm text-[var(--text-muted)] hover:text-amber-500 transition-colors duration-150 cursor-pointer"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company + contact column */}
            <div className="flex flex-col gap-10">
              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-widest text-[var(--text-primary)] mb-6">
                  Company
                </h3>
                <ul className="flex flex-col gap-3">
                  {COMPANY_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="font-body text-sm text-[var(--text-muted)] hover:text-amber-500 transition-colors duration-150 cursor-pointer"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-widest text-[var(--text-primary)] mb-4">
                  Get in Touch
                </h3>
                <a
                  href="mailto:hello@phantextech.com"
                  className="font-body text-sm text-[var(--text-muted)] hover:text-amber-500 transition-colors duration-150 cursor-pointer block mb-1"
                >
                  hello@phantextech.com
                </a>

              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-stone-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-[var(--text-muted)]">
              © {year} Phantex Tech. All rights reserved.
            </p>
            <p className="font-body text-xs text-[var(--text-muted)]">
              Built with{' '}
              <span className="text-amber-400 font-medium">Python</span> &amp;{' '}
              <span className="text-amber-400 font-medium">Next.js</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
