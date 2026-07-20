import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactSchema } from '@/lib/validation'
import { sendLeadNotification } from '@/lib/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request) {
  const ip = getClientIp(request.headers)
  const { allowed, retryAfter } = rateLimit(`contacts:${ip}`, { limit: 5, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const body = await request.json()
  const validated = ContactSchema.safeParse(body)

  if (!validated.success) {
    return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 })
  }

  const contact = await prisma.contact.create({ data: validated.data })
  await sendLeadNotification(validated.data)

  return NextResponse.json({ id: contact.id }, { status: 201 })
}
