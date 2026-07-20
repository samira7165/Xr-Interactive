import { prisma } from '@/lib/prisma'
import { deleteApplication } from './actions'
import DeleteApplicationButton from './DeleteApplicationButton'

// Defense in depth: these fields are validated at submission time (see
// lib/validation.js), but this guards the render site too, so an `<a href>`
// pointing at a javascript:/data: URI can never reach the DOM regardless of
// how the value got into the database.
function isSafeHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default async function AdminApplicationsList() {
  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' },
    include: { job: { select: { title: true } } },
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Applications</h1>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job</th>
              <th>Country</th>
              <th>LinkedIn</th>
              <th>CV</th>
              <th>Applied</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{app.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{app.email}</div>
                </td>
                <td>{app.job?.title || '—'}</td>
                <td>{app.country}</td>
                <td>
                  {app.linkedin && isSafeHttpUrl(app.linkedin) ? (
                    <a href={app.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--purple-light)' }}>Profile</a>
                  ) : '—'}
                </td>
                <td>
                  {isSafeHttpUrl(app.resumeUrl) ? (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="admin-btn" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>View CV</a>
                  ) : '—'}
                </td>
                <td>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <DeleteApplicationButton onDelete={deleteApplication.bind(null, app.id)} />
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan={7} style={{ color: 'var(--text-muted)' }}>No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
