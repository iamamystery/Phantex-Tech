import type { Metadata } from 'next'
import { getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import OrganizationSchema from '@/components/seo/schemas/OrganizationSchema'
import Hero from '@/components/home/Hero'
import ServicesSnap from '@/components/home/ServicesSnap'
import FeaturedWork from '@/components/home/FeaturedWork'
import SectionHeader from '@/components/ui/SectionHeader'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'
import HomeCTA from '@/components/home/HomeCTA'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('home')
  return buildMetadata(seo, {
    title: 'Web Automation Agency for SaaS Startups | Phantex Tech',
    description:
      'Phantex Tech is a web automation agency helping SaaS startups scale with web scraping, AI pipelines, backend systems, and custom automation.',
    path: '/',
  })
}

export default function HomePage() {
  return (
    <main>
      <OrganizationSchema />
      <Hero />
      <ServicesSnap />
      <FeaturedWork />
      
      {/* ─── Testimonials ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-20 mb-10">
        <SectionHeader
          label="Wall of Love"
          title="What our partners say about us"
          subtitle="Don't just take our word for it. Here is what SaaS founders and engineering leads have to say."
          align="center"
        />
        <TestimonialMarquee />
      </div>

      <HomeCTA />
    </main>
  )
}
