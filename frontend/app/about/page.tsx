import type { Metadata } from 'next'
import { getMembers, getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import TechBadge from '@/components/ui/TechBadge'
import OrganizationSchema from '@/components/seo/schemas/OrganizationSchema'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'
import { MagicCard } from '@/components/magicui/magic-card'
import type { Member } from '@/types'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('about')
  return buildMetadata(seo, {
    title: 'Phantex Tech Web Automation Agency Team | About Us',
    description:
      'We are a team of automation engineers and AI specialists dedicated to helping SaaS startups scale through intelligent data extraction and process automation.',
    path: '/about',
  })
}

export default async function AboutPage() {
  let members: Member[] = []
  try {
    members = await getMembers()
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_BUILD_MODE !== '1') {
        console.warn('About: API unreachable at build time. Dynamic content will be fetched at runtime.')
      }
    } else {
      console.error('Failed to fetch team members:', error)
    }
  }

  return (
    <main className="pt-32 pb-24">
      <OrganizationSchema />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Intro */}
        <FadeIn className="mb-24">
          <SectionHeader
            label="Our Story"
            title="We build what powers you"
            subtitle="Phantex Tech was founded with a single mission: to provide SaaS startups with the industrial-grade automation tools and data pipelines they need to compete at scale."
            align="left"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 font-body text-lg text-[var(--text-muted)] leading-relaxed">
            <p>
              In the fast-paced world of SaaS, data is the most valuable asset. But extracting that data and automating the workflows around it is often complex, brittle, and time-consuming. We saw too many teams struggling with broken scrapers and manual data entry.
            </p>
            <p>
              That&apos;s where we come in. We combine deep expertise in browser automation, backend architecture, and AI to build solutions that don&apos;t just work—they scale. We&apos;re not just a service provider; we&apos;re your technical partner in automation.
            </p>
          </div>
        </FadeIn>
 
        {/* Team Section with Atmospheric Background */}
        <div className="relative -mx-6 px-6 py-40 mt-24 mb-32 overflow-hidden group/team">
          {/* Section Gradient Background */}
          <div className="absolute inset-0 bg-[#0A0A0A]" />
          
          {/* Subtle Glow Overlays */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <FadeIn className="mb-16">
              <SectionHeader
                label="The Team"
                title="Meet the experts behind the code"
                align="center"
                dark
              />
            </FadeIn>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, i) => {
                const avatarUrl = getMediaUrl(member.avatar)
                return (
                  <FadeIn key={member.name} delay={i * 0.1}>
                    <MagicCard 
                      className="p-10 flex flex-col items-center h-[600px] text-center border-none bg-stone-900/40 backdrop-blur-xl"
                      gradientFrom="#FEF3C7" // Light Champagne
                      gradientTo="#D97706"   // Rich Amber
                      gradientSize={350}
                    >
                      <div className="relative w-28 h-28 rounded-3xl overflow-hidden mb-8 shadow-2xl ring-2 ring-white/10 group-hover:ring-amber-500/30 transition-all duration-500">
                        {avatarUrl ? (
                          <Image 
                            src={avatarUrl} 
                            alt={member.name} 
                            fill 
                            className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center text-amber-500/50">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-display text-2xl font-black text-white mb-2 tracking-tight">
                        {member.name}
                      </h3>
                      <div>
                        <p className="font-display text-[10px] font-bold text-amber-200 bg-amber-900/30 uppercase tracking-[0.35em] mb-6 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block shadow-sm">
                          {member.role}
                        </p>
                      </div>
                      
                      <p className="font-body text-sm text-stone-400 leading-relaxed mb-8 max-w-[280px] mx-auto group-hover:text-white transition-colors line-clamp-2">
                        {member.bio}
                      </p>
    
                      <div className="flex items-center justify-center gap-6 mb-8">
                        {member.linkedin && (
                          <div className="group/icon relative">
                            <a 
                              href={member.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-11 h-11 rounded-2xl bg-stone-900/50 flex items-center justify-center text-amber-500/60 hover:text-amber-200 hover:bg-amber-900/40 border border-white/10 hover:border-amber-500/50 transition-all duration-300 pointer-events-auto shadow-sm"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 scale-95 group-hover/icon:opacity-100 group-hover/icon:scale-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                              LinkedIn
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900/90" />
                            </div>
                          </div>
                        )}
                        {member.github && (
                          <div className="group/icon relative">
                            <a 
                              href={member.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-11 h-11 rounded-2xl bg-stone-900/50 flex items-center justify-center text-amber-500/60 hover:text-amber-200 hover:bg-amber-900/40 border border-white/10 hover:border-amber-500/50 transition-all duration-300 pointer-events-auto shadow-sm"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                              </svg>
                            </a>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 scale-95 group-hover/icon:opacity-100 group-hover/icon:scale-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                              GitHub
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900/90" />
                            </div>
                          </div>
                        )}
                        {member.email && (
                          <div className="group/icon relative">
                            <a 
                              href={`mailto:${member.email}`}
                              className="w-11 h-11 rounded-2xl bg-stone-900/50 flex items-center justify-center text-amber-500/60 hover:text-amber-200 hover:bg-amber-900/40 border border-white/10 hover:border-amber-500/50 transition-all duration-300 pointer-events-auto shadow-sm"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                              </svg>
                            </a>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 scale-95 group-hover/icon:opacity-100 group-hover/icon:scale-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                              {member.email}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900/90" />
                            </div>
                          </div>
                        )}
                        {member.phone_number && (
                          <div className="group/icon relative">
                            <a 
                              href={`tel:${member.phone_number}`}
                              className="w-11 h-11 rounded-2xl bg-stone-900/50 flex items-center justify-center text-amber-500/60 hover:text-amber-200 hover:bg-amber-900/40 border border-white/10 hover:border-amber-500/50 transition-all duration-300 pointer-events-auto shadow-sm"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                              </svg>
                            </a>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 scale-95 group-hover/icon:opacity-100 group-hover/icon:scale-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                              {member.phone_number}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900/90" />
                            </div>
                          </div>
                        )}
                      </div>
    
                      <div className="mt-auto pt-8 border-t border-white/5 w-full">
                        <div className="flex flex-wrap justify-center gap-2 px-1 max-h-[80px] overflow-hidden">
                          {member.skills.map((skill: string) => (
                            <TechBadge key={skill} name={skill} />
                          ))}
                        </div>
                      </div>
                    </MagicCard>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32">
          <SectionHeader
            label="Client Feedback"
            title="Trusted by engineering teams"
            subtitle="We build tools that engineering leads and product managers love to use."
            align="center"
          />
          <TestimonialMarquee />
        </div>

        {/* Values Section */}
        <FadeIn className="mt-32 py-20 rounded-3xl bg-amber-500/5 border border-amber-500/10 text-center px-6">
          <SectionHeader
            label="Our Values"
            title="Quality without compromise"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="font-display font-bold text-[var(--text-primary)]">Resilience</h4>
              <p className="font-body text-sm text-[var(--text-muted)]">We build scrapers that handle real-world web complexity.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-display font-bold text-[var(--text-primary)]">Transparency</h4>
              <p className="font-body text-sm text-[var(--text-muted)]">Clear communication and production-ready documentation.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-display font-bold text-[var(--text-primary)]">Speed</h4>
              <p className="font-body text-sm text-[var(--text-muted)]">Fast delivery without sacrificing code quality.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-display font-bold text-[var(--text-primary)]">Trust</h4>
              <p className="font-body text-sm text-[var(--text-muted)]">Your data and intellectual property are always secure.</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
