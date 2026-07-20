'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deleteItem(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/admin/portfolio')
}
