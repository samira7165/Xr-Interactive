import WordReveal from '@/components/WordReveal'
import { ScrollReveal } from '@/components/ScrollReveal'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact',
  description: 'Have a project in mind? Get in touch with XR Interactive to discuss AR, VR, game development, and immersive technology solutions for your brand.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | XR Interactive',
    description: 'Have a project in mind? Get in touch with XR Interactive to discuss AR, VR, game development, and immersive technology solutions for your brand.',
    url: '/contact',
  },
}

export default function Contact() {
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
                    {
                      href: 'https://www.facebook.com/xrinteractivebd', label: 'Facebook',
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
                    },
                    {
                      href: 'https://www.linkedin.com/company/xr-interactive', label: 'LinkedIn',
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>,
                    },
                    {
                      href: 'https://www.instagram.com/xr_interactive', label: 'Instagram',
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>,
                    },
                    {
                      href: 'https://www.youtube.com/@xrinteractive/videos', label: 'YouTube',
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" /><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#0A0A12" /></svg>,
                    },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(113,82,156,0.15)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--purple-light)',
                      transition: 'all 0.3s',
                    }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
