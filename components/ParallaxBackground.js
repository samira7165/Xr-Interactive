'use client'

import { useEffect, useRef } from 'react'

export default function ParallaxBackground() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    // ===== FLOATING SHAPES PARALLAX =====
    const container = containerRef.current
    if (!container) return

    const shapes = container.querySelectorAll('.float-shape')
    const glows = container.querySelectorAll('.glow-orb')

    const handleShapeScroll = () => {
      const scrollY = window.scrollY
      shapes.forEach((shape) => {
        const speed = parseFloat(shape.dataset.speed)
        const rotate = parseFloat(shape.dataset.rotate || 0)
        shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * rotate}deg)`
      })
      glows.forEach((glow) => {
        const speed = parseFloat(glow.dataset.speed)
        glow.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    window.addEventListener('scroll', handleShapeScroll, { passive: true })

    // ===== GRID WARP CANVAS =====
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

    const handleScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      scrollRef.current = scrollable > 0 ? window.scrollY / scrollable : 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const handleMouse = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', handleMouse)

    const drawGrid = () => {
      time += 0.005
      const w = canvas.width
      const h = canvas.height
      const scroll = scrollRef.current
      const mx = mouseRef.current.x

      ctx.clearRect(0, 0, w, h)

      const horizonY = h * (0.45 - scroll * 0.15)
      const vanishX = w * (0.5 + (mx - 0.5) * 0.1)
      const warpStrength = scroll * 0.3
      const gridPulse = Math.sin(time * 2) * 0.02

      const r = Math.round(113 + scroll * 80)
      const g = Math.round(82 + scroll * 60)
      const b = Math.round(156 + scroll * 40)
      const baseOpacity = 0.06 + scroll * 0.04

      // Horizontal lines
      const numHLines = 30
      for (let i = 0; i < numHLines; i++) {
        const t = i / numHLines
        const perspT = Math.pow(t, 2.5)
        let y = horizonY + perspT * (h - horizonY) * 1.2
        const waveOffset = Math.sin(t * Math.PI * 3 + time * 2) * warpStrength * 30
        y += waveOffset
        const opacity = baseOpacity * Math.pow(t, 0.5) * (1 + gridPulse)

        ctx.beginPath()
        ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`
        ctx.lineWidth = t < 0.3 ? 0.5 : 1
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(
          w * 0.25, y + Math.sin(time + t * 5) * warpStrength * 15,
          w * 0.75, y - Math.sin(time + t * 5) * warpStrength * 15,
          w, y
        )
        ctx.stroke()
      }

      // Vertical lines
      const numVLines = 20
      for (let i = 0; i < numVLines; i++) {
        const t = (i - numVLines / 2) / (numVLines / 2)
        const bottomX = vanishX + t * w * 0.8
        const topX = vanishX + t * w * 0.05
        const waveX = Math.sin(t * Math.PI * 2 + time * 1.5) * warpStrength * 20
        const opacity = baseOpacity * (1 - Math.abs(t) * 0.3) * (1 + gridPulse)

        ctx.beginPath()
        ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`
        ctx.lineWidth = 0.5
        ctx.moveTo(topX, horizonY)
        ctx.quadraticCurveTo(bottomX + waveX, horizonY + (h - horizonY) * 0.5, bottomX, h * 1.1)
        ctx.stroke()
      }

      // Glow at vanishing point
      const glowRadius = 150 + scroll * 100
      const glowGrad = ctx.createRadialGradient(vanishX, horizonY, 0, vanishX, horizonY, glowRadius)
      glowGrad.addColorStop(0, `rgba(${r},${g},${b},${0.08 + scroll * 0.05})`)
      glowGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.03)`)
      glowGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = glowGrad
      ctx.fillRect(vanishX - glowRadius, horizonY - glowRadius, glowRadius * 2, glowRadius * 2)

      // Grid intersection dots
      for (let i = 0; i < 15; i++) {
        const dotT = (i + 1) / 16
        const perspDot = Math.pow(dotT, 2.5)
        const dotY = horizonY + perspDot * (h - horizonY) * 1.1
        const dotSpread = dotT * w * 0.4

        for (let j = -2; j <= 2; j++) {
          const dotX = vanishX + j * dotSpread
          const wave = Math.sin(time * 2 + i + j) * warpStrength * 10
          const dotOpacity = baseOpacity * 1.5 * Math.pow(dotT, 0.3)
          const dotSize = 1 + dotT * 1.5

          ctx.beginPath()
          ctx.arc(dotX + wave, dotY, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${dotOpacity})`
          ctx.fill()
        }
      }

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 100)
      skyGrad.addColorStop(0, 'rgba(10,10,18,0.3)')
      skyGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, horizonY + 100)

      animationId = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleShapeScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <>
      {/* Grid canvas - bottom layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Floating shapes - top layer */}
      <div ref={containerRef} style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>

        {/* ===== GRADIENT GLOWS ===== */}
        <div className="glow-orb" data-speed="-0.05" style={{
          position: 'absolute',
          width: '800px', height: '800px',
          top: '-200px', left: '-200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(113,82,156,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="glow-orb" data-speed="-0.08" style={{
          position: 'absolute',
          width: '600px', height: '600px',
          top: '600px', right: '-150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="glow-orb" data-speed="-0.04" style={{
          position: 'absolute',
          width: '700px', height: '700px',
          top: '1400px', left: '-100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="glow-orb" data-speed="-0.06" style={{
          position: 'absolute',
          width: '800px', height: '800px',
          top: '2200px', right: '-200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div className="glow-orb" data-speed="-0.03" style={{
          position: 'absolute',
          width: '600px', height: '600px',
          top: '3200px', left: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* ===== FLOATING SHAPES ===== */}
        <div className="float-shape" data-speed="-0.12" data-rotate="0.02" style={{
          position: 'absolute', width: '8px', height: '8px', top: '15%', left: '10%',
          borderRadius: '50%', background: 'rgba(192,132,252,0.3)',
          boxShadow: '0 0 10px rgba(192,132,252,0.2)',
        }} />

        <div className="float-shape" data-speed="-0.18" data-rotate="0" style={{
          position: 'absolute', width: '5px', height: '5px', top: '25%', right: '15%',
          borderRadius: '50%', background: 'rgba(96,165,250,0.3)',
        }} />

        <div className="float-shape" data-speed="-0.08" data-rotate="0" style={{
          position: 'absolute', width: '6px', height: '6px', top: '55%', left: '8%',
          borderRadius: '50%', background: 'rgba(244,114,182,0.25)',
        }} />

        <div className="float-shape" data-speed="-0.15" data-rotate="0" style={{
          position: 'absolute', width: '4px', height: '4px', top: '70%', right: '20%',
          borderRadius: '50%', background: 'rgba(192,132,252,0.3)',
        }} />

        <div className="float-shape" data-speed="-0.1" data-rotate="0" style={{
          position: 'absolute', width: '7px', height: '7px', top: '85%', left: '25%',
          borderRadius: '50%', background: 'rgba(139,92,246,0.25)',
          boxShadow: '0 0 8px rgba(139,92,246,0.15)',
        }} />

        {/* Diamonds */}
        <div className="float-shape" data-speed="-0.14" data-rotate="0.05" style={{
          position: 'absolute', width: '10px', height: '10px', top: '20%', right: '25%',
          background: 'rgba(192,132,252,0.15)', transform: 'rotate(45deg)',
          border: '1px solid rgba(192,132,252,0.2)',
        }} />

        <div className="float-shape" data-speed="-0.09" data-rotate="-0.03" style={{
          position: 'absolute', width: '8px', height: '8px', top: '45%', left: '18%',
          background: 'rgba(96,165,250,0.1)', transform: 'rotate(45deg)',
          border: '1px solid rgba(96,165,250,0.15)',
        }} />

        <div className="float-shape" data-speed="-0.16" data-rotate="0.04" style={{
          position: 'absolute', width: '12px', height: '12px', top: '75%', right: '12%',
          background: 'rgba(244,114,182,0.1)', transform: 'rotate(45deg)',
          border: '1px solid rgba(244,114,182,0.15)',
        }} />

        {/* Rings */}
        <div className="float-shape" data-speed="-0.11" data-rotate="0.02" style={{
          position: 'absolute', width: '30px', height: '30px', top: '30%', left: '5%',
          borderRadius: '50%', border: '1px solid rgba(192,132,252,0.12)',
        }} />

        <div className="float-shape" data-speed="-0.07" data-rotate="-0.01" style={{
          position: 'absolute', width: '20px', height: '20px', top: '60%', right: '8%',
          borderRadius: '50%', border: '1px solid rgba(96,165,250,0.12)',
        }} />

        <div className="float-shape" data-speed="-0.13" data-rotate="0.03" style={{
          position: 'absolute', width: '25px', height: '25px', top: '40%', right: '35%',
          borderRadius: '50%', border: '1px solid rgba(139,92,246,0.1)',
        }} />

        {/* Lines */}
        <div className="float-shape" data-speed="-0.1" data-rotate="0.08" style={{
          position: 'absolute', width: '40px', height: '1px', top: '35%', left: '30%',
          background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.2), transparent)',
        }} />

        <div className="float-shape" data-speed="-0.06" data-rotate="-0.05" style={{
          position: 'absolute', width: '30px', height: '1px', top: '65%', right: '30%',
          background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.2), transparent)',
        }} />

        {/* Plus signs */}
        <div className="float-shape" data-speed="-0.17" data-rotate="0.06" style={{
          position: 'absolute', top: '50%', left: '15%',
          fontSize: '14px', color: 'rgba(192,132,252,0.15)', fontWeight: 300,
        }}>+</div>

        <div className="float-shape" data-speed="-0.09" data-rotate="-0.04" style={{
          position: 'absolute', top: '80%', right: '18%',
          fontSize: '12px', color: 'rgba(139,92,246,0.15)', fontWeight: 300,
        }}>+</div>

      </div>
    </>
  )
}