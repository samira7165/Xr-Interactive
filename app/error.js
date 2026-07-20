'use client'

import Link from 'next/link'

export default function ErrorPage({ reset }) {
  return (
    <main>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="section-label">Error</div>
        <h1>Something Went <span className="gradient-text">Wrong</span></h1>
        <p>An unexpected error occurred. Please try again, or head back to the homepage.</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
