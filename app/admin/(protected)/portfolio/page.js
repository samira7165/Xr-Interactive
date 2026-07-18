import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteItem } from './actions'
import DeleteItemButton from './DeleteItemButton'

export default async function AdminPortfolioList() {
  const items = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Projects</h1>
        <Link href="/admin/portfolio/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>New Project</Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/portfolio/${item.id}/edit`} className="admin-btn" style={{ textDecoration: 'none' }}>Edit</Link>
                  <DeleteItemButton onDelete={deleteItem.bind(null, item.id)} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ color: 'var(--text-muted)' }}>No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
