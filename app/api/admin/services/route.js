import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const parsed = parseForm(formData)
  if (!parsed.success) return NextResponse.json({ errors: parsed.errors }, { status: 400 })

  try {
    await prisma.service.create({ data: parsed.data })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  revalidatePath('/services')
  revalidatePath('/')
  revalidatePath('/admin/services')
  return NextResponse.json({ success: true })
}
