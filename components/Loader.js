'use client'
import { useState, useEffect } from 'react'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('INITIALIZING SYSTEM...')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const messages = [
      { at: 0, text: 'INITIALIZING SYSTEM...' },
      { at: 20, text: 'LOADING ASSETS...' },
      { at: 45, text: 'BUILDING 3D ENVIRONMENT...' },
      { at: 65, text: 'CALIBRATING XR ENGINE...' },
      { at: 85, text: 'PREPARING EXPERIENCE...' },
      { at: 95, text: 'ALMOST READY...' },
    ]

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 3 + 1
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setVisible(false)
            setTimeout(() => onComplete(), 500)
          }, 400)
          return 100
        }
        const msg = [...messages].reverse().find(m => next >= m.at)
        if (msg) setStatus(msg.text)
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  if (!visible) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0A0A12',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }} />
    )
  }

  const blocks = 20
  const filled = Math.floor((progress / 100) * blocks)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0A0A12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
      gap: '1.5rem',
      transition: 'opacity 0.5s ease',
    }}>
      {/* Logo */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #71529C 0%, #AC86B8 50%, #C084FC 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '1.5rem', fontWeight: 700, color: 'white',
        marginBottom: '1rem',
        animation: 'logoPulse 2s ease-in-out infinite',
      }}>
        XRI
      </div>

      {/* Status text */}
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: '0.8rem',
        color: '#C084FC',
        letterSpacing: '0.2em',
        textAlign: 'center',
      }}>
        {status}
      </div>

      {/* Progress bar blocks */}
      <div style={{
        display: 'flex',
        gap: '3px',
        padding: '6px 10px',
        border: '1px solid rgba(192,132,252,0.3)',
        borderRadius: '4px',
        background: 'rgba(22,22,42,0.5)',
      }}>
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i} style={{
            width: '14px', height: '20px',
            background: i < filled ? '#C084FC' : 'rgba(113,82,156,0.15)',
            borderRadius: '2px',
            transition: 'background 0.15s ease',
            boxShadow: i < filled ? '0 0 8px rgba(192,132,252,0.5)' : 'none',
          }} />
        ))}
      </div>

      {/* Percentage */}
      <div style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#E0AAFF',
        letterSpacing: '0.1em',
      }}>
        {Math.floor(progress)}%
      </div>

      {/* Bottom decorative text */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        fontFamily: "'Orbitron', monospace",
        fontSize: '0.6rem',
        color: 'rgba(138,138,160,0.5)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
      }}>
        XR Interactive — Immersive Technology Studio
      </div>

      {/* Corner decorations */}
      <svg style={{ position: 'absolute', top: '2rem', left: '2rem', opacity: 0.3 }} width="40" height="40">
        <line x1="0" y1="0" x2="40" y2="0" stroke="#C084FC" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="40" stroke="#C084FC" strokeWidth="1" />
      </svg>
      <svg style={{ position: 'absolute', top: '2rem', right: '2rem', opacity: 0.3 }} width="40" height="40">
        <line x1="0" y1="0" x2="40" y2="0" stroke="#C084FC" strokeWidth="1" />
        <line x1="40" y1="0" x2="40" y2="40" stroke="#C084FC" strokeWidth="1" />
      </svg>
      <svg style={{ position: 'absolute', bottom: '4rem', left: '2rem', opacity: 0.3 }} width="40" height="40">
        <line x1="0" y1="40" x2="40" y2="40" stroke="#C084FC" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="40" stroke="#C084FC" strokeWidth="1" />
      </svg>
      <svg style={{ position: 'absolute', bottom: '4rem', right: '2rem', opacity: 0.3 }} width="40" height="40">
        <line x1="0" y1="40" x2="40" y2="40" stroke="#C084FC" strokeWidth="1" />
        <line x1="40" y1="0" x2="40" y2="40" stroke="#C084FC" strokeWidth="1" />
      </svg>
    </div>
  )
}