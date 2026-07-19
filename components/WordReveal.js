'use client'
import { useRef, useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function WordReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const text = typeof children === 'string' ? children : ''
  const words = text.split(' ')

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  if (!text) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: visible ? 1 : 0.3,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `all 0.3s ease ${delay}s`,
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: visible ? 1 : 0.3,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.3s ease ${delay + i * 0.06}s`,
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}