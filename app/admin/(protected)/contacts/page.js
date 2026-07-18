import { prisma } from '@/lib/prisma'
import { deleteContact } from './actions'
import DeleteContactButton from './DeleteContactButton'

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Contact Submissions</h1>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone || '—'}</td>
                <td style={{ maxWidth: '280px' }}>{contact.message}</td>
                <td>{new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <DeleteContactButton onDelete={deleteContact.bind(null, contact.id)} />
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr><td colSpan={6} style={{ color: 'var(--text-muted)' }}>No contact submissions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
