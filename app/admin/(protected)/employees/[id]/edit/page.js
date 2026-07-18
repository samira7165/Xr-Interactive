import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EmployeeForm from '../../EmployeeForm'
import { updateEmployee } from '../../actions'

export default async function EditEmployeePage({ params }) {
  const { id } = await params
  const employee = await prisma.teamMember.findUnique({ where: { id: Number(id) } })

  if (!employee) notFound()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Employee</h1>
      <EmployeeForm action={updateEmployee.bind(null, employee.id)} initialData={employee} />
    </div>
  )
}
