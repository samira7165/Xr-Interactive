/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST as createMember } from '@/app/api/admin/team/route'
import { POST as updateMember } from '@/app/api/admin/team/[id]/route'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { adminSession, formDataRequest } from '../helpers/api'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { teamMember: { create: jest.fn(), update: jest.fn() } },
}))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const validFields = {
  name: 'Ada Lovelace',
  role: 'Lead Engineer',
  bio: 'Builds the impossible.',
  image: 'https://example.com/ada.png',
  twitter: '',
  linkedin: 'https://linkedin.com/in/ada',
  order: '1',
}

function createRequest(fields = validFields) {
  return formDataRequest('http://localhost/api/admin/team', fields)
}

function updateRequest(fields = validFields) {
  return formDataRequest('http://localhost/api/admin/team/1', fields)
}

describe('POST /api/admin/team (create)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await createMember(createRequest())

    expect(response.status).toBe(401)
    expect(prisma.teamMember.create).not.toHaveBeenCalled()
  })

  it('rejects a non-SUPER_ADMIN session with 403', async () => {
    auth.mockResolvedValue(adminSession('ADMIN'))

    const response = await createMember(createRequest())
    const json = await response.json()

    expect(response.status).toBe(403)
    expect(json.message).toBe('Forbidden')
    expect(prisma.teamMember.create).not.toHaveBeenCalled()
  })

  it('rejects an invalid payload without touching the database', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))

    const response = await createMember(createRequest({ ...validFields, name: '', role: '' }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.errors).toHaveProperty('name')
    expect(json.errors).toHaveProperty('role')
    expect(prisma.teamMember.create).not.toHaveBeenCalled()
  })

  it('creates the member as SUPER_ADMIN and collapses social links', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.create.mockResolvedValue({ id: 1 })

    const response = await createMember(createRequest())
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true })
    expect(prisma.teamMember.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: validFields.name,
        socialLinks: { twitter: undefined, linkedin: validFields.linkedin },
      }),
    })
    expect(revalidatePath).toHaveBeenCalledWith('/about')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/team')
  })

  it('stores a null socialLinks when neither twitter nor linkedin is given', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.create.mockResolvedValue({ id: 1 })

    await createMember(createRequest({ ...validFields, twitter: '', linkedin: '' }))

    expect(prisma.teamMember.create).toHaveBeenCalledWith({ data: expect.objectContaining({ socialLinks: null }) })
  })

  it('returns 500 when the database write fails', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.create.mockRejectedValue(new Error('Connection lost'))

    const response = await createMember(createRequest())
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.message).toBe('Connection lost')
  })
})

describe('POST /api/admin/team/[id] (update)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function call(fields, id = '1') {
    return updateMember(updateRequest(fields), { params: Promise.resolve({ id }) })
  }

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await call(validFields)

    expect(response.status).toBe(401)
    expect(prisma.teamMember.update).not.toHaveBeenCalled()
  })

  it('rejects a non-SUPER_ADMIN session with 403', async () => {
    auth.mockResolvedValue(adminSession('ADMIN'))

    const response = await call(validFields)

    expect(response.status).toBe(403)
    expect(prisma.teamMember.update).not.toHaveBeenCalled()
  })

  it('updates the member by numeric id as SUPER_ADMIN', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.update.mockResolvedValue({ id: 7 })

    const response = await call(validFields, '7')
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ success: true })
    expect(prisma.teamMember.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: expect.objectContaining({ name: validFields.name }),
    })
    expect(revalidatePath).toHaveBeenCalledWith('/about')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/team')
  })

  it('passes a non-numeric id through as NaN (route performs no id validation)', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.update.mockResolvedValue({ id: 1 })

    await call(validFields, 'not-a-number')

    expect(prisma.teamMember.update).toHaveBeenCalledWith({
      where: { id: NaN },
      data: expect.anything(),
    })
  })

  it('returns 500 when the database write fails', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.update.mockRejectedValue(new Error('Record to update not found.'))

    const response = await call(validFields, '999')
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.message).toMatch(/not found/i)
  })
})
