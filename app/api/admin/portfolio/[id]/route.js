import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

export async function POST(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const formData = await request.formData()
  const parsed = parseForm(formData)
  if (!parsed.success) return NextResponse.json({ errors: parsed.errors }, { status: 400 })

  try {
    await prisma.project.update({ where: { id: Number(id) }, data: parsed.data })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  revalidatePath('/')
  revalidatePath('/portfolio')
  revalidatePath('/admin/portfolio')
  return NextResponse.json({ success: true })
}
