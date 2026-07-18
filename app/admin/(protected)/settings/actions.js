'use server'

import bcrypt from 'bcryptjs'
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
