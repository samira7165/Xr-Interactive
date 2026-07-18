'use server'

import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SignupSchema } from '@/lib/validation'

export async function signup(prevState, formData) {
  // proxy.js already gates this route, but every mutating action re-checks
  // independently — route refactors can silently drop proxy coverage.
  const session = await auth()
  if (!session || session.user?.role !== 'SUPER_ADMIN') {
    return { error: 'Only a super admin can create new admin accounts.' }
  }

  const validated = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'Invalid input' }
  }

  const { name, email, password } = validated.data

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    return { error: 'An account with that email already exists.' }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.create({ data: { email, passwordHash, name: name || null, role: 'ADMIN' } })

  return { success: true }
}
