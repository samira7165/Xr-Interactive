import { ContactSchema, PostSchema, CommentSchema, ApplicationSchema } from '@/lib/validation'

describe('ContactSchema', () => {
  const valid = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '',
    message: 'I need a VR experience built for an upcoming event.',
  }

  it('accepts a valid submission', () => {
    expect(ContactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a message that is too short', () => {
    expect(ContactSchema.safeParse({ ...valid, message: 'Hi' }).success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(ContactSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })
})

describe('PostSchema slug validation', () => {
  const base = {
    title: 'A Post',
    slug: 'a-post',
    excerpt: 'Excerpt',
    body: '',
    category: 'VR',
    image: 'https://example.com/x.png',
    published: true,
  }

  it('accepts a lowercase, hyphenated slug', () => {
    expect(PostSchema.safeParse(base).success).toBe(true)
  })

  it.each(['A Post', 'a_post', 'a post', 'a--post!'])('rejects an invalid slug: %s', (slug) => {
    expect(PostSchema.safeParse({ ...base, slug }).success).toBe(false)
  })
})

describe('CommentSchema', () => {
  it('rejects an empty comment body', () => {
    expect(CommentSchema.safeParse({ name: 'Jane', body: '' }).success).toBe(false)
  })

  it('rejects a comment body over 2000 characters', () => {
    expect(CommentSchema.safeParse({ name: 'Jane', body: 'a'.repeat(2001) }).success).toBe(false)
  })
})

// ApplicationSchema.resumeUrl/linkedin use the httpUrl() refinement, which
// exists specifically to reject non-http(s) schemes before they can be
// rendered as a raw <a href> on the admin applications page.
describe('ApplicationSchema httpUrl guard', () => {
  const base = {
    name: 'Jane',
    email: 'jane@example.com',
    country: 'Bangladesh',
    resumeUrl: 'https://blob.vercel-storage.com/resume.pdf',
  }

  it('accepts an https resume URL', () => {
    expect(ApplicationSchema.safeParse(base).success).toBe(true)
  })

  it('rejects a javascript: resume URL', () => {
    expect(ApplicationSchema.safeParse({ ...base, resumeUrl: 'javascript:alert(1)' }).success).toBe(false)
  })

  it('rejects a data: linkedin URL', () => {
    const result = ApplicationSchema.safeParse({
      ...base,
      linkedin: 'data:text/html,<script>alert(1)</script>',
    })
    expect(result.success).toBe(false)
  })

  it('allows an empty linkedin field since it is optional', () => {
    expect(ApplicationSchema.safeParse({ ...base, linkedin: '' }).success).toBe(true)
  })
})
