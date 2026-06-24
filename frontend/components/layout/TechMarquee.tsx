'use client'

import { useEffect, useState } from 'react'
import { InfiniteSlider } from '@/components/core/infinite-slider'
import { getMediaUrl } from '@/lib/utils'

interface Technology {
  id: number
  name: string
  logo_url: string
  logo_image: string | null
  description: string
  order: number
}

function TechCard({ tool }: { tool: Technology }) {
  const logoSrc = getMediaUrl(tool.logo_url || tool.logo_image) || ''
  
  return (
    <div className='group relative flex flex-col items-center justify-center px-4 transition-all duration-500'>
      {/* Logo wrapper */}
      <div className='relative h-14 w-auto flex items-center justify-center'>
        <img
          src={logoSrc}
          alt={`${tool.name} logo`}
          className='h-full w-auto object-contain max-w-[120px] filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500'
        />
      </div>
      
      {/* Name label — slides up from below on hover, no overlap */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none z-20">
        <span className="inline-block px-2 py-0.5 rounded-full bg-stone-900/90 dark:bg-amber-500/10 backdrop-blur-md border border-stone-800 dark:border-amber-500/20 font-mono text-[9px] font-bold text-white dark:text-amber-400 tracking-[0.15em] uppercase shadow-xl shadow-black/20 whitespace-nowrap">
          {tool.name}
        </span>
      </div>
    </div>
  )
}

export function TechMarquee() {
  const [tools, setTools] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTech() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/portfolio/technologies/`)
        if (response.ok) {
          const data = await response.json()
          setTools(data)
        }
      } catch (error) {
        console.error('Error fetching technologies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTech()
  }, [])

  if (loading || tools.length === 0) return null

  return (
    <section className="py-16 overflow-x-hidden w-full bg-[var(--bg-primary)] border-t border-stone-100 dark:border-white/5 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
      
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-8 relative z-10 text-center">
        {/* Eyebrow */}
        <p className="font-mono text-[10px] tracking-[0.4em] font-bold text-amber-500/60 uppercase mb-3">
          Trusted Tools &amp; Frameworks
        </p>

        {/* Main Heading */}
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3">
          <span className="text-[var(--text-primary)]">Our </span>
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Tech
          </span>
          <span className="text-[var(--text-primary)]"> Stack</span>
        </h2>

        {/* Subtle rule */}
        <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      {/* Marquee — single seamless row going left */}
      <div className="relative pt-6 pb-12">
        <InfiniteSlider gap={24} duration={60} className="pb-12 pt-2">
          {tools.map((tool) => (
            <TechCard key={tool.id} tool={tool} />
          ))}
        </InfiniteSlider>

        {/* Cinematic Fade Edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-48 z-10 bg-gradient-to-r from-[var(--bg-primary)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-48 z-10 bg-gradient-to-l from-[var(--bg-primary)] to-transparent" />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stone-200 dark:via-white/5 to-transparent" />
    </section>
  )
}
