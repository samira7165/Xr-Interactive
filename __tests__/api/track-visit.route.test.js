/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST } from '@/app/api/track-visit/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: { pageView: { create: jest.fn() } },
}))

// Each test uses its own IP so the rate-limit module's shared bucket Map
// never lets one test's request count bleed into another's.
let ipCounter = 0
function postRequest(body, { ip = `10.0.2.${++ipCounter}`, rawBody } = {}) {
  return new Request('http://localhost/api/track-visit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: rawBody !== undefined ? rawBody : JSON.stringify(body),
  })
}

describe('POST /api/track-visit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('records the given path', async () => {
    prisma.pageView.create.mockResolvedValue({ id: 1 })

    const response = await POST(postRequest({ path: '/about' }))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(prisma.pageView.create).toHaveBeenCalledWith({ data: { path: '/about' } })
  })

  it('falls back to "/" when path is missing or not a string', async () => {
    prisma.pageView.create.mockResolvedValue({ id: 1 })

    await POST(postRequest({}))

    expect(prisma.pageView.create).toHaveBeenCalledWith({ data: { path: '/' } })
  })

  it('truncates an overly long path to 255 characters', async () => {
    prisma.pageView.create.mockResolvedValue({ id: 1 })
    const longPath = '/' + 'a'.repeat(300)

    await POST(postRequest({ path: longPath }))

    expect(prisma.pageView.create).toHaveBeenCalledWith({ data: { path: longPath.slice(0, 255) } })
  })

  it('does not crash on an unparseable body', async () => {
    prisma.pageView.create.mockResolvedValue({ id: 1 })

    const response = await POST(postRequest(undefined, { rawBody: 'not json' }))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(prisma.pageView.create).toHaveBeenCalledWith({ data: { path: '/' } })
  })

  it('silently returns ok:false once the IP is rate-limited', async () => {
    const ip = '10.0.2.99'
    prisma.pageView.create.mockResolvedValue({ id: 1 })

    for (let i = 0; i < 60; i++) {
      const response = await POST(postRequest({ path: '/x' }, { ip }))
      expect(response.status).toBe(200)
    }

    const blocked = await POST(postRequest({ path: '/x' }, { ip }))
    const json = await blocked.json()

    expect(blocked.status).toBe(429)
    expect(json).toEqual({ ok: false })
    expect(prisma.pageView.create).toHaveBeenCalledTimes(60)
  })
})
