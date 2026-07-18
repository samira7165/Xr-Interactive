import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServiceForm from '../../ServiceForm'
import { updateService } from '../../actions'

export default async function EditServicePage({ params }) {
  const { id } = await params
  const service = await prisma.service.findUnique({ where: { id: Number(id) } })

  if (!service) notFound()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Service</h1>
      <ServiceForm action={updateService.bind(null, service.id)} initialData={service} />
    </div>
  )
}
