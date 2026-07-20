'use client'

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ background: '#0C0812', color: '#FFFFFF', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '1.5rem',
        }}>
          <h1 style={{ fontSize: '1.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#B0B0C5' }}>An unexpected error occurred. Please try again.</p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.75rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #71529C 0%, #C084FC 100%)', color: '#fff', fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
