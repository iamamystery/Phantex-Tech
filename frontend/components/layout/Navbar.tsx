'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { socialLinks } from '@/lib/social'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Studio' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/schedule', label: 'Schedule' },
] as const

// Minimum scroll delta (px) before we change state — prevents micro-scroll jitter
const SCROLL_DELTA = 20
// Distance from top where navbar always stays expanded
const TOP_ZONE = 60

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const pathname = usePathname()

  const updateNavbar = useCallback(() => {
    const currentY = window.scrollY

    // Always expanded near the top
    if (currentY < TOP_ZONE) {
      setIsCollapsed(false)
    } else {
      const delta = currentY - lastScrollY.current
      // Only change state if scroll delta exceeds threshold
      if (delta > SCROLL_DELTA) {
        setIsCollapsed(true)   // scrolling down
      } else if (delta < -SCROLL_DELTA) {
        setIsCollapsed(false)  // scrolling up
      }
      // If delta is within ±SCROLL_DELTA, keep current state (no flicker)
    }

    lastScrollY.current = currentY
    ticking.current = false
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(updateNavbar)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [updateNavbar])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className="fixed top-[20px] left-1/2 -translate-x-1/2 z-[100] flex justify-center w-full px-4"
    >
      <div
        className={cn(
          "inline-flex items-center justify-center overflow-hidden border relative",
          "glass-effect",
          isCollapsed ? "max-w-[160px] h-[44px]" : "max-w-[860px] h-[52px]",
        )}
        style={{
          borderRadius: '999px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
          transition: 'max-width 0.55s cubic-bezier(0.22, 1, 0.36, 1), height 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Shimmer line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="flex items-center px-6 h-full whitespace-nowrap">
          {/* Brand — always visible, centered when collapsed */}
          <Link
            href="/"
            className="font-display font-semibold text-lg text-[var(--text-primary)]"
            style={{
              marginLeft: isCollapsed ? 'auto' : undefined,
              marginRight: isCollapsed ? 'auto' : '2rem',
              transition: 'margin 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Phan<span className="text-indigo-500">tex</span> Tech
          </Link>

          {/* Links + CTA — fade in/out with staggered delay */}
          <div
            className="flex items-center h-full"
            style={{
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateY(-4px)' : 'translateY(0)',
              pointerEvents: isCollapsed ? 'none' : 'auto',
              width: isCollapsed ? 0 : 'auto',
              // Collapse: content fades out FIRST (fast, no delay)
              // Expand: content fades in AFTER pill has grown (delayed)
              transition: isCollapsed
                ? 'opacity 0.2s ease, transform 0.2s ease, width 0.3s ease'
                : 'opacity 0.35s ease 0.2s, transform 0.35s ease 0.2s, width 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Nav Links */}
            <div className="flex items-center gap-6 mr-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative font-body text-xs font-semibold tracking-wide py-1 transition-colors duration-200",
                    isActive(href) ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span className="relative z-10 px-3 py-1.5">
                    {label}
                    {isActive(href) && (
                      <motion.span
                        layoutId="active-bg"
                        className="absolute inset-0 bg-stone-900/5 rounded-full -z-10 backdrop-blur-sm"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </span>
                  {isActive(href) && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Social Icons (desktop only) */}
            <div className="hidden md:flex items-center gap-2 mr-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-[var(--text-muted)] hover:text-indigo-500 transition-colors duration-200"
                  dangerouslySetInnerHTML={{ __html: s.iconSvg }}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="w-[1px] h-4 bg-stone-200 mr-4" />

            {/* CTA */}
            <Link
              href="/schedule"
              className="bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
