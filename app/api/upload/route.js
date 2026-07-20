import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/auth'

// SVG is deliberately excluded: it's XML and can carry executable <script>
// content, making user-uploaded SVGs a stored-XSS vector.
const ALLOWED_EXTENSIONS = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
}
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

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

  const ext = ALLOWED_EXTENSIONS[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported file type. Use PNG, JPEG, or WebP.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB).' }, { status: 400 })
  }

  // The extension is derived entirely from the validated MIME type above —
  // the original filename is never used, so it can't smuggle a path or a
  // misleading extension through.
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`

  const blob = await put(`uploads/${filename}`, file, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url })
}
