import JobForm from '../JobForm'
import { createJob } from '../actions'

export default function NewJobPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Add Job</h1>
      <JobForm action={createJob} />
    </div>
  )
}
