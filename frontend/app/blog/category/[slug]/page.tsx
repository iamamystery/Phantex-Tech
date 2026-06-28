import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/components/seo/MetaTags'
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema'
import TaxonomyListing from '@/components/blog/TaxonomyListing'
import { getCategories, getCategory, getArticlesByCategory, toSummary } from '@/content'

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug)
  if (!category) return {}
  return buildMetadata(null, {
    title: `${category.name} Articles | Phantex Tech Blog`,
    description: category.description,
    path: `/blog/category/${category.slug}`,
  })
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug)
  if (!category) notFound()

  const articles = getArticlesByCategory(category.slug).map(toSummary)

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: category.name, href: `/blog/category/${category.slug}` },
        ]}
      />
      <TaxonomyListing eyebrow="Category" title={category.name} description={category.description} articles={articles} />
    </>
  )
}
