'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const services = [
  {
    title: 'AR/VR & Mixed Reality',
    desc: 'Immersive experiences that blur the line between digital and physical worlds.',
    tag: 'XR',
    gradient: 'linear-gradient(135deg, #2D1B69 0%, #1A1035 100%)',
    features: ['VR Games', 'AR Filters', 'WebAR', '360° Tours'],
    images: ['/services/arvr/G3.png', '/services/arvr/G4.png', '/services/arvr/G5.png'],
  },
  {
    title: 'Game Design & Development',
    desc: 'Engaging games that captivate players and elevate brand experiences.',
    tag: 'Gaming',
    gradient: 'linear-gradient(135deg, #1B2969 0%, #0F1A3D 100%)',
    features: ['Mobile Games', 'Branded Games', 'Hyper-Casual', 'Playable Ads'],
    images: ['/services/games/game1.jpeg', '/services/games/game2.jpeg', '/services/games/game3.jpeg', '/services/games/game4.jpeg'],
  },
  {
    title: 'Event Activation',
    desc: 'Turn events into unforgettable interactive experiences.',
    tag: 'Events',
    gradient: 'linear-gradient(135deg, #3D1B69 0%, #251040 100%)',
    features: ['VR Zones', 'AR Photo Booth', 'Installations', 'Brand Activations'],
    images: ['/services/events/E3.jpg', '/services/events/E7.jpg', '/services/events/E8.jpg'],
  },
  {
    title: 'Web & App Solutions',
    desc: 'Full-stack development for modern, performant digital products.',
    tag: 'Web',
    gradient: 'linear-gradient(135deg, #1B4D69 0%, #0F2D3D 100%)',
    features: ['Web Apps', 'Mobile Apps', 'E-commerce', 'UI/UX Design'],
    icon: '🌐',
  },
  {
    title: 'AI & Generative Solutions',
    desc: 'AI-powered tools and generative experiences for next-gen campaigns.',
    tag: 'AI',
    gradient: 'linear-gradient(135deg, #4D1B69 0%, #2D1040 100%)',
    features: ['Gen AI', 'AI Chatbots', 'AI Filters', 'Automation'],
    icon: '🤖',
  },
  {
    title: 'IoT Solutions',
    desc: 'Connected devices and smart systems for the physical world.',
    tag: 'IoT',
    gradient: 'linear-gradient(135deg, #1B6955 0%, #0F3D30 100%)',
    features: ['Smart Devices', 'Sensors', 'Monitoring', 'Prototyping'],
    icon: '📡',
  },
]

function Slideshow({ images }) {
  const [current, setCurrent] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !images || images.length <= 1) return
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isVisible, images])

  if (!images) return null

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      ))}
      {/* Dots */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 2,
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            onClick={(e) => { e.preventDefault(); setCurrent(i) }}
            style={{
              width: i === current ? '18px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? '#C084FC' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      {/* Dark overlay at bottom for readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

export default function HorizontalScrollServices() {
  return (
    <div style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', marginBottom: '2rem' }}>
        <div className="section-label">What We Do</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0, color: '#FFFFFF' }}>Our Services</h2>
          <Link href="/services" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: '#C084FC', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none',
          }}>
            View all services
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {services.map((service, i) => (
          <div
            key={i}
            style={{
              position: 'sticky',
              top: `${80 + i * 20}px`,
              marginBottom: '2rem',
              zIndex: i + 1,
            }}
          >
            <Link href="/services" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div
                className="stack-card"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(192,132,252,0.2)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  background: 'rgba(26,16,40,0.98)',
                }}
              >
                {/* Left — slideshow or icon */}
                <div style={{
                  background: service.gradient,
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {service.images ? (
                    <Slideshow images={service.images} />
                  ) : (
                    <>
                      <div style={{
                        position: 'absolute', inset: 0, opacity: 0.05,
                        backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                      }} />
                      <span style={{ fontSize: '5rem', position: 'relative', zIndex: 1 }}>{service.icon}</span>
                    </>
                  )}
                  <span style={{
                    position: 'absolute', top: '1.25rem', left: '1.25rem',
                    padding: '0.35rem 0.9rem', borderRadius: '50px',
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
                    fontSize: '0.7rem', fontWeight: 600, color: '#C084FC',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    border: '1px solid rgba(192,132,252,0.2)',
                    zIndex: 3,
                  }}>{service.tag}</span>
                  <span style={{
                    position: 'absolute', bottom: '1.25rem', right: '1.25rem',
                    fontFamily: 'var(--font-display)', fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.5)', zIndex: 3,
                  }}>{String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</span>
                </div>

                {/* Right — info */}
               <div style={{
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: '#FFFFFF',
                    lineHeight: 1.3,
                  }}>{service.title}</h3>

                  <p style={{
                    color: '#B0B0C5',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                  }}>{service.desc}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {service.features.map((f, j) => (
                      <span key={j} style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '6px',
                        background: 'rgba(192,132,252,0.1)',
                        fontSize: '0.75rem',
                        color: '#B0B0C5',
                        border: '1px solid rgba(192,132,252,0.15)',
                      }}>{f}</span>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    color: '#C084FC', fontSize: '0.9rem', fontWeight: 600,
                  }}>
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}