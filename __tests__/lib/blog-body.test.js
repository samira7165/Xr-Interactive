import { parseBody, slugifyHeading } from '@/lib/blog-body'

describe('slugifyHeading', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyHeading('Project Goal')).toBe('project-goal')
  })

  it('strips punctuation and collapses runs of separators', () => {
    expect(slugifyHeading('What is AI, really?!')).toBe('what-is-ai-really')
  })

  it('trims leading/trailing hyphens produced by leading/trailing punctuation', () => {
    expect(slugifyHeading('  -Hello-  ')).toBe('hello')
  })
})

describe('parseBody', () => {
  it('treats a body with no headings as one heading-less block of paragraphs', () => {
    const blocks = parseBody('First paragraph.\n\nSecond paragraph.')

    expect(blocks).toEqual([
      {
        heading: null,
        id: null,
        paragraphs: [
          { type: 'text', content: 'First paragraph.' },
          { type: 'text', content: 'Second paragraph.' },
        ],
      },
    ])
  })

  it('joins consecutive non-blank lines into a single paragraph', () => {
    const blocks = parseBody('Line one\nLine two\n\nLine three')

    expect(blocks[0].paragraphs).toEqual([
      { type: 'text', content: 'Line one Line two' },
      { type: 'text', content: 'Line three' },
    ])
  })

  it('starts a new named section on a "## Heading" line', () => {
    const blocks = parseBody('Intro text.\n\n## Project Goal\nWe wanted to build X.\n\n## Outcome\nIt shipped.')

    expect(blocks).toEqual([
      { heading: null, id: null, paragraphs: [{ type: 'text', content: 'Intro text.' }] },
      {
        heading: 'Project Goal',
        id: 'project-goal',
        paragraphs: [{ type: 'text', content: 'We wanted to build X.' }],
      },
      { heading: 'Outcome', id: 'outcome', paragraphs: [{ type: 'text', content: 'It shipped.' }] },
    ])
  })

  it('drops a heading that has no body text and no following heading (nothing to render)', () => {
    // Regression guard: only the *last* heading is exempt from the "has
    // content" check, since it's still being accumulated when the loop ends.
    const blocks = parseBody('## Empty Section')

    expect(blocks).toEqual([{ heading: 'Empty Section', id: 'empty-section', paragraphs: [] }])
  })

  it('parses a standalone "![alt](url)" line as an inline image between paragraphs', () => {
    const blocks = parseBody('Before the image.\n\n![A description](https://example.com/pic.png)\n\nAfter the image.')

    expect(blocks[0].paragraphs).toEqual([
      { type: 'text', content: 'Before the image.' },
      { type: 'image', url: 'https://example.com/pic.png', alt: 'A description' },
      { type: 'text', content: 'After the image.' },
    ])
  })

  it('parses an image with an empty alt (BlogPostForm always writes "![](url)")', () => {
    const blocks = parseBody('![](https://example.com/pic.png)')

    expect(blocks[0].paragraphs).toEqual([{ type: 'image', url: 'https://example.com/pic.png', alt: '' }])
  })

  it('supports multiple images throughout the body, including inside a named section', () => {
    const blocks = parseBody(
      '![](https://example.com/1.png)\n\n## Gallery\n![](https://example.com/2.png)\n![](https://example.com/3.png)'
    )

    expect(blocks[0].paragraphs).toEqual([{ type: 'image', url: 'https://example.com/1.png', alt: '' }])
    expect(blocks[1].paragraphs).toEqual([
      { type: 'image', url: 'https://example.com/2.png', alt: '' },
      { type: 'image', url: 'https://example.com/3.png', alt: '' },
    ])
  })

  it('does not treat inline "![](url)" text embedded mid-paragraph as an image', () => {
    // The parser only recognizes an image tag that is the *entire* line
    // (see IMAGE_LINE) — this documents that intentional limitation rather
    // than silently swallowing part of a sentence that happens to look
    // similar.
    const blocks = parseBody('See the diagram ![](https://example.com/pic.png) above.')

    expect(blocks[0].paragraphs).toEqual([
      { type: 'text', content: 'See the diagram ![](https://example.com/pic.png) above.' },
    ])
  })

  it('returns no blocks for an empty body', () => {
    expect(parseBody('')).toEqual([])
  })

  it('ignores blank lines at the start and end', () => {
    const blocks = parseBody('\n\nOnly paragraph.\n\n\n')

    expect(blocks).toEqual([{ heading: null, id: null, paragraphs: [{ type: 'text', content: 'Only paragraph.' }] }])
  })
})
