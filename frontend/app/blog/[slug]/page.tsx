import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost, getPageSEO, incrementViewCount } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import GlassCard from '@/components/ui/GlassCard'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import ArticleSchema from '@/components/seo/schemas/ArticleSchema'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug).catch(() => null)
  if (!post) return {}

  const seo = await getPageSEO(`blog-${params.slug}`)
  return buildMetadata(seo, {
    title: `${post.title} | Phantex Tech Blog`,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
  })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug).catch(() => null)
  if (!post) notFound()

  // Proactively increment view count in background
  incrementViewCount(params.slug).catch(() => {})

  const thumbUrl = getMediaUrl(post.featured_image)
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ]

  return (
    <main className="pt-32 pb-24">
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArticleSchema post={post} url={`https://phantextech.com/blog/${post.slug}`} />
      
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <FadeIn className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
              {post.category.name}
            </span>
            <span className="text-stone-300">•</span>
            <time className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
              {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
            </time>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-[1.1] mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 py-8 border-y border-stone-100">
            {post.author.avatar ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-200">
                <Image src={getMediaUrl(post.author.avatar) as string} alt={post.author.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-[var(--text-muted)] border border-stone-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{post.author.name}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium leading-tight mt-0.5">{post.author.role || 'Engineering'}</p>
            </div>
          </div>
        </FadeIn>

        {/* Featured Image */}
        {thumbUrl && (
          <FadeIn delay={0.1} className="mb-12">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
              <Image src={thumbUrl} alt={post.title} fill className="object-cover" priority />
            </div>
          </FadeIn>
        )}

        {/* Content */}
        <FadeIn delay={0.2} className="prose prose-stone max-w-none">
          <div 
            className="font-body text-lg text-[var(--text-primary)] leading-relaxed space-y-6 blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </FadeIn>

        {/* Footer / CTA */}
        <FadeIn delay={0.3} className="mt-20 pt-16 border-t border-stone-100">
          <GlassCard className="p-10 text-center bg-[var(--bg-secondary)] border-stone-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">Enjoyed this article?</h3>
            <p className="font-body text-base text-[var(--text-muted)] mb-8 max-w-md mx-auto">
              We regularly share our findings on web scraping, automation, and AI. Subscribe to stay updated or talk to us about your project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="bg-amber-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-amber-600 transition-all duration-150 inline-block w-full sm:w-auto"
              >
                Start a Conversation
              </Link>
              <Link
                href="/services"
                className="bg-white border border-stone-200 text-[var(--text-primary)] font-semibold px-8 py-4 rounded-xl hover:border-amber-500/30 transition-all duration-150 inline-block w-full sm:w-auto"
              >
                View Services
              </Link>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </main>
  )
}
