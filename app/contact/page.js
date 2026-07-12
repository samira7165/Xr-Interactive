'use client'
import { useState } from 'react'
import WordReveal from '@/components/WordReveal'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <main>
      <div className="page-header">
        <ScrollReveal direction="up">
          <div className="section-label">Contact</div>
          <h1>{"Let's"} <span className="gradient-text">Talk</span></h1>
          <p>Have a project in mind? We'd love to hear about it.</p>
        </ScrollReveal>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="contact-grid">
          <ScrollReveal direction="left">
            <div className="contact-info">
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  Get in touch
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                  Whether {"you are"} looking to build a VR experience, launch an AR campaign,
                  or create something entirely new — {"we are"} here to help bring your vision to life.
                </p>
              </div>

              <div className="contact-item">
                <div className="icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:info@xri.com.bd" style={{ color: 'var(--purple-light)' }}>info@xri.com.bd</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p><a href="tel:+8801684100800" style={{ color: 'var(--purple-light)' }}>+880 1684 100800</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>

              <div style={{
                marginTop: '1rem', padding: '1.5rem', borderRadius: '16px',
                background: 'rgba(22,22,42,0.95)', border: '1px solid var(--border)',
                backdropFilter: 'blur(10px)',
              }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Follow Us
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { href: 'https://www.facebook.com/xrinteractivebd', label: 'FB' },
                    { href: 'https://www.linkedin.com/company/xr-interactive', label: 'LI' },
                    { href: 'https://www.instagram.com/xr_interactive', label: 'IG' },
                    { href: 'https://www.youtube.com/@xrinteractive/videos', label: 'YT' },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(113,82,156,0.15)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 600, color: 'var(--purple-light)',
                      transition: 'all 0.3s',
                    }}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            {submitted ? (
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
            ) : (
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
            )}
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}