import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Deliberately public/unauthenticated — job applicants aren't logged in. Unlike
// /api/upload (admin-only, images), this accepts resume documents from anyone.
// No rate limiting: acceptable for a local-dev-only setup, but worth adding if
// this ever moves to a publicly reachable deployment.

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOC, or DOCX.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB).' }, { status: 400 })
  }

  const ext = path.extname(file.name) || '.pdf'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes')

  await mkdir(uploadsDir, { recursive: true })

  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), bytes)

  return NextResponse.json({ url: `/uploads/resumes/${filename}`, name: file.name })
}
