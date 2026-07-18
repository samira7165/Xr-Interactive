import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Careers',
  description: 'Join the team at XR Interactive — open roles building AR, VR, games, and immersive experiences in Dhaka, Bangladesh.',
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: 'Careers | XR Interactive',
    description: 'Join the team at XR Interactive — open roles building AR, VR, games, and immersive experiences in Dhaka, Bangladesh.',
    url: '/careers',
  },
}

export default async function Careers() {
  const jobs = await prisma.job.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } })

  return (
    <main>
      <div className="page-header">
        <ScrollReveal direction="up">
          <div className="section-label">Careers</div>
          <h1>Careers at <span className="gradient-text">XR Interactive</span></h1>
          <p>We believe the next generation of digital experiences will be created by those who dare to imagine beyond the screen. At XR Interactive, we are a team of innovators, storytellers, and technologists transforming ideas into immersive realities through XR, interactive design, and cutting-edge technology.</p>
        </ScrollReveal>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        {jobs.length === 0 ? (
          <ScrollReveal direction="up">
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'rgba(113,82,156,0.05)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
            }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {"We don't"} have any open roles right now, but {"we're"} always happy to hear from talented people.
              </p>
              <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Get in Touch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
            {jobs.map((job, i) => (
              <ScrollReveal key={job.id} direction="up" delay={i * 0.08}>
                <Link href={`/careers/${job.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{
                    background: 'rgba(113,82,156,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding: '2rem',
                    transition: 'border-color 0.2s',
                  }} className="job-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                          {job.title}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {job.department && <span>{job.department}</span>}
                          {job.department && <span>•</span>}
                          <span>{job.location}</span>
                          <span>•</span>
                          <span style={{
                            padding: '0.15rem 0.6rem', borderRadius: '4px',
                            background: 'rgba(192,132,252,0.12)', color: '#C084FC', fontWeight: 600,
                          }}>{job.type}</span>
                        </div>
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        color: '#C084FC', fontSize: '0.85rem', fontWeight: 500, flexShrink: 0,
                      }}>
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
      <style>{`.job-card:hover { border-color: rgba(192,132,252,0.3) !important; }`}</style>
    </main>
  )
}
