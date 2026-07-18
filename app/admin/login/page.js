import Image from 'next/image'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <Image src="/logo.png" alt="XR Interactive" width={64} height={64} style={{ objectFit: 'contain' }} priority />
      <LoginForm />
    </div>
  )
}
