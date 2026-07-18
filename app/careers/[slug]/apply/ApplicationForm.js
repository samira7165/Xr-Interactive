'use client'

import { useActionState } from 'react'
import ResumeUploader from '../../ResumeUploader'
import { submitApplication } from './actions'

const initialState = { errors: {}, success: false }

export default function ApplicationForm({ jobId }) {
  const action = submitApplication.bind(null, jobId)
  const [state, formAction, pending] = useActionState(action, initialState)

  if (state.success) {
    return (
      <div style={{
        padding: '3rem 2rem', textAlign: 'center',
        background: 'rgba(22,22,42,0.95)', borderRadius: '16px',
        border: '1px solid var(--border)', backdropFilter: 'blur(10px)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '0.5rem' }}>
          Application Sent!
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>Thanks for applying — {"we'll"} be in touch if {"it's"} a fit.</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="contact-form" style={{
      padding: '2rem',
      background: 'rgba(22,22,42,0.95)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" name="name" placeholder="John Doe" />
        {state.errors?.name && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{state.errors.name[0]}</p>}
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" placeholder="john@example.com" />
        {state.errors?.email && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{state.errors.email[0]}</p>}
      </div>
      <div className="form-group">
        <label>Country</label>
        <input type="text" name="country" placeholder="Bangladesh" />
        {state.errors?.country && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{state.errors.country[0]}</p>}
      </div>
      <div className="form-group">
        <label>LinkedIn Profile (optional)</label>
        <input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." />
      </div>
      <div className="form-group">
        <label>CV / Resume</label>
        <ResumeUploader name="resumeUrl" />
        {state.errors?.resumeUrl && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{state.errors.resumeUrl[0]}</p>}
      </div>
      {state.message && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{state.message}</p>}
      <button className="btn-primary" type="submit" disabled={pending} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
        {pending ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
