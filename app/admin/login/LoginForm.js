'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from './actions'

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <form action={formAction} className="admin-card" style={{ width: '320px' }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>Admin Login</h1>
      <div className="admin-field">
        <label className="admin-label">Email</label>
        <input className="admin-input" type="email" name="email" required />
      </div>
      <div className="admin-field">
        <label className="admin-label">Password</label>
        <input className="admin-input" type="password" name="password" required />
      </div>
      {state?.error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{state.error}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Need an account? <Link href="/admin/signup" style={{ color: 'var(--purple-light)' }}>Sign up</Link>
      </p>
      <style>{`
        .admin-btn { padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 500; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); cursor: pointer; }
        .admin-btn-primary { background: var(--purple); border-color: var(--purple); }
        .admin-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
        .admin-input { width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-secondary); color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; }
        .admin-label { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem; }
        .admin-field { margin-bottom: 1.1rem; }
        .admin-error { color: #f87171; font-size: 0.8rem; }
      `}</style>
    </form>
  )
}
