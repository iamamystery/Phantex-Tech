import type { Metadata } from 'next'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import TaxonomyListing from '@/components/blog/TaxonomyListing'
import { getAllTagSlugs, resolveTag, getArticlesByTag, toSummary } from '@/content'

export function generateStaticParams() {
  return getAllTagSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tag = resolveTag(params.slug)
  return buildMetadata(null, {
    title: `#${tag.name} Articles | Phantex Tech Blog`,
    description: `Engineering articles tagged ${tag.name} from the Phantex engineering team.`,
    path: `/blog/tag/${tag.slug}`,
  })
}

export default function TagPage({ params }: { params: { slug: string } }) {
  // Every registered tag renders; unused tags show a graceful empty state.
  const tag = resolveTag(params.slug)
  const articles = getArticlesByTag(params.slug).map(toSummary)

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: `#${tag.name}`, href: `/blog/tag/${tag.slug}` },
        ]}
      />
      <TaxonomyListing
        eyebrow="Tag"
        title={`#${tag.name}`}
        description={`Articles tagged ${tag.name}.`}
        articles={articles}
      />
    </>
  )
}
