'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AnimatedCounter from '@/components/AnimatedCounter'
import WordReveal from '@/components/WordReveal'
import { ScrollReveal, Parallax } from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import { services, portfolio, stats } from '@/data'

const HeroBackground = dynamic(() => import('@/components/HeroBackground'), { ssr: false })

function useTypewriter(words, typingSpeed = 100, deletingSpeed = 60, pauseTime = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.slice(0, text.length + 1))
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setText(currentWord.slice(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return text
}

export default function Home() {
  return (
    <main>
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroBackground />
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal direction="left" delay={0}>
            <div className="hero-badge">
              <span className="dot" />
              Your Interactive Solutions Partner
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.15}>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)' }}>
              Transforming Brands Through<br />
              <span className="gradient-text">
                Interactive {useTypewriter(['3D Experiences', 'Virtual Worlds', 'AR Filters', 'Digital Magic'])}
                <span style={{ borderRight: '3px solid var(--accent)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.3}>
            <p>We craft next-gen interactive solutions that bring your brand to life from concept to reality.</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['XR', 'VR', 'AR', 'Game', 'App', 'IoT'].map(tag => (
                <span key={tag} style={{ padding: '0.4rem 1rem', borderRadius: '50px', background: 'rgba(113,82,156,0.2)', border: '1px solid rgba(192,132,252,0.3)', fontSize: '0.85rem', fontWeight: 600, color: '#C084FC', letterSpacing: '0.05em' }}>{tag}</span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.6}>
            <div className="hero-actions">
              <MagneticButton>
                <Link href="/portfolio" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  View Our Work
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {"Let's Talk"}
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', animation: 'bounce 2s ease infinite' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* ===== CLIENT LOGOS ===== */}
      <section style={{
        padding: '3.5rem 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
        }}>
          Trusted by leading brands
        </p>

        <div style={{
          display: 'flex',
          gap: '3.5rem',
          alignItems: 'center',
          animation: 'marquee 30s linear infinite',
          width: 'max-content',
          marginBottom: '2rem',
        }}>
          {[...Array(2)].flatMap((_, s) =>
            [
              { src: '/clients/airtel.png', name: 'Airtel' },
              { src: '/clients/asianpaints.png', name: 'Asian Paints' },
              { src: '/clients/banglalink.png', name: 'Banglalink' },
              { src: '/clients/bkash.png', name: 'bKash' },
              { src: '/clients/bsrm.png', name: 'BSRM' },
              { src: '/clients/dano.png', name: 'DANO' },
              { src: '/clients/godrej.png', name: 'Godrej' },
              { src: '/clients/grey.png', name: 'Grey' },
              { src: '/clients/huawei.png', name: 'Huawei' },
              { src: '/clients/kfc.png', name: 'KFC' },
              { src: '/clients/marico.png', name: 'Marico' },
              { src: '/clients/nestle.png', name: 'Nestle' },
              { src: '/clients/robi.png', name: 'Robi' },
              { src: '/clients/reneta.png', name: 'Renata' },
              { src: '/clients/square.png', name: 'Square' },
            ].map((brand, i) => (
              <img
                key={`r1-${s}-${i}`}
                src={brand.src}
                alt={brand.name}
                title={brand.name}
                style={{
            
                  height: '55',
                  maxHeight: '70px',
                  maxWidth: '160px',
                  objectFit: 'contain',
                  filter: 'none',opacity: 0.7,
                  opacity: 0.5,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  userSelect: 'none',
                }}
                onMouseEnter={e => {
  e.target.style.opacity = '1'
  e.target.style.transform = 'scale(1.1)'
}}
onMouseLeave={e => {
  e.target.style.opacity = '0.7'
  e.target.style.transform = 'scale(1)'
}}
              />
            ))
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '3.5rem',
          alignItems: 'center',
          animation: 'marqueeReverse 35s linear infinite',
          width: 'max-content',
        }}>
          {[...Array(2)].flatMap((_, s) =>
            [
              { src: '/clients/analyzen.png', name: 'Analyzen' },
              { src: '/clients/bsm.png', name: 'BSM' },
              { src: '/clients/exp.png', name: 'EXP' },
              { src: '/clients/jhonhopkins.png', name: 'Johns Hopkins' },
              { src: '/clients/mlc.png', name: 'MLC' },
              { src: '/clients/monico.png', name: 'Monico' },
              { src: '/clients/pushti.png', name: 'Pushti' },
              { src: '/clients/searchlite.png', name: 'Searchlite' },
              { src: '/clients/sunpharma.png', name: 'Sun Pharma' },
              { src: '/clients/syngenta.png', name: 'Syngenta' },
              { src: '/clients/unfpa.png', name: 'UNFPA' },
              { src: '/clients/windmill.png', name: 'Windmill' },
              { src: '/clients/zanzee.png', name: 'Za N Zee' },
              { src: '/clients/proffessorfedel.png', name: 'Professor Fedel' },
              { src: '/clients/poribar.png', name: 'Poribar Pori Kolpona' },
            ].map((brand, i) => (
              <img
                key={`r2-${s}-${i}`}
                src={brand.src}
                alt={brand.name}
                title={brand.name}
                style={{
                  height: '55',
                  maxHeight: '70px',
                  maxWidth: '160px',
                  objectFit: 'contain',
                  filter: 'none',opacity: 0.7,
                  opacity: 0.5,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  userSelect: 'none',
                }}
                onMouseEnter={e => {
  e.target.style.opacity = '1'
  e.target.style.transform = 'scale(1.1)'
}}
onMouseLeave={e => {
  e.target.style.opacity = '0.7'
  e.target.style.transform = 'scale(1)'
}}
              />
            ))
          )}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number"><AnimatedCounter target={s.number} suffix={s.suffix} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <ScrollReveal direction="left"><div className="section-label">What We Do</div></ScrollReveal>
        <ScrollReveal direction="left" delay={0.1}><h2 className="section-title">Interactive Solutions for Modern Brands</h2></ScrollReveal>
        <ScrollReveal direction="left" delay={0.2}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            XR Interactive is a creative technology studio based in Dhaka. We combine AR, VR, game design, and AI to create immersive experiences that brands and their audiences actually remember.
          </p>
        </ScrollReveal>
        <ScrollReveal direction="left" delay={0.3}>
          <Link href="/about" className="btn-secondary" style={{ display: 'inline-flex', marginBottom: '2.5rem' }}>
            Learn About Us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </ScrollReveal>
        <div className="services-scroll">
          {services.map((s, i) => (
            <ScrollReveal key={s.id} direction="up" delay={i * 0.1}>
              <Link href="/services" className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span className="card-link">Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '1300px', margin: '0 auto' }}>
        <ScrollReveal direction="up">
          <div className="section-label" style={{ textAlign: 'center' }}>How It Works</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>From Idea to <span className="gradient-text">Reality</span> in 3 Steps</h2>
        </ScrollReveal>
        <div className="grid-3-col" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50px', left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--purple), transparent)', zIndex: 0 }} />
          {[
            { step: '01', title: 'Tell Us Your Idea', desc: 'Share your vision with us. We listen, understand, and plan together.', icon: '💬' },
            { step: '02', title: 'We Build It', desc: 'Our team designs, develops, and tests your experience until it is perfect.', icon: '⚙️' },
            { step: '03', title: 'Your Audience Is Amazed', desc: 'We deploy your experience and your brand stands out.', icon: '🚀' },
          ].map((item, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.15}>
              <div style={{ background: 'rgba(22,22,42,0.95)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{item.step}</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Parallax speed={-0.1}>
          <ScrollReveal direction="right"><WordReveal className="section-label">Our Work</WordReveal></ScrollReveal>
          <ScrollReveal direction="right" delay={0.1}><WordReveal className="section-title" delay={0.1}>Featured Projects</WordReveal></ScrollReveal>
          <ScrollReveal direction="right" delay={0.2}><WordReveal className="section-subtitle" delay={0.2}>{"A glimpse into the immersive experiences we have created for brands and events."}</WordReveal></ScrollReveal>
        </Parallax>
        <div className="portfolio-grid">
          {portfolio.slice(0, 6).map((p, i) => (
            <ScrollReveal key={p.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.08}>
              <div className="portfolio-card">
                <div className="card-image">
                  <Parallax speed={0.15}><img src={p.image} alt={p.title} loading="lazy" /></Parallax>
                  <span className="card-category">{p.category}</span>
                </div>
                <div className="card-body"><h3>{p.title}</h3><p>{p.description}</p></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal direction="up" delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/portfolio" className="btn-secondary">View All Projects <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="cta-section">
        <ScrollReveal direction="scale">
          <div className="cta-box">
            <WordReveal><h2>{"Let's Get"} <span className="gradient-text">In Touch</span></h2></WordReveal>
            <WordReveal delay={0.2}>{"Let's discuss how immersive technology can transform your next project."}</WordReveal>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/contact" className="btn-primary">Start a Conversation <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
