import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteJob } from './actions'
import DeleteJobButton from './DeleteJobButton'

export default async function AdminCareersList() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Careers</h1>
        <Link href="/admin/careers/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>+ Add Job</Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.type}</td>
                <td>{job.active ? 'Yes' : 'No'}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/careers/${job.id}/edit`} className="admin-btn" style={{ textDecoration: 'none' }}>Edit</Link>
                  <DeleteJobButton onDelete={deleteJob.bind(null, job.id)} />
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>No job postings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
