'use client'
import { useRef, useEffect } from 'react'

export default function HeroBackground() {
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

    const blobs = [
      { x: 0.3, y: 0.4, r: 0.4, color: [113, 82, 156], speed: 0.0008, offset: 0 },
      { x: 0.7, y: 0.3, r: 0.35, color: [192, 132, 252], speed: 0.0012, offset: 2 },
      { x: 0.5, y: 0.7, r: 0.45, color: [96, 165, 250], speed: 0.001, offset: 4 },
      { x: 0.2, y: 0.6, r: 0.3, color: [244, 114, 182], speed: 0.0015, offset: 1 },
      { x: 0.8, y: 0.6, r: 0.35, color: [139, 92, 246], speed: 0.0009, offset: 3 },
    ]

    const animate = () => {
      time++
      ctx.fillStyle = 'rgba(10, 10, 18, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      blobs.forEach(blob => {
        const x = canvas.width * (blob.x + Math.sin(time * blob.speed + blob.offset) * 0.15)
        const y = canvas.height * (blob.y + Math.cos(time * blob.speed * 0.8 + blob.offset) * 0.1)
        const r = canvas.width * blob.r

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `rgba(${blob.color[0]},${blob.color[1]},${blob.color[2]}, 0.08)`)
        gradient.addColorStop(0.5, `rgba(${blob.color[0]},${blob.color[1]},${blob.color[2]}, 0.03)`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationId = requestAnimationFrame(animate)
    }

    // Initial fill
    ctx.fillStyle = '#0A0A12'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }} />
      {/* Overlay grain texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(10,10,18,0.4) 100%)',
        pointerEvents: 'none',
      }} />
    </>
  )
}