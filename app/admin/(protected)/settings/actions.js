'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SettingsSchema } from '@/lib/validation'

export async function updateProfile(prevState, formData) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const validated = SettingsSchema.safeParse({
    name: formData.get('name'),
    image: formData.get('image'),
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  })

  if (!validated.success) {
    return { error: 'Invalid input' }
  }

  const { name, image, currentPassword, newPassword } = validated.data
  const userId = Number(session.user.id)

  const data = { name: name || null, image: image || null }

  if (newPassword) {
    if (newPassword.length < 8) {
      return { error: 'New password must be at least 8 characters' }
    }
    if (!currentPassword) {
      return { error: 'Enter your current password to set a new one' }
    }

    const user = await prisma.adminUser.findUnique({ where: { id: userId } })
    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) {
      return { error: 'Current password is incorrect' }
    }

    data.passwordHash = await bcrypt.hash(newPassword, 10)
  }

  await prisma.adminUser.update({ where: { id: userId }, data })

  return { success: true }
}

export async function removeAdmin(id) {
  const session = await auth()
  if (!session || session.user?.role !== 'SUPER_ADMIN') return { error: 'Unauthorized' }

  const targetId = Number(id)
  if (targetId === Number(session.user.id)) {
    return { error: 'You can’t remove your own account.' }
  }

  const target = await prisma.adminUser.findUnique({ where: { id: targetId } })
  if (!target) return { error: 'That admin no longer exists.' }

  if (target.role === 'SUPER_ADMIN') {
    const superAdminCount = await prisma.adminUser.count({ where: { role: 'SUPER_ADMIN' } })
    // There's no way to create a SUPER_ADMIN outside of seeding or a direct
    // DB edit (see prisma/seed.js) — removing the last one would permanently
    // strip the ability to manage admin accounts or team members at all.
    if (superAdminCount <= 1) {
      return { error: 'Can’t remove the last super admin.' }
    }
  }

  await prisma.adminUser.delete({ where: { id: targetId } })
  revalidatePath('/admin/settings')
  return { success: true }
}
