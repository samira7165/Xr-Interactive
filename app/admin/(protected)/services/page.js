import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ServiceIcon from '@/components/ServiceIcon'
import { deleteService } from './actions'
import DeleteServiceButton from './DeleteServiceButton'

export default async function AdminServicesList() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Services</h1>
        <Link href="/admin/services/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>New Service</Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Tag</th>
              <th>Images</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td><ServiceIcon name={service.icon} size={20} color="#C084FC" /></td>
                <td>{service.title}</td>
                <td>{service.tag || '—'}</td>
                <td>{Array.isArray(service.images) ? service.images.length : 0}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/services/${service.id}/edit`} className="admin-btn" style={{ textDecoration: 'none' }}>Edit</Link>
                  <DeleteServiceButton onDelete={deleteService.bind(null, service.id)} />
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>No services yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
