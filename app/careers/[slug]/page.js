import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ScrollReveal } from '@/components/ScrollReveal'
import ShareButtons from '../ShareButtons'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const job = await prisma.job.findUnique({ where: { slug } })
  if (!job) return {}

  return {
    title: job.title,
    description: job.description,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: {
      title: `${job.title} | XR Interactive Careers`,
      description: job.description,
      url: `/careers/${job.slug}`,
    },
  }
}

const metaFields = [
  { key: 'location', label: 'Location' },
  { key: 'type', label: 'Job Type' },
  { key: 'level', label: 'Level' },
  { key: 'compensation', label: 'Compensation' },
]

export default async function JobDetail({ params }) {
  const { slug } = await params
  const job = await prisma.job.findUnique({ where: { slug } })

  if (!job || !job.active) notFound()

  return (
    <main>
      <div className="page-header" style={{ paddingBottom: '1.5rem' }}>
        <ScrollReveal direction="up">
          <div className="section-label">
            <Link href="/careers" style={{ color: 'inherit' }}>Careers</Link>
            {job.department && <> / {job.department}</>}
          </div>
          <h1 style={{ marginBottom: '1.5rem' }}>{job.title}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            {metaFields.map(f => job[f.key] ? (
              <div key={f.key}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  {f.label}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>{job[f.key]}</div>
              </div>
            ) : null)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href={`/careers/${job.slug}/apply`} className="btn-primary">Apply Now</Link>
            <ShareButtons title={job.title} />
          </div>
        </ScrollReveal>
      </div>

      {Array.isArray(job.images) && job.images.length > 0 && (
        <section className="section" style={{ paddingTop: 0, paddingBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: job.images.length > 1 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            {job.images.map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', maxHeight: '400px' }} />
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <ScrollReveal direction="up">
            <h2 className="section-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Role Purpose</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{job.description}</p>
          </ScrollReveal>

          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
            <ScrollReveal direction="up" delay={0.05}>
              <h2 className="section-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>What {"You'll"} Do</h2>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {job.responsibilities.map((r, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{r}</li>
                ))}
              </ul>
            </ScrollReveal>
          )}

          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="section-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>What {"You'll"} Bring</h2>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{r}</li>
                ))}
              </ul>
            </ScrollReveal>
          )}
        </div>
      </section>

      <section className="cta-section">
        <ScrollReveal direction="scale">
          <div className="cta-box">
            <h2>Ready to <span className="gradient-text">Apply?</span></h2>
            <p>{"We'd"} love to hear from you.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href={`/careers/${job.slug}/apply`} className="btn-primary">Apply Now</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
