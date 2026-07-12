'use client'
import WordReveal from '@/components/WordReveal'
import { ScrollReveal } from '@/components/ScrollReveal'
import { blogs } from '@/data'

export default function Blog() {
  return (
    <main>
      <div className="page-header">
        <ScrollReveal direction="up">
          <div className="section-label">Blog</div>
          <h1>Insights & <span className="gradient-text">Stories</span></h1>
          <p>Thoughts on immersive technology, interactive experiences, and the future of digital.</p>
        </ScrollReveal>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="blog-grid">
          {blogs.map((post, i) => (
            <ScrollReveal key={post.id} direction="up" delay={i * 0.08}>
              <article className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} loading="lazy" />
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '4px',
                      background: 'rgba(113,82,156,0.2)', color: 'var(--purple-light)',
                      fontSize: '0.72rem', fontWeight: 600, marginRight: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.03em',
                    }}>
                      {post.category}
                    </span>
                    {post.date}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    marginTop: '1rem', color: 'var(--purple-light)',
                    fontSize: '0.85rem', fontWeight: 500,
                  }}>
                    Read more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  )
}