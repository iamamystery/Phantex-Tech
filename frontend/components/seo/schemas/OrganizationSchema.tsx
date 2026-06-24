import JsonLd from '../JsonLd'

export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://phantextech.com/#organization',
        name: 'Phantex Tech',
        url: 'https://phantextech.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://phantextech.com/og-image.jpg',
        },
        description:
          'Phantex Tech is a web automation agency helping SaaS startups scale with web scraping, AI pipelines, backend systems, and custom automation.',
        sameAs: [
          'https://twitter.com/phantextech',
          'https://linkedin.com/company/phantextech',
          'https://instagram.com/phantextech',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@phantextech.com',
          contactType: 'customer service',
          availableLanguage: 'English',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://phantextech.com/#website',
        url: 'https://phantextech.com',
        name: 'Phantex Tech',
        description: 'Web automation agency for SaaS startups',
        publisher: { '@id': 'https://phantextech.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://phantextech.com/blog?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return <JsonLd schema={schema} />
}
