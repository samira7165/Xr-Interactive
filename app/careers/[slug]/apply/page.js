import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ScrollReveal } from '@/components/ScrollReveal'
import ApplicationForm from './ApplicationForm'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const job = await prisma.job.findUnique({ where: { slug } })
  if (!job) return {}

  return {
    title: `Apply — ${job.title}`,
    alternates: { canonical: `/careers/${job.slug}/apply` },
  }
}

export default async function ApplyPage({ params }) {
  const { slug } = await params
  const job = await prisma.job.findUnique({ where: { slug } })

  if (!job || !job.active) notFound()

  return (
    <main>
      <div className="page-header" style={{ paddingBottom: '1.5rem' }}>
        <ScrollReveal direction="up">
          <div className="section-label">
            <Link href={`/careers/${job.slug}`} style={{ color: 'inherit' }}>{job.title}</Link> / Apply
          </div>
          <h1>Apply for <span className="gradient-text">{job.title}</span></h1>
          <p>{job.location} · {job.type}</p>
        </ScrollReveal>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <ScrollReveal direction="up">
            <ApplicationForm jobId={job.id} />
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
