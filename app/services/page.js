import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

export const metadata = {
  title: 'Services',
  description: 'End-to-end interactive solutions from concept to deployment — AR/VR, game development, event activation, web & app solutions, AI, and IoT.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Services | XR Interactive',
    description: 'End-to-end interactive solutions from concept to deployment — AR/VR, game development, event activation, web & app solutions, AI, and IoT.',
    url: '/services',
  },
}

const services = [
  {
    title: 'AR/VR & Mixed Reality',
    desc: 'Immersive AR and VR experiences that transport your audience into new dimensions — from headset experiences to mobile AR filters.',
    icon: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z',
    link: '/portfolio',
    linkText: 'View projects',
    features: ['VR Game Development', 'AR Filters & Effects', 'WebAR Experiences', 'Mixed Reality Installations', '360° Virtual Tours', 'Spatial Computing'],
  },
  {
    title: 'Game Design & Development',
    desc: 'Engaging branded games, hyper-casual mobile games, and interactive experiences that drive real engagement and keep players coming back.',
    icon: 'M6 12h4l2 8 2-16 2 8h4',
    link: '/portfolio',
    linkText: 'View projects',
    features: ['Mobile Game Development', 'Branded Games', 'Hyper-Casual Games', 'Playable Ads', 'In-App Games', 'Game UI/UX Design'],
  },
  {
    title: 'Event Activation',
    desc: 'VR gaming zones, AR photo booths, and interactive installations that make your events impossible to forget.',
    icon: 'M17 3a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h10zM12 18h.01',
    link: '/portfolio',
    linkText: 'View projects',
    features: ['VR Gaming Zones', 'AR Photo Experiences', 'Interactive Installations', 'Digital Activations', 'Brand Experience Design', 'On-ground Tech Setup'],
  },
  {
    title: 'Web & App Solutions',
    desc: 'Custom websites and applications built with cutting-edge technology for modern, performant digital products.',
    icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    link: '/portfolio',
    linkText: 'View projects',
    features: ['Web Application Development', 'Mobile App Development', 'E-commerce Solutions', 'UI/UX Design', 'CMS Development', 'API Integration'],
  },
  {
    title: 'AI & Generative Solutions',
    desc: 'AI-powered tools and generative experiences for chatbots, content generation, and intelligent automation.',
    icon: 'M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM8 14v4a2 2 0 002 2h4a2 2 0 002-2v-4',
    link: '/contact',
    linkText: 'Learn more',
    features: ['Generative AI Campaigns', 'AI Chatbots', 'AI-Powered Filters', 'Machine Learning Solutions', 'Content Generation', 'Intelligent Automation'],
  },
  {
    title: 'IoT Solutions',
    desc: 'Connected devices and smart systems that bridge physical spaces with digital intelligence.',
    icon: 'M2 16.1A5 5 0 0115.9 6M2 12.05A9 9 0 0119.95 6M2 8a13 13 0 0118 0M5 19.5a.5.5 0 110-1 .5.5 0 010 1z',
    link: '/contact',
    linkText: 'Learn more',
    features: ['Smart Device Integration', 'Sensor Networks', 'Real-time Monitoring', 'Automation Systems', 'Data Analytics Dashboards', 'Hardware Prototyping'],
  },
]

export default function Services() {
  return (
    <main>
      <div className="page-header">
        <ScrollReveal direction="up">
          <div className="section-label">Services</div>
          <h1>What We <span className="gradient-text">Build</span></h1>
          <p>End-to-end interactive solutions from concept to deployment.</p>
        </ScrollReveal>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }} className="services-grid-page">
          {services.map((service, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <div className="service-card">
                <div className="card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={service.icon}/></svg>
                </div>

                <h3>{service.title}</h3>

                <p>{service.desc}</p>

                {/* Feature pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', flex: 1 }}>
                  {service.features.map((f, j) => (
                    <span key={j} style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '6px',
                      background: 'rgba(192,132,252,0.08)',
                      fontSize: '0.72rem',
                      color: '#B0B0C5',
                      border: '1px solid rgba(192,132,252,0.12)',
                    }}>{f}</span>
                  ))}
                </div>

                <Link href={service.link} className="card-link">
                  {service.linkText}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* YouTube CTA */}
      <section className="section">
        <ScrollReveal direction="up">
          <div style={{
            background: 'linear-gradient(135deg, rgba(113,82,156,0.1) 0%, rgba(192,132,252,0.05) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            backdropFilter: 'blur(20px)',
          }} className="youtube-cta-grid">
            <div>
              <span style={{
                display: 'inline-block',
                padding: '0.3rem 0.8rem',
                borderRadius: '50px',
                background: 'rgba(192,132,252,0.1)',
                border: '1px solid rgba(192,132,252,0.2)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#C084FC',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.25rem',
              }}>
                YouTube
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                fontWeight: 700,
                marginBottom: '1rem',
                color: '#FFFFFF',
                lineHeight: 1.3,
              }}>
                See More Of Our Work
              </h2>
              <p style={{
                color: '#B0B0C5',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
              }}>
                Explore our full portfolio of VR experiences, AR campaigns, event activations,
                and behind-the-scenes footage on our YouTube channel.
              </p>
              <a
                href="https://youtube.com/@xrinteractive?si=7uPW5Jv7GAp7Hymq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#0A0A12"/></svg>
                Visit Our YouTube Channel
              </a>
            </div>

            <a
              href="https://youtube.com/@xrinteractive?si=7uPW5Jv7GAp7Hymq"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                aspectRatio: '16/9',
                backgroundImage: 'url(/services/games/game2.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Play button overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(255,0,0,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(255,0,0,0.3)',
                  transition: 'transform 0.3s ease',
                }} className="play-button">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="6,4 20,12 6,20" /></svg>
                </div>
              </div>
              {/* Dark overlay for readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(26,16,53,0.6) 0%, rgba(45,27,105,0.5) 100%)',
              }} />
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <ScrollReveal direction="up">
          <div style={{
            background: 'rgba(113,82,156,0.08)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            backdropFilter: 'blur(20px)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 700, marginBottom: '0.75rem', color: '#FFFFFF' }}>
              Not sure which service fits?
            </h2>
            <p style={{ color: '#B0B0C5', marginBottom: '1.5rem' }}>
              Schedule a free consultation and we will help you figure out the best approach.
            </p>
            <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Free Consultation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
