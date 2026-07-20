'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Work' },
  { path: '/blog', label: 'Blog' },
  { path: '/careers', label: 'Careers' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          opacity: scrolled ? 0 : 1,
          width: scrolled ? 0 : 'auto',
          overflow: 'hidden',
          transition: 'all 0.5s ease',
        }}>
          <Image src="/logo.png" alt="XR Interactive" width={150} height={150} priority />
        </Link>

        <div className="nav-links" style={{
          gap: scrolled ? '1.5rem' : '2rem',
          transition: 'gap 0.5s ease',
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className="nav-cta" style={{
          padding: scrolled ? '0.45rem 1.2rem' : '0.6rem 1.5rem',
          fontSize: scrolled ? '0.8rem' : '0.85rem',
          transition: 'all 0.5s ease',
        }}
          id="nav-cta-desktop"
        >
          Let&apos;s Talk
          <span style={{
            display: 'inline-flex', marginLeft: '0.4rem',
            transition: 'transform 0.3s',
          }}>→</span>
        </Link>
        <style>{`
          @media(min-width:769px){
            #nav-cta-desktop{display:inline-flex!important}
          }
        `}</style>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <Link key={item.path} href={item.path}>{item.label}</Link>
        ))}
        <Link href="/contact" className="btn-primary" style={{ marginTop: '1rem' }}>
          Let&apos;s Talk
        </Link>
      </div>
    </>
  )
}
