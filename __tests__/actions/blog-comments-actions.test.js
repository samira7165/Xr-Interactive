/**
 * @jest-environment node
 */
import { approveComment, deleteComment } from '@/app/admin/(protected)/blog/comments/actions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { adminSession } from '../helpers/actions'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { comment: { update: jest.fn(), delete: jest.fn() } },
}))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('approveComment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const result = await approveComment(1)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(prisma.comment.update).not.toHaveBeenCalled()
  })

  it('marks the comment approved and revalidates the admin list and the live post', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.comment.update.mockResolvedValue({ post: { slug: 'my-post' } })

    await approveComment(9)

    expect(prisma.comment.update).toHaveBeenCalledWith({
      where: { id: 9 },
      data: { approved: true },
      select: { post: { select: { slug: true } } },
    })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/blog/comments')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/my-post')
  })
})

describe('deleteComment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const result = await deleteComment(1)

    expect(result).toEqual({ error: 'Unauthorized' })
    expect(prisma.comment.delete).not.toHaveBeenCalled()
  })

  it('deletes the comment and revalidates the admin list and the live post', async () => {
    auth.mockResolvedValue(adminSession())
    prisma.comment.delete.mockResolvedValue({ post: { slug: 'my-post' } })

    await deleteComment(9)

    expect(prisma.comment.delete).toHaveBeenCalledWith({
      where: { id: 9 },
      select: { post: { select: { slug: true } } },
    })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/blog/comments')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/my-post')
  })
})
