'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import Loader from './Loader'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import ShootingStar from './ShootingStar'

const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false })

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true)

  const handleLoaded = useCallback(() => {
    setLoading(false)
  }, [])

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

  return (
    <>
      {loading && <Loader onComplete={handleLoaded} />}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <ShootingStar />
      <ScrollToTop />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
        <Footer />
      </div>
    </>
  )
}