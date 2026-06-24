import type { MetadataRoute } from 'next'
import { getSitemapUrls } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://phantextech.com'
  
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const urls = await getSitemapUrls()
    if (urls && Array.isArray(urls)) {
      dynamicRoutes = urls.map((item) => ({
        url: `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
        lastModified: item.lastmod ? new Date(item.lastmod) : new Date(),
        changeFrequency: (item.changefreq || 'monthly') as any,
        priority: item.priority || 0.5,
      }))
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Sitemap fetch failed:', error)
    }
  }

  const serviceSlugs = ['web-scraping', 'automation', 'backend', 'frontend', 'api', 'ai']
  const fallbackServices = serviceSlugs.map(slug => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>()
  
  fallbackServices.forEach((route: MetadataRoute.Sitemap[number]) => sitemapMap.set(route.url, route))
  staticRoutes.forEach((route: MetadataRoute.Sitemap[number]) => sitemapMap.set(route.url, route))
  dynamicRoutes.forEach((route: MetadataRoute.Sitemap[number]) => sitemapMap.set(route.url, route))

  return Array.from(sitemapMap.values()).sort((a, b) => 
    (b.priority || 0) - (a.priority || 0)
  )
}
