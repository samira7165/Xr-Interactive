import ServiceForm from '../ServiceForm'
import { createService } from '../actions'

export default function NewServicePage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>New Service</h1>
      <ServiceForm action={createService} />
    </div>
  )
}
