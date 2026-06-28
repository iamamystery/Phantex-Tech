import type { Metadata } from 'next'
import { getPageSEO } from '@/lib/api'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import BlogPageContent from '@/components/blog/BlogPageContent'
import {
  getAllSummaries,
  getFeaturedArticle,
  getTrending,
  getMostRead,
  getEditorsPicks,
  getCategories,
  getUsedTags,
  getArticlesByAuthor,
  AUTHORS,
  toSummary,
} from '@/content'
import { getCaseStudies } from '@/content/case-studies'
import { getResources } from '@/content/resources'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('blog')
  return buildMetadata(seo, {
    title: 'Engineering Publication — Insights & Systems | Phantex Tech',
    description:
      'Practical knowledge on AI systems, automation, backend engineering, data infrastructure, and modern product development from the Phantex engineering team.',
    path: '/blog',
  })
}

export default function BlogPage() {
  const articles = getAllSummaries()
  const featured = toSummary(getFeaturedArticle())
  const trending = getTrending(5).map(toSummary)
  const mostRead = getMostRead(5).map(toSummary)
  const editorsPicks = getEditorsPicks(3).map(toSummary)
  const categories = getCategories()
  const tags = getUsedTags()

  const authors = AUTHORS.map((a) => ({
    slug: a.slug,
    name: a.name,
    initials: a.initials,
    role: a.role,
    expertise: a.expertise,
    bio: a.bio,
    tech: a.tech,
    articleCount: getArticlesByAuthor(a.slug).length,
  }))

  const caseStudies = getCaseStudies().map((c) => ({
    slug: c.slug,
    client: c.client,
    tag: c.tag,
    category: c.category,
    metric: c.metric,
    metricLabel: c.metricLabel,
    summary: c.summary,
  }))

  const resources = getResources().map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    pages: r.pages,
    format: r.format,
  }))

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />
      <BlogPageContent
        articles={articles}
        featured={featured}
        trending={trending}
        mostRead={mostRead}
        editorsPicks={editorsPicks}
        categories={categories}
        tags={tags}
        authors={authors}
        caseStudies={caseStudies}
        resources={resources}
      />
    </>
  )
}
