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

export async function POST(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const formData = await request.formData()
  const parsed = parseForm(formData)
  if (!parsed.success) return NextResponse.json({ errors: parsed.errors }, { status: 400 })

  // The public job detail page has no revalidation trigger of its own once
  // cached, so both the old and (if the slug changed) new slug's pages need
  // to be explicitly invalidated here.
  const existing = await prisma.job.findUnique({ where: { id: Number(id) }, select: { slug: true } })

  try {
    await prisma.job.update({ where: { id: Number(id) }, data: parsed.data })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  revalidatePath('/careers')
  revalidatePath('/admin/careers')
  if (existing) {
    revalidatePath(`/careers/${existing.slug}`)
    revalidatePath(`/careers/${existing.slug}/apply`)
  }
  if (parsed.data.slug !== existing?.slug) {
    revalidatePath(`/careers/${parsed.data.slug}`)
    revalidatePath(`/careers/${parsed.data.slug}/apply`)
  }
  return NextResponse.json({ success: true })
}
