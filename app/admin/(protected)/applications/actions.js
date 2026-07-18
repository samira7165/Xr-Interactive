'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deleteApplication(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.jobApplication.delete({ where: { id } })
  revalidatePath('/admin/applications')
}
