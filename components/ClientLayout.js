'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import Loader from './Loader'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import ShootingStar from './ShootingStar'
import usePrefersReducedMotion from './usePrefersReducedMotion'

const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false })

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleLoaded = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {})
  }, [pathname])

  useEffect(() => {
    if (loading) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [loading])

  if (pathname?.startsWith('/admin')) return <>{children}</>

  return (
    <>
      {loading && <Loader onComplete={handleLoaded} />}
      {!prefersReducedMotion && pathname === '/' && (
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(113,82,156,0.15) 0%, transparent 70%)' }} />}>
          <ParticleBackground />
        </Suspense>
      )}
      {!prefersReducedMotion && <ShootingStar />}
      <ScrollToTop />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
        <Footer />
      </div>
    </>
  )
}