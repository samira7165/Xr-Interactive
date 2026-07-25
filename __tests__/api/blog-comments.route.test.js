/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST } from '@/app/api/blog/[slug]/comments/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: { post: { findUnique: jest.fn() }, comment: { create: jest.fn() } },
}))

// Each test uses its own IP so the rate-limit module's shared bucket Map
// never lets one test's request count bleed into another's.
let ipCounter = 0
function postRequest(body, { ip = `10.0.1.${++ipCounter}` } = {}) {
  return new Request('http://localhost/api/blog/some-post/comments', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

const validComment = { name: 'Ada Lovelace', body: 'Great write-up, thanks for sharing!' }

function call(body, params = { slug: 'some-post' }, opts) {
  return POST(postRequest(body, opts), { params: Promise.resolve(params) })
}

describe('POST /api/blog/[slug]/comments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates an unapproved comment for a published post', async () => {
    prisma.post.findUnique.mockResolvedValue({ id: 7, published: true })
    prisma.comment.create.mockResolvedValue({ id: 1 })

    const response = await call(validComment)
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json).toEqual({ status: 'pending' })
    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: { ...validComment, postId: 7, approved: false },
    })
  })

  it('returns 404 for a post that does not exist', async () => {
    prisma.post.findUnique.mockResolvedValue(null)

    const response = await call(validComment)

    expect(response.status).toBe(404)
    expect(prisma.comment.create).not.toHaveBeenCalled()
  })

  it('returns 404 for an unpublished post', async () => {
    prisma.post.findUnique.mockResolvedValue({ id: 7, published: false })

    const response = await call(validComment)

    expect(response.status).toBe(404)
    expect(prisma.comment.create).not.toHaveBeenCalled()
  })

  it('rejects an invalid comment without touching the database', async () => {
    prisma.post.findUnique.mockResolvedValue({ id: 7, published: true })

    const response = await call({ name: '', body: '' })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('name')
    expect(json.errors).toHaveProperty('body')
    expect(prisma.comment.create).not.toHaveBeenCalled()
  })

  it('rate-limits repeated submissions from the same IP', async () => {
    const ip = '10.0.1.99'
    prisma.post.findUnique.mockResolvedValue({ id: 7, published: true })
    prisma.comment.create.mockResolvedValue({ id: 1 })

    for (let i = 0; i < 5; i++) {
      const response = await call(validComment, { slug: 'some-post' }, { ip })
      expect(response.status).toBe(201)
    }

    const blocked = await call(validComment, { slug: 'some-post' }, { ip })
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
    expect(prisma.comment.create).toHaveBeenCalledTimes(5)
  })
})
