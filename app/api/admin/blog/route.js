import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PostSchema } from '@/lib/validation'

function parseForm(formData) {
  const validated = PostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    body: formData.get('body'),
    category: formData.get('category'),
    image: formData.get('image'),
    published: formData.get('published'),
  })
  if (!validated.success) return { success: false, errors: validated.error.flatten().fieldErrors }

  const { body, ...rest } = validated.data
  return { success: true, data: { ...rest, body: body || null } }
}

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const parsed = parseForm(formData)
  if (!parsed.success) return NextResponse.json({ errors: parsed.errors }, { status: 400 })

  try {
    await prisma.post.create({ data: parsed.data })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return NextResponse.json({ success: true })
}
