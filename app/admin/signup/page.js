import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import SignupForm from './SignupForm'

export default async function SignupPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'SUPER_ADMIN') redirect('/admin')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <Image src="/logo.png" alt="XR Interactive" width={64} height={64} style={{ objectFit: 'contain' }} priority />
      <SignupForm />
    </div>
  )
}
