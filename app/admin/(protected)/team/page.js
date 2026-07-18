import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteTeamMember } from './actions'
import DeleteTeamMemberButton from './DeleteTeamMemberButton'

export default async function AdminTeamList() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Team Members</h1>
        <Link href="/admin/team/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>+ Add Team Member</Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>
                  {member.image ? (
                    <img src={member.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    }}>
                      {member.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </td>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/team/${member.id}/edit`} className="admin-btn" style={{ textDecoration: 'none' }}>Edit</Link>
                  <DeleteTeamMemberButton onDelete={deleteTeamMember.bind(null, member.id)} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={4} style={{ color: 'var(--text-muted)' }}>No team members yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
