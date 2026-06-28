import { getResource, getResourceSlugs } from '@/content/resources'
import { resolveAuthor } from '@/content/authors'
import { generatePdf } from '@/lib/pdf'

// Generates and serves a real, multi-page PDF for each resource on demand.
// The PDF content is built from the resource's structured `document`, so the
// download and the on-page preview can never drift apart.

export function generateStaticParams() {
  return getResourceSlugs().map((slug) => ({ slug }))
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const resource = getResource(params.slug)
  if (!resource) {
    return new Response('Resource not found', { status: 404 })
  }

  const author = resolveAuthor(resource.author)
  const pdf = generatePdf({
    title: resource.document.title,
    subtitle: resource.document.subtitle,
    footer: `Phantex Tech  -  ${resource.title}  -  v${resource.version}  -  ${author.name}`,
    sections: resource.document.sections,
  })

  // Node's Response fully supports a Uint8Array body at runtime; the cast only
  // works around the DOM lib's narrower BodyInit typing.
  return new Response(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${resource.slug}.pdf"`,
      'Content-Length': String(pdf.byteLength),
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
