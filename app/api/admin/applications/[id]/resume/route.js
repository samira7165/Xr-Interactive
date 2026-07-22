import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Resumes are uploaded with access: 'private' (see /api/upload-resume), so
// they can no longer be reached directly by URL — only through this
// authenticated route, scoped to a known application id rather than trusting
// a client-supplied blob URL.
export async function GET(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const applicationId = Number(id)
  if (!Number.isInteger(applicationId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    select: { resumeUrl: true, name: true },
  })
  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const result = await get(application.resumeUrl, { access: 'private' })
  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      'Content-Disposition': result.blob.contentDisposition || `inline; filename="${application.name}-resume"`,
    },
  })
}
