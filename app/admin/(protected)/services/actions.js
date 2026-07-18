'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ServiceSchema } from '@/lib/validation'

function splitLines(value) {
  return value ? value.split('\n').map(s => s.trim()).filter(Boolean) : []
}

function parseForm(formData) {
  const validated = ServiceSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    icon: formData.get('icon'),
    tag: formData.get('tag'),
    gradient: formData.get('gradient'),
    features: formData.get('features'),
    images: formData.get('images'),
    order: formData.get('order'),
  })
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors }

  const { features, images, tag, gradient, ...rest } = validated.data
  return {
    success: true,
    data: {
      ...rest,
      tag: tag || null,
      gradient: gradient || null,
      features: splitLines(features),
      images: images ? splitLines(images) : null,
    },
  }
}

export async function createService(prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.service.create({ data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/')
  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function updateService(id, prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.service.update({ where: { id }, data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/')
  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function deleteService(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.service.delete({ where: { id } })
  revalidatePath('/services')
  revalidatePath('/')
  revalidatePath('/admin/services')
}
