import EmployeeForm from '../EmployeeForm'
import { createEmployee } from '../actions'

export default function NewEmployeePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Add Employee</h1>
      <EmployeeForm action={createEmployee} />
    </div>
  )
}
