import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteEmployee } from './actions'
import DeleteEmployeeButton from './DeleteEmployeeButton'

export default async function AdminEmployeesList() {
  const employees = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Employees</h1>
        <Link href="/admin/employees/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>+ Add Employee</Link>
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
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>
                  {employee.image ? (
                    <img src={employee.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    }}>
                      {employee.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </td>
                <td>{employee.name}</td>
                <td>{employee.role}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/employees/${employee.id}/edit`} className="admin-btn" style={{ textDecoration: 'none' }}>Edit</Link>
                  <DeleteEmployeeButton onDelete={deleteEmployee.bind(null, employee.id)} />
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td colSpan={4} style={{ color: 'var(--text-muted)' }}>No employees yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
