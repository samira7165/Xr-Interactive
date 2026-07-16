'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (submitted) {
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

  return (
    <div className="contact-form" style={{
      padding: '2rem',
      background: 'rgba(22,22,42,0.95)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" placeholder="John" />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" placeholder="Doe" />
        </div>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="john@company.com" />
      </div>
      <div className="form-group">
        <label>Service Interested In</label>
        <select defaultValue="">
          <option value="" disabled>Select a service</option>
          <option>AR/VR & Mixed Reality</option>
          <option>Game Development</option>
          <option>Event Activation</option>
          <option>Web & App Solutions</option>
          <option>AI Solutions</option>
          <option>IoT Solutions</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Tell us about your project</label>
        <textarea placeholder="Describe your project, goals, and timeline..." rows={5} />
      </div>
      <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', justifyContent: 'center' }}>
        Send Message
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  )
}
