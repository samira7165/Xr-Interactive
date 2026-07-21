import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

  return { success: true, data: { ...rest, image: rest.image || null, socialLinks } }
}

export async function POST(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  // This path isn't under proxy.js's /admin matcher, so it must check the
  // SUPER_ADMIN-only rule itself rather than relying on the route guard.
  if (session.user?.role !== 'SUPER_ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const formData = await request.formData()
  const parsed = parseForm(formData)
  if (!parsed.success) return NextResponse.json({ errors: parsed.errors }, { status: 400 })

  try {
    await prisma.teamMember.update({ where: { id: Number(id) }, data: parsed.data })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  revalidatePath('/about')
  revalidatePath('/admin/team')
  return NextResponse.json({ success: true })
}
