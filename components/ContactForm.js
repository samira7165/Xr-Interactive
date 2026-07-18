'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('pending')
    setErrors({})
    setServerError('')

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 400) {
        const { errors } = await res.json()
        setErrors(errors || {})
        setStatus('idle')
        return
      }

      if (!res.ok) {
        setServerError('Something went wrong. Please try again.')
        setStatus('idle')
        return
      }

      setStatus('success')
    } catch {
      setServerError('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '3rem 2rem', textAlign: 'center',
        background: 'rgba(22,22,42,0.95)', borderRadius: '16px',
        border: '1px solid var(--border)', backdropFilter: 'blur(10px)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '0.5rem' }}>
          Message Sent!
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
      </div>
    )
  }

  const pending = status === 'pending'

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{
      padding: '2rem',
      background: 'rgba(22,22,42,0.95)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" placeholder="John Doe" />
        {errors.name && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.name[0]}</p>}
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" placeholder="john@company.com" />
        {errors.email && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.email[0]}</p>}
      </div>
      <div className="form-group">
        <label>Phone (optional)</label>
        <input type="tel" name="phone" placeholder="+880 1XXX-XXXXXX" />
      </div>
      <div className="form-group">
        <label>Tell us about your project</label>
        <textarea name="message" placeholder="Describe your project, goals, and timeline..." rows={5} />
        {errors.message && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.message[0]}</p>}
      </div>
      {serverError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{serverError}</p>}
      <button className="btn-primary" type="submit" disabled={pending} style={{ width: '100%', justifyContent: 'center' }}>
        {pending ? 'Sending...' : 'Send Message'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </form>
  )
}
