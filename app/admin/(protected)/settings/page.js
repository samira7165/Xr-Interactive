import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const session = await auth()
  const currentUser = await prisma.adminUser.findUnique({ where: { id: Number(session.user.id) } })
  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Settings</h1>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>My Profile</h2>
      <div className="admin-card" style={{ maxWidth: '480px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {currentUser?.image ? (
          <img src={currentUser.image} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#fff',
          }}>
            {(currentUser?.name || currentUser?.email || '?')[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{currentUser?.name || 'No name set'}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{currentUser?.email}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            Admin since {new Date(currentUser?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <SettingsForm initialName={currentUser?.name} initialImage={currentUser?.image} />

      <div style={{ marginTop: '2.5rem' }}>
        <div className="admin-page-header">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Admin Accounts</h3>
          <Link href="/admin/signup" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>+ Add Admin</Link>
        </div>
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.name || '—'}</td>
                  <td>{admin.email}</td>
                  <td>{new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
