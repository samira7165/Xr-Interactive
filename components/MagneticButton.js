'use client'
import { useRef, useState } from 'react'

export default function MagneticButton({ children, className = '', style = {}, ...props }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    setPos({ x: distX * 0.3, y: distY * 0.3 })
  }

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 })
    setHovering(false)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-block',
        transform: `translate(${pos.x}px, ${pos.y}px) scale(${hovering ? 1.08 : 1})`,
        transition: hovering
          ? 'transform 0.15s ease-out'
          : 'transform 0.4s ease-out',
      }}
    >
      <div
        className={className}
        style={{
          ...style,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: hovering
            ? '0 0 30px rgba(192,132,252,0.5), 0 0 60px rgba(192,132,252,0.2)'
            : '0 0 0px transparent',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        }}
        {...props}
      >
        {/* Glow sweep */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          transform: hovering ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.6s ease',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }} />
        {children}
      </div>
    </div>
  )
}