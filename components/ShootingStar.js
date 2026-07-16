'use client'

import { useEffect, useRef } from 'react'

export default function ShootingStar() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const getStarPosition = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      const t = Math.min(Math.max(scrollProgress, 0), 1)

      const w = canvas.width
      const h = canvas.height

      const x = w * 0.5 + Math.sin(t * Math.PI * 3) * w * 0.3
      const y = h * 0.15 + t * h * 0.7

      return { x, y, t }
    }

    const draw = () => {
      time += 0.02
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      const star = getStarPosition()
      const pulse = 0.85 + Math.sin(time * 4) * 0.15

      // Layer 1: Huge ambient glow
      const ambientGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 200 * pulse)
      ambientGlow.addColorStop(0, 'rgba(192,132,252,0.12)')
      ambientGlow.addColorStop(0.3, 'rgba(139,92,246,0.06)')
      ambientGlow.addColorStop(0.6, 'rgba(113,82,156,0.02)')
      ambientGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = ambientGlow
      ctx.beginPath()
      ctx.arc(star.x, star.y, 200 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Layer 2: Medium warm glow
      const warmGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 80 * pulse)
      warmGlow.addColorStop(0, 'rgba(255,180,120,0.25)')
      warmGlow.addColorStop(0.3, 'rgba(255,140,80,0.12)')
      warmGlow.addColorStop(0.6, 'rgba(192,132,252,0.06)')
      warmGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = warmGlow
      ctx.beginPath()
      ctx.arc(star.x, star.y, 80 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Layer 3: Inner hot glow
      const hotGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 30 * pulse)
      hotGlow.addColorStop(0, `rgba(255,255,255,${0.9 * pulse})`)
      hotGlow.addColorStop(0.2, `rgba(255,220,180,${0.7 * pulse})`)
      hotGlow.addColorStop(0.5, `rgba(255,160,100,${0.4 * pulse})`)
      hotGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = hotGlow
      ctx.beginPath()
      ctx.arc(star.x, star.y, 30 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Layer 4: Bright white core
      const core = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8 * pulse)
      core.addColorStop(0, `rgba(255,255,255,${1 * pulse})`)
      core.addColorStop(0.5, `rgba(255,240,220,${0.8 * pulse})`)
      core.addColorStop(1, 'transparent')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(star.x, star.y, 8 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Lens flare — horizontal streak
      const flareWidth = 60 * pulse
      const flareGrad = ctx.createLinearGradient(star.x - flareWidth, star.y, star.x + flareWidth, star.y)
      flareGrad.addColorStop(0, 'transparent')
      flareGrad.addColorStop(0.3, `rgba(255,200,150,${0.1 * pulse})`)
      flareGrad.addColorStop(0.5, `rgba(255,255,255,${0.3 * pulse})`)
      flareGrad.addColorStop(0.7, `rgba(255,200,150,${0.1 * pulse})`)
      flareGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = flareGrad
      ctx.fillRect(star.x - flareWidth, star.y - 2, flareWidth * 2, 4)

      // Lens flare — vertical streak
      const vFlareGrad = ctx.createLinearGradient(star.x, star.y - flareWidth * 0.5, star.x, star.y + flareWidth * 0.5)
      vFlareGrad.addColorStop(0, 'transparent')
      vFlareGrad.addColorStop(0.3, `rgba(255,200,150,${0.06 * pulse})`)
      vFlareGrad.addColorStop(0.5, `rgba(255,255,255,${0.15 * pulse})`)
      vFlareGrad.addColorStop(0.7, `rgba(255,200,150,${0.06 * pulse})`)
      vFlareGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = vFlareGrad
      ctx.fillRect(star.x - 1.5, star.y - flareWidth * 0.5, 3, flareWidth)

      // Small floating embers around the star
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 1.5
        const dist = 25 + Math.sin(time * 3 + i) * 15
        const emberX = star.x + Math.cos(angle) * dist * pulse
        const emberY = star.y + Math.sin(angle) * dist * pulse
        const emberSize = 1.5 + Math.sin(time * 4 + i * 2) * 0.8

        const emberGlow = ctx.createRadialGradient(emberX, emberY, 0, emberX, emberY, emberSize * 3)
        emberGlow.addColorStop(0, `rgba(255,200,150,${0.5 * pulse})`)
        emberGlow.addColorStop(0.5, `rgba(192,132,252,${0.2 * pulse})`)
        emberGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = emberGlow
        ctx.beginPath()
        ctx.arc(emberX, emberY, emberSize * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}