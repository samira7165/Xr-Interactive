'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deleteTeamMember(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.teamMember.delete({ where: { id } })
  revalidatePath('/about')
  revalidatePath('/admin/team')
}
