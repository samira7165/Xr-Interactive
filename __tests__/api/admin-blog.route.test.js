/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST as createPost } from '@/app/api/admin/blog/route'
import { POST as updatePost } from '@/app/api/admin/blog/[id]/route'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { adminSession, formDataRequest } from '../helpers/api'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { post: { create: jest.fn(), update: jest.fn() } },
}))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const validFields = {
  title: 'Launching our new VR platform',
  slug: 'launching-our-new-vr-platform',
  excerpt: 'A short teaser for the post.',
  body: 'The full post body.',
  category: 'Announcements',
  image: 'https://example.com/cover.png',
  published: 'true',
}

function createRequest(fields = validFields) {
  return formDataRequest('http://localhost/api/admin/blog', fields)
}

function updateRequest(fields = validFields) {
  return formDataRequest('http://localhost/api/admin/blog/1', fields)
}

describe('POST /api/admin/blog (create)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await createPost(createRequest())

    expect(response.status).toBe(401)
    expect(prisma.post.create).not.toHaveBeenCalled()
  })

  it('rejects an invalid payload without touching the database', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await createPost(createRequest({ ...validFields, title: '', slug: 'BAD SLUG' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('title')
    expect(json.errors).toHaveProperty('slug')
    expect(prisma.post.create).not.toHaveBeenCalled()
  })

  it('creates the post and revalidates the public and admin blog pages', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.post.create.mockResolvedValue({ id: 1 })

    const response = await createPost(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true })
    expect(prisma.post.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: validFields.title, slug: validFields.slug, published: true }),
    })
    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/blog')
  })

  it('stores a null body when the body field is left blank', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.post.create.mockResolvedValue({ id: 1 })

    await createPost(createRequest({ ...validFields, body: '' }))

    expect(prisma.post.create).toHaveBeenCalledWith({ data: expect.objectContaining({ body: null }) })
  })

  it('returns 500 when the database write fails', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.post.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`slug`)'))

    const response = await createPost(createRequest())
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.message).toMatch(/unique constraint/i)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe('POST /api/admin/blog/[id] (update)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function call(fields, id = '1') {
    return updatePost(updateRequest(fields), { params: Promise.resolve({ id }) })
  }

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await call(validFields)

    expect(response.status).toBe(401)
    expect(prisma.post.update).not.toHaveBeenCalled()
  })

  it('rejects an invalid payload without touching the database', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await call({ ...validFields, excerpt: '' })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('excerpt')
    expect(prisma.post.update).not.toHaveBeenCalled()
  })

  it('updates the post by numeric id and revalidates', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.post.update.mockResolvedValue({ id: 42 })

    const response = await call(validFields, '42')
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true })
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: expect.objectContaining({ title: validFields.title }),
    })
    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/blog')
  })

  it('returns 500 when the record does not exist', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.post.update.mockRejectedValue(new Error('Record to update not found.'))

    const response = await call(validFields, '999')
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.message).toMatch(/not found/i)
  })
})
