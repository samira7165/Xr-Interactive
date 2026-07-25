'use client'

import { useState } from 'react'

export default function CommentForm({ slug }) {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('pending')
    setErrors({})
    setServerError('')

    const formData = new FormData(form)
    const payload = {
      name: formData.get('name'),
      body: formData.get('body'),
    }

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
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

      if (res.status === 429) {
        const { error } = await res.json().catch(() => ({}))
        setServerError(error || 'Too many requests. Please try again later.')
        setStatus('idle')
        return
      }

      if (!res.ok) {
        setServerError('Something went wrong. Please try again.')
        setStatus('idle')
        return
      }

      form.reset()
      setStatus('success')
    } catch {
      setServerError('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '1.5rem', textAlign: 'center',
        background: 'rgba(22,22,42,0.95)', borderRadius: '16px',
        border: '1px solid var(--border)',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Thanks! Your comment has been submitted and will appear once it&rsquo;s reviewed.
        </p>
      </div>
    )
  }

  const pending = status === 'pending'

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{
      padding: '1.5rem',
      background: 'rgba(22,22,42,0.95)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
    }}>
      <div className="form-group">
        <label htmlFor="comment-name">Name</label>
        <input id="comment-name" type="text" name="name" placeholder="John Doe" maxLength={80} required />
        {errors.name && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.name[0]}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="comment-body">Comment</label>
        <textarea id="comment-body" name="body" placeholder="Share your thoughts..." rows={4} maxLength={2000} required />
        {errors.body && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.body[0]}</p>}
      </div>
      {serverError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{serverError}</p>}
      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Post Comment'}
      </button>
    </form>
  )
}
