export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Body text is written as plain paragraphs, optionally broken into named
// sections with a "## Heading" line (see BlogPostForm's body field hint).
// Blocks before the first heading (or the whole body, if there are no
// headings at all) get `heading: null` and just render as plain paragraphs
// with no table-of-contents entry.
//
// A line containing only `![alt](url)` (BlogPostForm's "Insert Image"
// button writes exactly this) becomes its own inline image between
// paragraphs, instead of being treated as text.
const IMAGE_LINE = /^!\[([^\]]*)\]\((\S+)\)$/

export function parseBody(text) {
  const blocks = []
  let current = { heading: null, id: null, paragraphs: [] }
  let buffer = []

  const flushParagraph = () => {
    const paragraph = buffer.join(' ').trim()
    if (paragraph) current.paragraphs.push({ type: 'text', content: paragraph })
    buffer = []
  }

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    const imageMatch = line.match(IMAGE_LINE)
    if (line.startsWith('## ')) {
      flushParagraph()
      if (current.heading || current.paragraphs.length) blocks.push(current)
      const heading = line.slice(3).trim()
      current = { heading, id: slugifyHeading(heading), paragraphs: [] }
    } else if (imageMatch) {
      flushParagraph()
      current.paragraphs.push({ type: 'image', url: imageMatch[2], alt: imageMatch[1] })
    } else if (line === '') {
      flushParagraph()
    } else {
      buffer.push(line)
    }
  }
  flushParagraph()
  if (current.heading || current.paragraphs.length) blocks.push(current)

  return blocks
}
