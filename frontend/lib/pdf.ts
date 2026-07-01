// ─────────────────────────────────────────────────────────────────────────────
// A small, dependency-free PDF generator. It lays out a structured document
// (title page + headed sections with paragraphs and bullets) into a valid,
// multi-page PDF using the built-in Helvetica fonts — no fonts to embed, no npm
// packages. Output is a Uint8Array suitable for a Response body.
//
// It is intentionally limited to what our resource guides need: wrapped body
// text, bold headings, and bullet lists. Text is sanitized to WinAnsi-safe ASCII
// so glyphs always render.
// ─────────────────────────────────────────────────────────────────────────────

export interface PdfSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface PdfDocument {
  title: string
  subtitle: string
  footer: string
  sections: PdfSection[]
}

// Page geometry (US Letter, points).
const PAGE_W = 612
const PAGE_H = 792
const MARGIN_X = 64
const TOP_Y = 728
const BOTTOM_Y = 72
const CONTENT_W = PAGE_W - MARGIN_X * 2

type LineFont = 'F1' | 'F2' // F1 = Helvetica, F2 = Helvetica-Bold

interface Line {
  text: string
  font: LineFont
  size: number
  gapBefore: number // extra space added above this line
  color?: [number, number, number]
  keepWithNext?: boolean // avoid orphaning a heading at page bottom
}

// Replace fancy unicode punctuation with ASCII so standard Helvetica renders it,
// then escape the PDF string delimiters.
function sanitize(text: string): string {
  return text
    .replace(/[‘’‚]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/•/g, '-')
    .replace(/[ ]/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
}

function escapePdf(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

// Approximate Helvetica width (average advance ≈ 0.5em; conservative so wrapped
// lines never overflow the right margin).
function textWidth(text: string, size: number): number {
  return text.length * size * 0.5
}

function wrap(text: string, size: number, maxWidth: number): string[] {
  const words = sanitize(text).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (textWidth(candidate, size) > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

export function generatePdf(doc: PdfDocument): Uint8Array {
  // 1. Flatten the document into a sequence of positioned lines.
  const lines: Line[] = []

  // Title block
  for (const t of wrap(doc.title, 26, CONTENT_W)) {
    lines.push({ text: t, font: 'F2', size: 26, gapBefore: 8 })
  }
  for (const t of wrap(doc.subtitle, 12, CONTENT_W)) {
    lines.push({ text: t, font: 'F1', size: 12, gapBefore: 6, color: [0.45, 0.45, 0.45] })
  }
  lines.push({ text: '', font: 'F1', size: 12, gapBefore: 18 }) // spacer

  for (const section of doc.sections) {
    for (const h of wrap(section.heading, 15, CONTENT_W)) {
      lines.push({ text: h, font: 'F2', size: 15, gapBefore: 22, color: [0.06, 0.06, 0.06], keepWithNext: true })
    }
    for (const para of section.paragraphs) {
      for (const l of wrap(para, 10.5, CONTENT_W)) {
        lines.push({ text: l, font: 'F1', size: 10.5, gapBefore: 4, color: [0.2, 0.2, 0.2] })
      }
      lines.push({ text: '', font: 'F1', size: 10.5, gapBefore: 4 }) // paragraph gap
    }
    for (const bullet of section.bullets ?? []) {
      const wrapped = wrap(bullet, 10.5, CONTENT_W - 16)
      wrapped.forEach((l, idx) => {
        lines.push({
          text: idx === 0 ? `-  ${l}` : `   ${l}`,
          font: 'F1',
          size: 10.5,
          gapBefore: idx === 0 ? 5 : 2,
          color: [0.2, 0.2, 0.2],
        })
      })
    }
  }

  // 2. Paginate into content streams.
  const pages: string[] = []
  let body = ''
  let y = TOP_Y
  let firstOnPage = true

  const flushPage = () => {
    pages.push(body)
    body = ''
    y = TOP_Y
    firstOnPage = true
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineHeight = line.size * 1.32
    const advance = (firstOnPage ? 0 : line.gapBefore) + lineHeight

    // Keep a heading with at least its following line on the same page.
    let needed = advance
    if (line.keepWithNext && i + 1 < lines.length) {
      needed += lines[i + 1].size * 1.32 + lines[i + 1].gapBefore
    }

    if (!firstOnPage && y - needed < BOTTOM_Y) {
      flushPage()
    }

    y -= firstOnPage ? lineHeight : line.gapBefore + lineHeight
    firstOnPage = false

    if (line.text) {
      const [r, g, b] = line.color ?? [0, 0, 0]
      body +=
        `BT /${line.font} ${line.size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ` +
        `1 0 0 1 ${MARGIN_X} ${y.toFixed(2)} Tm (${escapePdf(line.text)}) Tj ET\n`
    }
  }

  // Flush the final (in-progress) page, guaranteeing at least one page.
  if (body || pages.length === 0) pages.push(body)

  // Footer on every page.
  const footerText = escapePdf(sanitize(doc.footer))
  const withFooter = pages.map(
    (p, idx) =>
      p +
      `BT /F1 8 Tf 0.6 0.6 0.6 rg 1 0 0 1 ${MARGIN_X} 48 Tm ` +
      `(${footerText}   |   Page ${idx + 1} of ${pages.length}) Tj ET\n`
  )

  // 3. Assemble the PDF objects with a correct xref table.
  const objects: string[] = []
  const pageCount = withFooter.length

  // Object numbering:
  // 1 = Catalog, 2 = Pages, 3 = Helvetica, 4 = Helvetica-Bold,
  // then for each page: a Page object and a Contents object.
  const firstPageObj = 5
  const kids: string[] = []
  for (let p = 0; p < pageCount; p++) {
    const pageObjNum = firstPageObj + p * 2
    kids.push(`${pageObjNum} 0 R`)
  }

  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`
  objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pageCount} >>`
  objects[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`
  objects[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`

  for (let p = 0; p < pageCount; p++) {
    const pageObjNum = firstPageObj + p * 2
    const contentObjNum = pageObjNum + 1
    const stream = withFooter[p]
    objects[pageObjNum] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjNum} 0 R >>`
    objects[contentObjNum] =
      `<< /Length ${stream.length} >>\nstream\n${stream}endstream`
  }

  // 4. Serialize with byte offsets for the xref.
  const maxObj = firstPageObj + pageCount * 2 - 1
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
  const offsets: number[] = []
  for (let n = 1; n <= maxObj; n++) {
    offsets[n] = pdf.length
    pdf += `${n} 0 obj\n${objects[n]}\nendobj\n`
  }

  const xrefStart = pdf.length
  pdf += `xref\n0 ${maxObj + 1}\n`
  pdf += `0000000000 65535 f \n`
  for (let n = 1; n <= maxObj; n++) {
    pdf += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${maxObj + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  // Latin1 preserves the binary header bytes and ASCII body 1:1.
  const bytes = new Uint8Array(pdf.length)
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff
  return bytes
}
