/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { GET } from '@/app/api/admin/applications/[id]/resume/route'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { get } from '@vercel/blob'
import { adminSession } from '../helpers/api'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { jobApplication: { findUnique: jest.fn() } },
}))
jest.mock('@vercel/blob', () => ({ get: jest.fn() }))

function call(id) {
  const request = new Request(`http://localhost/api/admin/applications/${id}/resume`)
  return GET(request, { params: Promise.resolve({ id }) })
}

function fakeStream() {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('%PDF-1.4 fake bytes'))
      controller.close()
    },
  })
}

describe('GET /api/admin/applications/[id]/resume', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await call('1')

    expect(response.status).toBe(401)
    expect(prisma.jobApplication.findUnique).not.toHaveBeenCalled()
  })

  it('rejects a non-numeric id', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await call('not-a-number')
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Invalid id')
    expect(prisma.jobApplication.findUnique).not.toHaveBeenCalled()
  })

  it('returns 404 when the application does not exist', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.jobApplication.findUnique.mockResolvedValue(null)

    const response = await call('999')
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBe('Not found')
    expect(get).not.toHaveBeenCalled()
  })

  it('returns 404 when the blob has been deleted from storage', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.jobApplication.findUnique.mockResolvedValue({ resumeUrl: 'blob://gone', name: 'Ada Lovelace' })
    get.mockResolvedValue(null)

    const response = await call('1')
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.error).toBe('Not found')
  })

  it('streams the resume with its stored content type and disposition', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.jobApplication.findUnique.mockResolvedValue({ resumeUrl: 'blob://ok', name: 'Ada Lovelace' })
    get.mockResolvedValue({
      stream: fakeStream(),
      blob: { contentType: 'application/pdf', contentDisposition: 'attachment; filename="cv.pdf"' },
    })

    const response = await call('1')

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="cv.pdf"')
    expect(get).toHaveBeenCalledWith('blob://ok', expect.objectContaining({ access: 'private' }))
  })

  it('falls back to an inline filename built from the applicant name when the blob has none', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.jobApplication.findUnique.mockResolvedValue({ resumeUrl: 'blob://ok', name: 'Ada Lovelace' })
    get.mockResolvedValue({
      stream: fakeStream(),
      blob: { contentType: 'application/pdf', contentDisposition: null },
    })

    const response = await call('1')

    expect(response.headers.get('Content-Disposition')).toBe('inline; filename="Ada Lovelace-resume"')
  })
})
