'use client'

import { useState, useEffect } from 'react'

const WORD = 'INTERACTIVE'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 4 + 1.5
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setVisible(false)
            setTimeout(() => onComplete(), 600)
          }, 500)
          return 100
        }
        return next
      })
    }, 45)

    return () => clearInterval(interval)
  }, [onComplete])

  const letters = WORD.split('')

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#0A0A12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
      pointerEvents: visible ? 'auto' : 'none',
      overflow: 'hidden',
    }}>

      {/* Glow behind text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${320 + progress * 5}px`,
        height: `${320 + progress * 5}px`,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(192,132,252,0.2) 0%, rgba(113,82,156,0.08) 40%, transparent 70%)',
        filter: 'blur(20px)',
        transition: 'width 0.3s ease-out, height 0.3s ease-out',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '150px',
        height: '150px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'loaderPulse 2.5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Top-left logo */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        zIndex: 2,
      }}>
        <img src="/logo.png" alt="XR Interactive" style={{
          height: '32px',
          filter: 'drop-shadow(0 0 15px rgba(192,132,252,0.3))',
        }} />
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.05em',
        }}>
          XR Interactive
        </span>
      </div>

      {/* Top-right counter */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.15rem',
        fontFamily: "'Space Grotesk', monospace",
        zIndex: 2,
      }}>
        <span style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#FFFFFF',
          minWidth: '2.5ch',
          textAlign: 'right',
          textShadow: '0 0 20px rgba(192,132,252,0.5)',
        }}>
          {String(Math.floor(progress)).padStart(2, '0')}
        </span>
        <span style={{
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.35)',
        }}>
          %
        </span>
      </div>

      {/* Center word — slides in from the right, staggered */}
      <div style={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2,
      }}>
        {letters.map((letter, i) => (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.8rem, 6.5vw, 4.5rem)',
                fontWeight: 700,
                letterSpacing: '0.01em',
                background: 'linear-gradient(135deg, #71529C 0%, #C084FC 50%, #E0AAFF 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 25px rgba(192,132,252,0.4))',
                transform: started ? 'translateX(0)' : 'translateX(100%)',
                opacity: started ? 1 : 0,
                transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease`,
                transitionDelay: `${i * 0.045}s`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom progress bar */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '2rem',
        right: '2rem',
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        zIndex: 2,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #71529C, #C084FC)',
          boxShadow: '0 0 10px rgba(192,132,252,0.6)',
          transition: 'width 0.1s ease-out',
        }} />
      </div>

      {/* Bottom-left tag */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '2rem',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        zIndex: 2,
      }}>
        Immersive Technology Studio
      </div>

      {/* Bottom-right status */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '2rem',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        zIndex: 2,
      }}>
        {progress < 100 ? 'Loading' : 'Ready'}
      </div>

      <style>{`
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  )
}