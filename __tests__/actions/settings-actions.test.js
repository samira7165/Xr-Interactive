/**
 * @jest-environment node
 */
import { updateProfile, removeAdmin } from '@/app/admin/(protected)/settings/actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { adminSession, buildFormData } from '../helpers/actions'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: {
    adminUser: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  },
}))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('updateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const result = await updateProfile(undefined, buildFormData({ name: 'Ada' }))

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(prisma.adminUser.update).not.toHaveBeenCalled()
  })

  it('accepts a fully blank form — every SettingsSchema field is optional', async () => {
    // Documents that "Invalid input" can't come from a normal blank form;
    // the two password-specific checks below are what actually guard this
    // action, not SettingsSchema itself.
    auth.mockResolvedValue(adminSession('ADMIN', { id: '3' }))
    prisma.adminUser.update.mockResolvedValue({ id: 3 })

    const result = await updateProfile(
      undefined,
      buildFormData({ name: '', image: '', currentPassword: '', newPassword: '' })
    )

    expect(result).toEqual({ success: true })
  })

  it('updates name and image without touching the password when newPassword is blank', async () => {
    auth.mockResolvedValue(adminSession('ADMIN', { id: '3' }))
    prisma.adminUser.update.mockResolvedValue({ id: 3 })

    const result = await updateProfile(
      undefined,
      buildFormData({ name: 'Ada Lovelace', image: 'https://example.com/me.png', currentPassword: '', newPassword: '' })
    )

    expect(result).toEqual({ success: true })
    expect(prisma.adminUser.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { name: 'Ada Lovelace', image: 'https://example.com/me.png' },
    })
    expect(prisma.adminUser.findUnique).not.toHaveBeenCalled()
  })

  it('rejects a new password shorter than 8 characters', async () => {
    auth.mockResolvedValue(adminSession('ADMIN', { id: '3' }))

    const result = await updateProfile(
      undefined,
      buildFormData({ name: '', image: '', currentPassword: 'oldpass1', newPassword: 'short' })
    )

    expect(result).toEqual({ error: 'New password must be at least 8 characters' })
    expect(prisma.adminUser.update).not.toHaveBeenCalled()
  })

  it('rejects a new password when the current password was not provided', async () => {
    auth.mockResolvedValue(adminSession('ADMIN', { id: '3' }))

    const result = await updateProfile(
      undefined,
      buildFormData({ name: '', image: '', currentPassword: '', newPassword: 'longenoughpassword' })
    )

    expect(result).toEqual({ error: 'Enter your current password to set a new one' })
    expect(prisma.adminUser.update).not.toHaveBeenCalled()
  })

  it('rejects a wrong current password', async () => {
    auth.mockResolvedValue(adminSession('ADMIN', { id: '3' }))
    prisma.adminUser.findUnique.mockResolvedValue({ id: 3, passwordHash: await bcrypt.hash('correct-password', 10) })

    const result = await updateProfile(
      undefined,
      buildFormData({ name: '', image: '', currentPassword: 'wrong-password', newPassword: 'longenoughpassword' })
    )

    expect(result).toEqual({ error: 'Current password is incorrect' })
    expect(prisma.adminUser.update).not.toHaveBeenCalled()
  })

  it('hashes and saves a new password when the current password is correct', async () => {
    auth.mockResolvedValue(adminSession('ADMIN', { id: '3' }))
    prisma.adminUser.findUnique.mockResolvedValue({ id: 3, passwordHash: await bcrypt.hash('correct-password', 10) })
    prisma.adminUser.update.mockResolvedValue({ id: 3 })

    const result = await updateProfile(
      undefined,
      buildFormData({ name: '', image: '', currentPassword: 'correct-password', newPassword: 'a-new-long-password' })
    )

    expect(result).toEqual({ success: true })
    const { data } = prisma.adminUser.update.mock.calls[0][0]
    expect(data.passwordHash).toBeDefined()
    expect(await bcrypt.compare('a-new-long-password', data.passwordHash)).toBe(true)
  })
})

describe('removeAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects a request with no session', async () => {
    auth.mockResolvedValue(null)

    const result = await removeAdmin(2)

    expect(result).toEqual({ error: 'Unauthorized' })
  })

  it('rejects a plain ADMIN session', async () => {
    auth.mockResolvedValue(adminSession('ADMIN'))

    const result = await removeAdmin(2)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(prisma.adminUser.delete).not.toHaveBeenCalled()
  })

  it('refuses to let a super admin remove their own account', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN', { id: '3' }))

    const result = await removeAdmin(3)

    expect(result).toEqual({ error: 'You can’t remove your own account.' })
    expect(prisma.adminUser.delete).not.toHaveBeenCalled()
  })

  it('returns an error when the target admin no longer exists', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN', { id: '1' }))
    prisma.adminUser.findUnique.mockResolvedValue(null)

    const result = await removeAdmin(999)

    expect(result).toEqual({ error: 'That admin no longer exists.' })
  })

  it('refuses to remove the last SUPER_ADMIN', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN', { id: '1' }))
    prisma.adminUser.findUnique.mockResolvedValue({ id: 2, role: 'SUPER_ADMIN' })
    prisma.adminUser.count.mockResolvedValue(1)

    const result = await removeAdmin(2)

    expect(result).toEqual({ error: 'Can’t remove the last super admin.' })
    expect(prisma.adminUser.delete).not.toHaveBeenCalled()
  })

  it('removes a SUPER_ADMIN when another one still exists', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN', { id: '1' }))
    prisma.adminUser.findUnique.mockResolvedValue({ id: 2, role: 'SUPER_ADMIN' })
    prisma.adminUser.count.mockResolvedValue(2)
    prisma.adminUser.delete.mockResolvedValue({ id: 2 })

    const result = await removeAdmin(2)

    expect(result).toEqual({ success: true })
    expect(prisma.adminUser.delete).toHaveBeenCalledWith({ where: { id: 2 } })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/settings')
  })

  it('removes a plain ADMIN target without checking the super-admin count', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN', { id: '1' }))
    prisma.adminUser.findUnique.mockResolvedValue({ id: 2, role: 'ADMIN' })
    prisma.adminUser.delete.mockResolvedValue({ id: 2 })

    const result = await removeAdmin(2)

    expect(result).toEqual({ success: true })
    expect(prisma.adminUser.count).not.toHaveBeenCalled()
  })
})
