'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import Loader from './Loader'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false })

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const glowRef = useRef(null)

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

  useEffect(() => {
    const glow = document.getElementById('cursorGlow')
    const handleMove = (e) => {
      if (glow) {
        glow.style.left = e.clientX + 'px'
        glow.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!glowRef.current) return
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      const colors = [
        { r: 113, g: 82, b: 156 },
        { r: 37, g: 99, b: 235 },
        { r: 236, g: 72, b: 153 },
        { r: 113, g: 82, b: 156 },
      ]
      const segment = scrollPercent * (colors.length - 1)
      const i = Math.min(Math.floor(segment), colors.length - 2)
      const t = segment - i
      const r = Math.round(colors[i].r + (colors[i + 1].r - colors[i].r) * t)
      const g = Math.round(colors[i].g + (colors[i + 1].g - colors[i].g) * t)
      const b = Math.round(colors[i].b + (colors[i + 1].b - colors[i].b) * t)
      const yPos = 20 + scrollPercent * 60
      glowRef.current.style.background = `radial-gradient(ellipse 60% 40% at 50% ${yPos}%, rgba(${r},${g},${b},0.15) 0%, transparent 70%)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) return <Loader onComplete={handleLoaded} />

  return (
    <>
      <div className="cursor-glow" id="cursorGlow" />
      <ParticleBackground />
      <div ref={glowRef} style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', transition: 'background 0.3s ease',
      }} />
      <ScrollToTop />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
        <Footer />
      </div>
    </>
  )
}
