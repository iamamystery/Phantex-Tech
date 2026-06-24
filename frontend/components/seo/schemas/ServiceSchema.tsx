import JsonLd from '../JsonLd'

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
}

export default function ServiceSchema({ name, description, url }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      '@id': 'https://phantextech.com/#organization',
      name: 'Phantex Tech',
    },
    areaServed: 'Worldwide',
    serviceType: name,
  }

  return <JsonLd schema={schema} />
}
