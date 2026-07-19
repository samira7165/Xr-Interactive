import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import path from 'path'
import { auth } from '@/auth'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Use PNG, JPEG, WebP, GIF, or SVG.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10MB).' }, { status: 400 })
  }

  const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`

  const blob = await put(`uploads/${filename}`, file, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url })
}
