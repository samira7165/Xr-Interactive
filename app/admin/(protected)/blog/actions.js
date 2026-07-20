'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deletePost(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.post.delete({ where: { id } })
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
}
