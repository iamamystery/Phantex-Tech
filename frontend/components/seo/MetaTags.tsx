import type { Metadata } from 'next'
import type { PageSEO } from '@/types'

const SITE_URL = 'https://phantextech.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

interface MetaDefaults {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: string
}

export function buildMetadata(seo: PageSEO | null, defaults: MetaDefaults): Metadata {
  const title = seo?.meta_title || defaults.title
  const description = seo?.meta_description || defaults.description
  const canonical = seo?.canonical_url || `${SITE_URL}${defaults.path}`
  const ogTitle = seo?.og_title || title
  const ogDescription = seo?.og_description || description
  const image = seo?.og_image || defaults.image || DEFAULT_OG_IMAGE
  const type = defaults.type ?? 'website'

  return {
    title,
    description,
    robots: seo?.no_index
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  }
}
