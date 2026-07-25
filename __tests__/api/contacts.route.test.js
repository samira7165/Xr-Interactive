/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST } from '@/app/api/contacts/route'
import { prisma } from '@/lib/prisma'
import { sendLeadNotification } from '@/lib/email'

jest.mock('@/lib/prisma', () => ({
  prisma: { contact: { create: jest.fn() } },
}))
jest.mock('@/lib/email', () => ({
  sendLeadNotification: jest.fn(),
}))

// Each test uses its own IP so the rate-limit module's shared bucket Map
// never lets one test's request count bleed into another's.
let ipCounter = 0
function postRequest(body, { ip = `10.0.0.${++ipCounter}` } = {}) {
  return new Request('http://localhost/api/contacts', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

const validContact = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '',
  message: 'We would like to talk about a VR project.',
}

describe('POST /api/contacts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a contact and sends a notification for a valid submission', async () => {
    prisma.contact.create.mockResolvedValue({ id: 42, ...validContact })

    const response = await POST(postRequest(validContact))
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json).toEqual({ id: 42 })
    expect(prisma.contact.create).toHaveBeenCalledWith({ data: validContact })
    expect(sendLeadNotification).toHaveBeenCalledWith(validContact)
  })

  it('rejects an invalid submission without touching the database', async () => {
    const response = await POST(postRequest({ name: '', email: 'not-an-email', message: 'short' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('name')
    expect(json.errors).toHaveProperty('email')
    expect(json.errors).toHaveProperty('message')
    expect(prisma.contact.create).not.toHaveBeenCalled()
    expect(sendLeadNotification).not.toHaveBeenCalled()
  })

  it('rate-limits repeated submissions from the same IP', async () => {
    const ip = '10.0.0.99'
    prisma.contact.create.mockResolvedValue({ id: 1, ...validContact })

    for (let i = 0; i < 5; i++) {
      const response = await POST(postRequest(validContact, { ip }))
      expect(response.status).toBe(201)
    }

    const blocked = await POST(postRequest(validContact, { ip }))
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
    expect(prisma.contact.create).toHaveBeenCalledTimes(5)
  })
})
