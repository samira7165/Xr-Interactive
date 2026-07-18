export const metadata = { title: 'Admin — XR Interactive', robots: { index: false, follow: false } }

export default function AdminRootLayout({ children }) {
  return <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{children}</div>
}
