'use server'

import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SignupSchema } from '@/lib/validation'

export async function signup(prevState, formData) {
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
  await prisma.adminUser.create({ data: { email, passwordHash, name: name || null } })

  try {
    await signIn('credentials', { email, password, redirectTo: '/admin' })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created, but sign-in failed. Try logging in.' }
    }
    throw error
  }
}
