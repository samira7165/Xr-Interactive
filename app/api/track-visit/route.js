import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request) {
  const ip = getClientIp(request.headers)
  // Generous limit — this fires on every real page navigation, so a visitor
  // legitimately browsing several pages a minute must never be blocked.
  const { allowed } = rateLimit(`track-visit:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!allowed) {
    // Silent no-op, matching the client's fire-and-forget/catch-and-ignore call.
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  const body = await request.json().catch(() => ({}))
  const path = typeof body.path === 'string' ? body.path.slice(0, 255) : '/'

  await prisma.pageView.create({ data: { path } })

  return NextResponse.json({ ok: true })
}
