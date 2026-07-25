/**
 * @jest-environment node
 */
// These six delete actions all share the exact same shape: check session,
// delete the row, revalidate some paths. Table-driven so the shared pattern
// (and any future divergence from it) is easy to see at a glance.
import { deletePost } from '@/app/admin/(protected)/blog/actions'
import { deleteItem } from '@/app/admin/(protected)/portfolio/actions'
import { deleteJob } from '@/app/admin/(protected)/careers/actions'
import { deleteService } from '@/app/admin/(protected)/services/actions'
import { deleteContact } from '@/app/admin/(protected)/contacts/actions'
import { deleteApplication } from '@/app/admin/(protected)/applications/actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { adminSession } from '../helpers/actions'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: { delete: jest.fn() },
    project: { delete: jest.fn() },
    job: { delete: jest.fn(), findUnique: jest.fn() },
    service: { delete: jest.fn() },
    contact: { delete: jest.fn() },
    jobApplication: { delete: jest.fn() },
  },
}))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const cases = [
  {
    name: 'deletePost',
    action: deletePost,
    model: prisma.post,
    paths: ['/blog', '/admin/blog'],
  },
  {
    name: 'deleteItem (portfolio)',
    action: deleteItem,
    model: prisma.project,
    paths: ['/', '/portfolio', '/admin/portfolio'],
  },
  {
    name: 'deleteService',
    action: deleteService,
    model: prisma.service,
    paths: ['/services', '/', '/admin/services'],
  },
  {
    name: 'deleteContact',
    action: deleteContact,
    model: prisma.contact,
    paths: ['/admin/contacts'],
  },
  {
    name: 'deleteApplication',
    action: deleteApplication,
    model: prisma.jobApplication,
    paths: ['/admin/applications'],
  },
]

describe.each(cases)('$name', ({ action, model, paths }) => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request without deleting anything', async () => {
    auth.mockResolvedValue(null)

    const result = await action(1)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(model.delete).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('deletes the row by id and revalidates the expected paths', async () => {
    auth.mockResolvedValue(adminSession())
    model.delete.mockResolvedValue({ id: 7 })

    await action(7)

    expect(model.delete).toHaveBeenCalledWith({ where: { id: 7 } })
    for (const path of paths) {
      expect(revalidatePath).toHaveBeenCalledWith(path)
    }
  })
})

describe('deleteJob (careers)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const result = await deleteJob(1)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(prisma.job.delete).not.toHaveBeenCalled()
  })

  it('deletes the job and revalidates its own slug pages in addition to the list pages', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.job.findUnique.mockResolvedValue({ slug: 'xr-engineer' })
    prisma.job.delete.mockResolvedValue({ id: 3 })

    await deleteJob(3)

    expect(prisma.job.delete).toHaveBeenCalledWith({ where: { id: 3 } })
    expect(revalidatePath).toHaveBeenCalledWith('/careers')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/careers')
    expect(revalidatePath).toHaveBeenCalledWith('/careers/xr-engineer')
    expect(revalidatePath).toHaveBeenCalledWith('/careers/xr-engineer/apply')
  })

  it('still deletes and revalidates the list pages even if the job was already gone', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.job.findUnique.mockResolvedValue(null)
    prisma.job.delete.mockResolvedValue({ id: 3 })

    await deleteJob(3)

    expect(revalidatePath).toHaveBeenCalledWith('/careers')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/careers')
    expect(revalidatePath).not.toHaveBeenCalledWith(expect.stringContaining('/careers/undefined'))
  })
})
