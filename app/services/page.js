'use client'
import Link from 'next/link'

import WordReveal from '@/components/WordReveal'
import { ScrollReveal, Parallax } from '@/components/ScrollReveal'
import { services } from '@/data'

function ServiceSection({ service, index }) {
  const isReversed = index % 2 !== 0
  return (
    <ScrollReveal direction={isReversed ? 'right' : 'left'} delay={0.1}>
      <div style={{
        display: 'grid',
        
        gap: '3rem',
        alignItems: 'center',
        padding: '3rem 0',
        borderBottom: '1px solid var(--border)',
        direction: isReversed ? 'rtl' : 'ltr',
      }}>
        <div style={{ direction: 'ltr' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{service.icon}</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
            fontWeight: 700,
            marginBottom: '1rem',
          }}>
            {service.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {service.description}
          </p>
          <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex' }}>
            Discuss Your Project
          </Link>
        </div>
        <div style={{
          direction: 'ltr',
          display: 'grid',
          
          gap: '0.75rem',
        }}>
          {service.features.map((f, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.05}>
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                background: 'rgba(22,22,42,0.95)',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)',
              }}>
                <span style={{ color: 'var(--purple-light)', fontSize: '0.7rem' }}>◆</span>
                {f}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function Services() {
  return (
    <main>
      <div className="page-header">
        <ScrollReveal direction="up">
          <div className="section-label">Services</div>
          <h1>What We <span className="gradient-text">Build</span></h1>
          <p>End-to-end interactive solutions from concept to deployment, powered by cutting-edge technology.</p>
        </ScrollReveal>
      </div>

      <section className="section">
        {services.map((s, i) => (
          <ServiceSection key={s.id} service={s} index={i} />
        ))}
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <ScrollReveal direction="scale">
          <div style={{
            background: 'rgba(22,22,42,0.95)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Not sure which service fits your project?
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Schedule a free consultation and we'll help you figure out the best approach for your goals.
              </p>
            </div>
            <Link href="/contact" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Free Consultation
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}