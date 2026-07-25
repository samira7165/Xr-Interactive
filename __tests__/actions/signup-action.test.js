/**
 * @jest-environment node
 */
import { signup } from '@/app/admin/signup/actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { adminSession, buildFormData } from '../helpers/actions'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { adminUser: { findUnique: jest.fn(), create: jest.fn() } },
}))

const validFields = { name: 'New Admin', email: 'new-admin@xri.test', password: 'a-strong-password' }

describe('signup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects a request with no session', async () => {
    auth.mockResolvedValue(null)

    const result = await signup(undefined, buildFormData(validFields))

    expect(result).toEqual({ error: 'Only a super admin can create new admin accounts.' })
    expect(prisma.adminUser.create).not.toHaveBeenCalled()
  })

  it('rejects a plain ADMIN session — creating admins is SUPER_ADMIN only', async () => {
    // proxy.js already gates /admin/signup to SUPER_ADMIN, but Server Action
    // calls bypass proxy.js (see proxy.js), so this is the real enforcement.
    auth.mockResolvedValue(adminSession('ADMIN'))

    const result = await signup(undefined, buildFormData(validFields))

    expect(result).toEqual({ error: 'Only a super admin can create new admin accounts.' })
    expect(prisma.adminUser.create).not.toHaveBeenCalled()
  })

  it('rejects an invalid payload', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))

    const result = await signup(undefined, buildFormData({ ...validFields, email: 'not-an-email' }))

    expect(result.error).toBeTruthy()
    expect(prisma.adminUser.create).not.toHaveBeenCalled()
  })

  it('rejects a password shorter than 8 characters', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))

    const result = await signup(undefined, buildFormData({ ...validFields, password: 'short' }))

    expect(result.error).toMatch(/8 characters/)
    expect(prisma.adminUser.create).not.toHaveBeenCalled()
  })

  it('rejects an email that already has an account', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.adminUser.findUnique.mockResolvedValue({ id: 1, email: validFields.email })

    const result = await signup(undefined, buildFormData(validFields))

    expect(result).toEqual({ error: 'An account with that email already exists.' })
    expect(prisma.adminUser.create).not.toHaveBeenCalled()
  })

  it('creates a new ADMIN (never SUPER_ADMIN) with a hashed password', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.adminUser.findUnique.mockResolvedValue(null)
    prisma.adminUser.create.mockResolvedValue({ id: 2 })

    const result = await signup(undefined, buildFormData(validFields))

    expect(result).toEqual({ success: true })
    const { data } = prisma.adminUser.create.mock.calls[0][0]
    expect(data).toMatchObject({ email: validFields.email, name: validFields.name, role: 'ADMIN' })
    expect(data.passwordHash).not.toBe(validFields.password)
    expect(await bcrypt.compare(validFields.password, data.passwordHash)).toBe(true)
  })
})
