import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const parsed = parseForm(formData)
  if (!parsed.success) return NextResponse.json({ errors: parsed.errors }, { status: 400 })

  try {
    await prisma.job.create({ data: parsed.data })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  revalidatePath('/careers')
  revalidatePath('/admin/careers')
  return NextResponse.json({ success: true })
}
