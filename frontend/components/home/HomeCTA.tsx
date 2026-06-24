"use client"

import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import { motion } from 'framer-motion'

export default function HomeCTA() {
  return (
    <section className="py-20 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden flex items-center justify-center">
      {/* Background Glows */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(234,88,12,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative max-w-xl mx-auto p-8 md:p-10 rounded-[48px_48px_16px_16px] overflow-hidden group/card shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]"
          style={{
            background: 'linear-gradient(#000, #000) padding-box, linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 50%, rgba(245,158,11,0.25) 100%) border-box',
            border: '1px solid transparent',
          }}
        >
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02)_0%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <FadeIn>
              {/* Eyebrow */}
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500/80 mb-5">
                Let&apos;s Build Together
              </p>

              {/* Heading */}
              <h2 className="font-display text-3xl md:text-4xl font-black text-white leading-[1.15] mb-5 tracking-tight">
                Ready to automate
                <br />
                <span className="text-amber-500 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">the hard stuff?</span>
              </h2>

              {/* Subtext */}
              <p className="font-body text-sm text-stone-400 leading-relaxed mb-8 max-w-sm mx-auto">
                Tell us about your project. We respond within 24 hours and typically scope projects within 48.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="group/btn relative inline-flex items-center gap-2 bg-amber-500 text-black font-body font-bold px-7 py-3.5 rounded-xl text-sm hover:bg-amber-400 transition-all duration-300 shadow-[0_8px_24px_-4px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_32px_-4px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Start a Project
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 border border-white/10 text-white font-body font-semibold px-7 py-3.5 rounded-xl text-sm hover:border-white/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                >
                  See Our Work
                </Link>
              </div>
            </FadeIn>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
