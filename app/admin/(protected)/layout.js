import { Eye } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from './Sidebar'
import AdminSearch from './AdminSearch'
import AdminNotifications from './AdminNotifications'

// Every page under here depends on the current user's session — it must never
// be cached/prerendered, or one user's (or an anonymous build-time) response
// can get served to everyone else.
export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({ children }) {
  const session = await auth()
  if (!session || !session.user?.id) redirect('/admin/login')

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const [currentUser, visitCount, newContacts, newApplications] = await Promise.all([
    prisma.adminUser.findUnique({ where: { id: Number(session.user.id) }, select: { name: true, image: true, role: true } }),
    prisma.pageView.count(),
    prisma.contact.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.jobApplication.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ])

  const userLabel = currentUser?.name || session.user?.email
  const userImage = currentUser?.image

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }} className="admin-shell">
      <Sidebar userLabel={userLabel} userImage={userImage} role={currentUser?.role} badges={{ contacts: newContacts }} />
      <div style={{ flex: 1, minWidth: 0 }} className="admin-content">
        <header className="admin-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
          padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
        }}>
          <div className="admin-header-visits" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexShrink: 0 }}>
            <Eye size={16} strokeWidth={2} />
            <span>{visitCount.toLocaleString()} site visits</span>
          </div>

          <AdminSearch />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <AdminNotifications newContacts={newContacts} newApplications={newApplications} />

            <Link href="/admin/settings" aria-label="Profile" style={{ display: 'flex', flexShrink: 0 }}>
              {userImage ? (
                <img src={userImage} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                }}>
                  {userLabel?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </Link>

            <form action={async () => { 'use server'; await signOut({ redirectTo: '/admin/login' }) }}>
              <button type="submit" className="admin-btn admin-btn-ghost">Log out</button>
            </form>
          </div>
        </header>
        <main className="admin-main" style={{ padding: '2rem', maxWidth: '1200px' }}>
          {children}
        </main>
      </div>
      <style>{`
        .admin-btn {
          padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500;
          border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary);
          cursor: pointer; transition: background 0.15s, border-color 0.15s;
        }
        .admin-btn:hover { background: var(--bg-card-hover); }
        .admin-btn-primary { background: var(--purple); border-color: var(--purple); }
        .admin-btn-primary:hover { background: var(--purple-glow); }
        .admin-btn-danger { border-color: rgba(248,113,113,0.4); color: #f87171; }
        .admin-btn-danger:hover { background: rgba(248,113,113,0.08); }
        .admin-btn-ghost { background: transparent; }
        .admin-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem;
          transition: border-color 0.15s, background 0.15s;
        }
        a.admin-card:hover {
          border-color: var(--accent); background: var(--bg-card-hover);
        }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td {
          text-align: left; padding: 0.85rem 0.75rem; border-bottom: 1px solid var(--border); font-size: 0.9rem;
        }
        .admin-table tbody tr:hover { background: rgba(255,255,255,0.02); }
        .admin-table th { color: var(--text-muted); font-weight: 500; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; }
        .admin-input, .admin-select, .admin-textarea {
          width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid var(--border);
          background: var(--bg-secondary); color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem;
          transition: border-color 0.15s;
        }
        .admin-input:focus, .admin-select:focus, .admin-textarea:focus {
          outline: none; border-color: var(--accent);
        }
        .admin-label { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem; }
        .admin-field { margin-bottom: 1.1rem; }
        .admin-error { color: #f87171; font-size: 0.8rem; margin-top: 0.3rem; }
        .admin-grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }
        .admin-page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem; }

        @media (max-width: 900px) {
          .admin-shell { flex-wrap: wrap; }
          .admin-content { margin-top: 56px; width: 100%; }
          .admin-header { padding: 0.85rem 1.25rem; }
          .admin-main { padding: 1.25rem; }
          .admin-grid-stats { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.85rem; }
        }
        @media (max-width: 700px) {
          .admin-header-visits { display: none; }
        }
        @media (max-width: 480px) {
          .admin-header { flex-wrap: wrap; gap: 0.5rem; }
          .admin-main { padding: 1rem; }
          .admin-grid-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}
