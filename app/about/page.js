'use client'
import Link from 'next/link'

import WordReveal from '@/components/WordReveal'
import { ScrollReveal, Parallax } from '@/components/ScrollReveal'
import { team } from '@/data'

const values = [
  { icon: '🚀', title: 'Innovation First', desc: 'We stay ahead of the curve, constantly exploring new technologies to deliver experiences that push boundaries.' },
  { icon: '🤝', title: 'Client-Centered', desc: 'Your goals drive our process. We collaborate closely to ensure every solution aligns with your vision and delivers results.' },
  { icon: '🎯', title: 'Quality Obsessed', desc: 'From concept to deployment, we maintain the highest standards of quality in design, development, and delivery.' },
  { icon: '🌏', title: 'Impact Driven', desc: 'We build solutions that create real impact — memorable experiences that engage audiences and drive measurable outcomes.' },
]

export default function About() {
  return (
    <main>
      <div className="page-header">
        <ScrollReveal direction="up">
          <div className="section-label">About Us</div>
          <h1>We Create <span className="gradient-text">Interactive</span> Content</h1>
          <p>A dynamic, forward-thinking IT company specializing in immersive technologies.</p>
        </ScrollReveal>
      </div>

      <section className="section">
        <div className="about-hero">
          <ScrollReveal direction="left">
            <div>
              <h2 className="section-title">Our Story</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                XR Interactive is a creative technology studio based in Dhaka, Bangladesh.
                We specialize in building immersive experiences using Virtual Reality, Augmented
                Reality, Game Development, Artificial Intelligence, IoT, and Web Solutions.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                With over 100 projects delivered, {"we have"} helped brands transform their marketing
                campaigns, events, and digital presence through cutting-edge interactive solutions.
                From VR gaming zones at Boi Mela to branded AR filters reaching millions, we bring
                technology to life in ways that matter.
              </p>
              <Link href="/contact" className="btn-primary">
                Work With Us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.2}>
            <Parallax speed={-0.1}>
              <div className="about-image">
                <img
                  src="https://xri.com.bd/frontend/images/components/about-1.png"
                  alt="XR Interactive team"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Parallax>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <ScrollReveal direction="left">
          <WordReveal className="section-label">Our Values</WordReveal>
        </ScrollReveal>
        <ScrollReveal direction="left" delay={0.1}>
          <WordReveal className="section-title" delay={0.1}>What Drives Us</WordReveal>
        </ScrollReveal>
        <div className="values-grid">
          {values.map((v, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <div className="value-card">
                <div className="icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section">
        <ScrollReveal direction="right">
          <WordReveal className="section-label">The Team</WordReveal>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.1}>
          <WordReveal className="section-title" delay={0.1}>Meet Our Crew</WordReveal>
        </ScrollReveal>
        <div className="team-grid">
          {team.map((t, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <div className="team-card">
                <div className="team-avatar">{t.initials}</div>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <ScrollReveal direction="scale">
          <div className="cta-box">
            <WordReveal><h2>Want to Join Our Team?</h2></WordReveal>
            <WordReveal delay={0.2}>{"We are"} always looking for talented people who love building interactive experiences.</WordReveal>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/contact" className="btn-primary">Get in Touch</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}