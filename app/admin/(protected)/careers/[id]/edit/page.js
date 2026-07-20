import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import JobForm from '../../JobForm'

export default async function EditJobPage({ params }) {
  const { id } = await params
  const job = await prisma.job.findUnique({ where: { id: Number(id) } })

  if (!job) notFound()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Job</h1>
      <JobForm jobId={job.id} initialData={job} />
    </div>
  )
}
