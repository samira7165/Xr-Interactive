'use client'
import { useState } from 'react'
import useInView from '@/components/useInView'
import { portfolio } from '@/data'

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} className={`fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const categories = ['All', 'VR', 'AR', 'Event', 'Campaign']

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? portfolio : portfolio.filter(p => p.category === active)

  return (
    <main>
      <div className="page-header">
        <div className="section-label">Portfolio</div>
        <h1>Our <span className="gradient-text">Work</span></h1>
        <p>Explore the immersive experiences {"we have"} built for brands, events, and campaigns.</p>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="portfolio-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${active === cat ? 'active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={i * 60}>
              <div className="portfolio-card">
                <div className="card-image">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <span className="card-category">{p.category}</span>
                </div>
                <div className="card-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No projects found in this category.
          </div>
        )}
      </section>
    </main>
  )
}
