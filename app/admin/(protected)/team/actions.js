'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { TeamMemberSchema } from '@/lib/validation'

function parseForm(formData) {
  const validated = TeamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    image: formData.get('image'),
    twitter: formData.get('twitter'),
    linkedin: formData.get('linkedin'),
    order: formData.get('order'),
  })
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors }

  const { twitter, linkedin, ...rest } = validated.data
  const socialLinks = (twitter || linkedin) ? { twitter: twitter || undefined, linkedin: linkedin || undefined } : null

  return { success: true, data: { ...rest, socialLinks } }
}

export async function createTeamMember(prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.teamMember.create({ data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/about')
  revalidatePath('/admin/team')
  redirect('/admin/team')
}

export async function updateTeamMember(id, prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.teamMember.update({ where: { id }, data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/about')
  revalidatePath('/admin/team')
  redirect('/admin/team')
}

export async function deleteTeamMember(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.teamMember.delete({ where: { id } })
  revalidatePath('/about')
  revalidatePath('/admin/team')
}
