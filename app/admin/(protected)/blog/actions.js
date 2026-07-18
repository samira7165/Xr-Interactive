'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PostSchema } from '@/lib/validation'

function parseForm(formData) {
  return PostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    body: formData.get('body'),
    category: formData.get('category'),
    image: formData.get('image'),
    published: formData.get('published'),
  })
}

export async function createPost(prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const validated = parseForm(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { body, ...rest } = validated.data

  try {
    await prisma.post.create({ data: { ...rest, body: body || null } })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function updatePost(id, prevState, formData) {
  const session = await auth()
  if (!session) return { errors: {}, message: 'Unauthorized' }

  const validated = parseForm(formData)
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { body, ...rest } = validated.data

  try {
    await prisma.post.update({ where: { id }, data: { ...rest, body: body || null } })
  } catch (error) {
    return { errors: {}, message: error.message }
  }

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function deletePost(id) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  await prisma.post.delete({ where: { id } })
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
}
