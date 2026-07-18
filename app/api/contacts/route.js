import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactSchema } from '@/lib/validation'
import { sendLeadNotification } from '@/lib/email'

export async function POST(request) {
  const body = await request.json()
  const validated = ContactSchema.safeParse(body)

  if (!validated.success) {
    return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 })
  }

  const contact = await prisma.contact.create({ data: validated.data })
  await sendLeadNotification(validated.data)

  return NextResponse.json({ id: contact.id }, { status: 201 })
}
