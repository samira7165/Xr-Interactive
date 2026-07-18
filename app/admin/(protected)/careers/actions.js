'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { JobSchema } from '@/lib/validation'

function splitLines(value) {
  return value ? value.split('\n').map(s => s.trim()).filter(Boolean) : []
}

function parseForm(formData) {
  const validated = JobSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    department: formData.get('department'),
    location: formData.get('location'),
    type: formData.get('type'),
    level: formData.get('level'),
    compensation: formData.get('compensation'),
    description: formData.get('description'),
    responsibilities: formData.get('responsibilities'),
    requirements: formData.get('requirements'),
    images: formData.get('images'),
    active: formData.get('active'),
  })
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors }

  const { department, level, compensation, responsibilities, requirements, images, ...rest } = validated.data
  return {
    success: true,
    data: {
      ...rest,
      department: department || null,
      level: level || null,
      compensation: compensation || null,
      responsibilities: splitLines(responsibilities),
      requirements: splitLines(requirements),
      images: images ? splitLines(images) : null,
    },
  }
}

export async function createJob(prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.job.create({ data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/careers')
  revalidatePath('/admin/careers')
  redirect('/admin/careers')
}

export async function updateJob(id, prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const parsed = parseForm(formData)
  if (!parsed.success) return { errors: parsed.errors }

  try {
    await prisma.job.update({ where: { id }, data: parsed.data })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/careers')
  revalidatePath('/admin/careers')
  redirect('/admin/careers')
}

export async function deleteJob(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.job.delete({ where: { id } })
  revalidatePath('/careers')
  revalidatePath('/admin/careers')
}
