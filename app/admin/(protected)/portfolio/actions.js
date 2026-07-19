'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ProjectSchema } from '@/lib/validation'

function parseForm(formData) {
  const validated = ProjectSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    category: formData.get('category'),
    thumbnail: formData.get('thumbnail'),
    techStack: formData.get('techStack'),
    featured: formData.get('featured'),
  })
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors }

  const { techStack, ...rest } = validated.data
  const techStackArray = techStack ? techStack.split(',').map(s => s.trim()).filter(Boolean) : []

  return { success: true, data: { ...rest, techStack: techStackArray } }
}

export async function createItem(prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.project.create({ data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/admin/portfolio')
  redirect('/admin/portfolio')
}

export async function updateItem(id, prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.project.update({ where: { id }, data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/admin/portfolio')
  redirect('/admin/portfolio')
}

export async function deleteItem(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.project.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/admin/portfolio')
}
