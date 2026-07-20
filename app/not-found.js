import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="section-label">404</div>
        <h1>Page Not <span className="gradient-text">Found</span></h1>
        <p>The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.</p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
