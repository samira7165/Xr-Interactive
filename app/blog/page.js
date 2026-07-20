import Image from 'next/image'
import { ScrollReveal } from '@/components/ScrollReveal'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Blog',
  description: 'Insights on immersive technology, AR/VR, and interactive experiences.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog | XR Interactive',
    description: 'Insights on immersive technology, AR/VR, and interactive experiences.',
    url: '/blog',
  },
}

export default async function Blog() {
  const blogs = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

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
        {blogs.length === 0 ? (
          <ScrollReveal direction="up">
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'rgba(113,82,156,0.05)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                Coming soon — we&rsquo;re working on our first posts.
              </p>
            </div>
          </ScrollReveal>
        ) : (
        <div className="blog-grid">
          {blogs.map((post, i) => (
            <ScrollReveal key={post.id} direction="up" delay={i * 0.08}>
              <article className="blog-card">
                <div className="blog-image">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={200}
                      quality={80}
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 400px"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
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
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
        )}
      </section>
    </main>
  )
}