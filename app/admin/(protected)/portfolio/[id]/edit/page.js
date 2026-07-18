import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioItemForm from '../../PortfolioItemForm'
import { updateItem } from '../../actions'

export default async function EditPortfolioItemPage({ params }) {
  const { id } = await params
  const item = await prisma.project.findUnique({ where: { id: Number(id) } })

  if (!item) notFound()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Project</h1>
      <PortfolioItemForm action={updateItem.bind(null, item.id)} initialData={item} />
    </div>
  )
}
