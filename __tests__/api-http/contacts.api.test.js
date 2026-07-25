// Real end-to-end HTTP test: no route handler is imported and nothing is
// mocked. This sends actual requests to the Next.js server started in
// globalSetup, which is backed by the real, isolated `testdb` database.
import { apiFetch } from './helpers/client'
import { resetTestData, testDb, taggedEmail, disconnectTestDb } from './helpers/db'

let ipCounter = 0
function uniqueIp() {
  return `10.9.0.${++ipCounter}`
}

function submitContact(body, ip = uniqueIp()) {
  return apiFetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip },
    body: JSON.stringify(body),
  })
}

const validContact = {
  name: 'Ada Lovelace',
  email: taggedEmail('contact'),
  phone: '',
  message: 'We would like to talk about a VR project for an upcoming launch.',
}

describe('POST /api/contacts (real HTTP)', () => {
  beforeEach(async () => {
    await resetTestData()
  })

  afterAll(async () => {
    await resetTestData()
    await disconnectTestDb()
  })

  it('accepts a valid submission and actually persists it to the database', async () => {
    // Verifies the whole real path: HTTP -> route -> Zod validation -> real
    // Prisma write against real MySQL — not just that the route "would"
    // call prisma.create, but that a row genuinely exists afterward.
    const email = taggedEmail('created')
    const response = await submitContact({ ...validContact, email })
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.id).toEqual(expect.any(Number))

    const row = await testDb.contact.findUnique({ where: { id: json.id } })
    expect(row).toMatchObject({ name: validContact.name, email })
  })

  it('rejects an invalid payload with 400 and does not create a row', async () => {
    const email = taggedEmail('invalid')
    const response = await submitContact({ name: '', email: 'not-an-email', phone: '', message: 'short' })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('name')
    expect(json.errors).toHaveProperty('email')
    expect(json.errors).toHaveProperty('message')
    await expect(testDb.contact.findFirst({ where: { email } })).resolves.toBeNull()
  })

  it('rejects a missing message field entirely (not just an empty string)', async () => {
    const { message, ...withoutMessage } = validContact
    const response = await submitContact({ ...withoutMessage, email: taggedEmail('nomessage') })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('message')
  })

  it('rejects non-string fields the client might send by mistake', async () => {
    const response = await submitContact({ name: 12345, email: taggedEmail('badtype'), phone: '', message: true })

    expect(response.status).toBe(400)
  })

  it('rate-limits the 6th submission from the same client within a minute', async () => {
    const ip = uniqueIp()
    for (let i = 0; i < 5; i++) {
      const response = await submitContact({ ...validContact, email: taggedEmail(`rl-${i}`) }, ip)
      expect(response.status).toBe(201)
    }

    const blocked = await submitContact({ ...validContact, email: taggedEmail('rl-blocked') }, ip)
    const json = await blocked.json()

    expect(blocked.status).toBe(429)
    expect(json.error).toMatch(/too many requests/i)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
  })
})
