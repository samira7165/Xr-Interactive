'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deleteJob(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const existing = await prisma.job.findUnique({ where: { id }, select: { slug: true } })
  await prisma.job.delete({ where: { id } })
  revalidatePath('/careers')
  revalidatePath('/admin/careers')
  if (existing) {
    revalidatePath(`/careers/${existing.slug}`)
    revalidatePath(`/careers/${existing.slug}/apply`)
  }
}
