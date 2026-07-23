import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ScrollReveal } from '@/components/ScrollReveal'
import ShareButtons from '../../careers/ShareButtons'
import CommentForm from './CommentForm'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  if (!post || !post.published) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | XR Interactive Blog`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  }
}

export default async function BlogPostDetail({ params }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })

  if (!post || !post.published) notFound()

  const comments = await prisma.comment.findMany({
    where: { postId: post.id, approved: true },
    orderBy: { createdAt: 'desc' },
  })

  const paragraphs = (post.body || post.excerpt).split(/\n{2,}/).filter(Boolean)

  return (
    <main>
      <div className="page-header" style={{ paddingBottom: '1.5rem' }}>
        <ScrollReveal direction="up">
          <div className="section-label">
            <Link href="/blog" style={{ color: 'inherit' }}>Blog</Link> / {post.category}
          </div>
          <h1 style={{ marginBottom: '1rem' }}>{post.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <ShareButtons title={post.title} />
          </div>
        </ScrollReveal>
      </div>

      {post.image && (
        <section className="section" style={{ paddingTop: 0, paddingBottom: '1rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Image
              src={post.image}
              alt={post.title}
              width={900}
              height={400}
              quality={80}
              priority
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'cover', maxHeight: '420px' }}
            />
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <ScrollReveal direction="up">
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.05}>
            <h2 className="section-title" style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h2>

            {comments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{
                    padding: '1.25rem', borderRadius: '12px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{comment.body}</p>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Leave a Comment</h3>
            <CommentForm slug={post.slug} />
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
