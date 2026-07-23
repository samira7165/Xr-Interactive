import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CommentSchema } from '@/lib/validation'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request, { params }) {
  const ip = getClientIp(request.headers)
  const { allowed, retryAfter } = rateLimit(`blog-comments:${ip}`, { limit: 5, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug }, select: { id: true, published: true } })
  if (!post || !post.published) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const validated = CommentSchema.safeParse(body)
  if (!validated.success) {
    return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 })
  }

  // New comments are unapproved until reviewed in the admin — see
  // /admin/blog/comments — so they don't appear on the post yet.
  await prisma.comment.create({
    data: { ...validated.data, postId: post.id, approved: false },
  })

  return NextResponse.json({ status: 'pending' }, { status: 201 })
}
