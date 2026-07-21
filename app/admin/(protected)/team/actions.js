'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deleteTeamMember(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }
  // proxy.js already gates /admin/team to SUPER_ADMIN, but Server Action
  // requests bypass proxy.js entirely (see proxy.js), so this must re-check.
  if (session.user?.role !== 'SUPER_ADMIN') return { error: 'Forbidden' }

  await prisma.teamMember.delete({ where: { id } })
  revalidatePath('/about')
  revalidatePath('/admin/team')
}
