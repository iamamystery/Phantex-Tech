import JsonLd from '../JsonLd'
import type { Post } from '@/types'

interface ArticleSchemaProps {
  post: Post
  url: string
}

export default function ArticleSchema({ post, url }: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.featured_image ? { image: post.featured_image } : {}),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    url,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.linkedin ? { url: post.author.linkedin } : {}),
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://phantextech.com/#organization',
      name: 'Phantex Tech',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return <JsonLd schema={schema} />
}
