import type { Metadata } from 'next'
import { getPosts, getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import SectionHeader from '@/components/ui/SectionHeader'
import FadeIn from '@/components/ui/FadeIn'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('blog')
  return buildMetadata(seo, {
    title: 'Web Scraping & Automation Tutorials | Phantex Tech Blog',
    description:
      'Learn the latest techniques in web scraping, browser automation, and AI pipeline integration from our expert engineering team.',
    path: '/blog',
  })
}

export default async function BlogPage() {
  let posts: any[] = []
  try {
    const data = await getPosts()
    posts = data.results
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_BUILD_MODE !== '1') {
        console.warn('Blog: API unreachable at build time. Dynamic content will be fetched at runtime.')
      }
    } else {
      console.error('Failed to fetch blog posts:', error)
    }
  }

  return (
    <main className="pt-32 pb-24">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]} />
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <SectionHeader
              label="Engineering Blog"
              title="Insights on automation and data extraction"
              subtitle="Deep dives into the tools and techniques we use to solve complex data challenges for our clients."
              align="left"
            />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => {
            const thumbUrl = getMediaUrl(post.featured_image)
            return (
              <FadeIn key={post.slug} delay={i * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full glass-effect overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-stone-50">
                        <div className="w-10 h-10 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h.008v.008H15V7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/90 backdrop-blur-md text-amber-600 border border-amber-500/20 shadow-sm">
                        {post.category?.name || 'Engineering'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <time className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                      <span className="text-[10px] text-stone-300">•</span>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                        {post.read_time} min read
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-amber-500 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        By {post.author?.name || 'Phantex Tech Team'}
                      </span>
                      <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </main>
  )
}
