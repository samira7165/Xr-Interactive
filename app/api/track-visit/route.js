import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const path = typeof body.path === 'string' ? body.path.slice(0, 255) : '/'

  await prisma.pageView.create({ data: { path } })

  return NextResponse.json({ ok: true })
}
