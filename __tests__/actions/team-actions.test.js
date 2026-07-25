/**
 * @jest-environment node
 */
import { deleteTeamMember } from '@/app/admin/(protected)/team/actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { adminSession } from '../helpers/actions'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { teamMember: { delete: jest.fn() } },
}))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('deleteTeamMember', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const result = await deleteTeamMember(1)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(prisma.teamMember.delete).not.toHaveBeenCalled()
  })

  it('rejects a plain ADMIN — team management is SUPER_ADMIN only', async () => {
    // proxy.js already blocks non-SUPER_ADMINs from /admin/team pages, but
    // Server Action calls bypass proxy.js (see proxy.js's isServerAction
    // exemption), so this re-check is the only thing actually enforcing it.
    auth.mockResolvedValue(adminSession('ADMIN'))

    const result = await deleteTeamMember(1)

    expect(result).toEqual({ error: 'Forbidden' })
    expect(prisma.teamMember.delete).not.toHaveBeenCalled()
  })

  it('deletes the member as SUPER_ADMIN and revalidates', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.teamMember.delete.mockResolvedValue({ id: 5 })

    await deleteTeamMember(5)

    expect(prisma.teamMember.delete).toHaveBeenCalledWith({ where: { id: 5 } })
    expect(revalidatePath).toHaveBeenCalledWith('/about')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/team')
  })
})
