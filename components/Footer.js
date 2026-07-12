'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="nav-logo" style={{ fontSize: '1.3rem' }}>
            <div className="logo-icon" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>XR</div>
            <span>XR Interactive</span>
          </Link>
          <p>Creating immersive and interactive solutions that redefine the digital landscape.</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/xrinteractivebd" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/xr-interactive" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
            </a>
            <a href="https://www.instagram.com/xr_interactive" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.youtube.com/@xrinteractive/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#0A0A12"/></svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about">About Us</Link>
          <Link href="/portfolio">Our Work</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <Link href="/services">AR/VR Solutions</Link>
          <Link href="/services">Game Development</Link>
          <Link href="/services">Event Activation</Link>
          <Link href="/services">Web Solutions</Link>
        </div>
        <div className="footer-col">
          <h4>Get in Touch</h4>
          <a href="mailto:info@xri.com.bd">info@xri.com.bd</a>
          <a href="tel:+8801684100800">+880 1684 100800</a>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Dhaka, Bangladesh</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} XR Interactive. All Rights Reserved.</span>
        <span>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>{' · '}<a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
        </span>
      </div>
    </footer>
  )
}
