'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function approveComment(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const comment = await prisma.comment.update({
    where: { id },
    data: { approved: true },
    select: { post: { select: { slug: true } } },
  })
  revalidatePath('/admin/blog/comments')
  revalidatePath(`/blog/${comment.post.slug}`)
}

export async function deleteComment(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const comment = await prisma.comment.delete({
    where: { id },
    select: { post: { select: { slug: true } } },
  })
  revalidatePath('/admin/blog/comments')
  revalidatePath(`/blog/${comment.post.slug}`)
}
