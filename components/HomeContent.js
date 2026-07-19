'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import AnimatedCounter from '@/components/AnimatedCounter'
import WordReveal from '@/components/WordReveal'
import { ScrollReveal, Parallax } from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import { stats } from '@/data'
import HorizontalScrollServices from '@/components/HorizontalScrollServices'

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

export default function HomeContent({ projects = [] }) {
  const typedText = useTypewriter(['3D Experiences', 'Virtual Worlds', 'AR Filters', 'Digital Magic'])

  return (
    <main>
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', maxWidth: '1300px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }} className="hero-grid">

          <div>
            <p style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#C084FC',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C084FC', boxShadow: '0 0 8px #C084FC', animation: 'dotPulse 2s ease-in-out infinite' }} />
              INTERACTIVE TECH SOLUTION · DHAKA · SINCE 2012
            </p>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)', marginBottom: '1.5rem', color: '#FFFFFF' }}>
              Transforming Brands Through<br />
              <span className="gradient-text">
                Interactive {typedText}
                <span style={{ borderRight: '3px solid var(--accent)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
              </span>
            </h1>

            <p style={{ color: '#B0B0C5', marginBottom: '2rem', lineHeight: 1.7 }}>
              We craft next-gen interactive solutions that bring your brand to life from concept to reality.
            </p>


            <div className="hero-actions">
              <Link href="/portfolio" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                View Our Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {"Let's Talk"}
              </Link>
            </div>
          </div>

          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(192,132,252,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(113,82,156,0.15)',
            background: 'rgba(26,16,40,0.8)',
          }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                display: 'block',
                borderRadius: '20px 20px 0 0',
              }}
            >
              <source src="/xri-promo.mp4" type="video/mp4" />
            </video>
            <div style={{
              padding: '0.85rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(26,16,40,0.9)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Interactive Experiences
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#7A7A95', fontFamily: 'var(--font-display)' }}>
                XRI Showreel
              </span>
            </div>
          </div>

        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', animation: 'bounce 2s ease infinite', zIndex: 2 }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7A7A95', fontFamily: 'var(--font-display)' }}>Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
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

      <section className="section-services" style={{ position: 'relative' }}>
        <HorizontalScrollServices />
      </section>

      <section className="section-howitworks" style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)', maxWidth: '1300px', margin: '0 auto' }}>
        <ScrollReveal direction="up">
          <div className="section-label" style={{ textAlign: 'center' }}>How It Works</div>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3.5rem', color: '#FFFFFF' }}>From Idea to <span className="gradient-text">Reality</span> in 3 Steps</h2>
        </ScrollReveal>
        <div className="grid-3-col" style={{ position: 'relative' }}>
          {[
            { step: '01', title: 'Tell Us Your Idea', desc: 'Share your vision with us. We listen, understand, and plan together.', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
            { step: '02', title: 'We Build It', desc: 'Our team designs, develops, and tests your experience until it is perfect.', icon: 'M12 3v18M3 12h18M5.63 5.63l12.74 12.74M18.37 5.63L5.63 18.37' },
            { step: '03', title: 'Your Audience Is Amazed', desc: 'We deploy your experience and your brand stands out.', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8' },
          ].map((item, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.15}>
              <div style={{
                background: 'rgba(113,82,156,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(192,132,252,0.3)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(192,132,252,0.08)',
                  border: '1px solid rgba(192,132,252,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                </div>

                {/* Step number */}
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.7rem',
                  color: '#C084FC',
                  letterSpacing: '0.1em',
                  marginBottom: '0.75rem',
                }}>STEP {item.step}</span>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: '#FFFFFF',
                }}>{item.title}</h3>

                <p style={{
                  color: '#B0B0C5',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  flex: 1,
                }}>{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section section-portfolio">
        <Parallax speed={-0.1}>
          <ScrollReveal direction="right"><WordReveal className="section-label">Our Work</WordReveal></ScrollReveal>
          <ScrollReveal direction="right" delay={0.1}><WordReveal className="section-title" delay={0.1}>Featured Projects</WordReveal></ScrollReveal>
          <ScrollReveal direction="right" delay={0.2}><WordReveal className="section-subtitle" delay={0.2}>{"A glimpse into the immersive experiences we have created for brands and events."}</WordReveal></ScrollReveal>
        </Parallax>
        <div className="portfolio-grid">
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.08}>
              <div className="portfolio-card">
                <div className="card-image">
                  <Parallax speed={0.15}><img src={p.thumbnail} alt={p.title} loading="lazy" /></Parallax>
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

      <section className="section-logos" style={{ padding: '3.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Trusted by leading brands
        </p>
        <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'center', animation: 'marquee 30s linear infinite', width: 'max-content', marginBottom: '2rem' }}>
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
                  height: 'auto', maxHeight: '70px', maxWidth: '160px', objectFit: 'contain',
                  filter: 'none', opacity: 0.7,
                  transition: 'all 0.3s ease', cursor: 'default', userSelect: 'none',
                }}
                onMouseEnter={e => { e.target.style.opacity = '1'; e.target.style.transform = 'scale(1.1)' }}
                onMouseLeave={e => { e.target.style.opacity = '0.7'; e.target.style.transform = 'scale(1)' }}
              />
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'center', animation: 'marqueeReverse 35s linear infinite', width: 'max-content' }}>
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
                  height: 'auto', maxHeight: '70px', maxWidth: '160px', objectFit: 'contain',
                  filter: 'none', opacity: 0.7,
                  transition: 'all 0.3s ease', cursor: 'default', userSelect: 'none',
                }}
                onMouseEnter={e => { e.target.style.opacity = '1'; e.target.style.transform = 'scale(1.1)' }}
                onMouseLeave={e => { e.target.style.opacity = '0.7'; e.target.style.transform = 'scale(1)' }}
              />
            ))
          )}
        </div>
      </section>




      <section className="cta-section section-cta">
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
