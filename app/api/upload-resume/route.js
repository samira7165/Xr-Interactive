import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// Deliberately public/unauthenticated — job applicants aren't logged in. Unlike
// /api/upload (admin-only, images), this accepts resume documents from anyone.
// No rate limiting: acceptable for now, but worth adding if abuse shows up.

const ALLOWED_EXTENSIONS = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = ALLOWED_EXTENSIONS[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOC, or DOCX.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB).' }, { status: 400 })
  }

  // Extension derived from the validated MIME type, not the user-supplied
  // filename — the original name is only kept for display (see below).
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`

  const blob = await put(`uploads/resumes/${filename}`, file, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url, name: file.name })
}
