import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { parseBody } from '@/lib/blog-body'
import { ScrollReveal } from '@/components/ScrollReveal'
import BlogShareButtons from './BlogShareButtons'
import TableOfContents from './TableOfContents'
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

  const blocks = parseBody(post.body || post.excerpt)
  const tocSections = blocks.filter(b => b.heading)

  return (
    <main>
      <div className="page-header" style={{ textAlign: 'left', paddingBottom: '0' }}>
        <ScrollReveal direction="up">
          <div className="section-label">
            <Link href="/blog" style={{ color: 'inherit' }}>Blog</Link> / {post.category}
          </div>

          <div className="blog-detail-hero">
            <div>
              <h1 style={{ margin: 0 }}>{post.title}</h1>
            </div>
            {post.image && (
              <div className="blog-detail-hero-image">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={640}
                  height={480}
                  quality={80}
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            )}
          </div>

          <div className="blog-detail-author">
            <Image src="/logo.png" alt="" width={36} height={36} style={{ objectFit: 'contain' }} />
            <span><strong style={{ color: 'var(--text-primary)' }}>XR Interactive</strong> {' '}
              | Last updated on {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </ScrollReveal>
      </div>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="blog-detail-layout" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <ScrollReveal direction="left">
            <aside className="blog-detail-sidebar">
              <div>
                <div className="blog-toc-label">Share this Article</div>
                <BlogShareButtons title={post.title} />
              </div>
              <TableOfContents sections={tocSections} />
            </aside>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.05}>
            <div className="blog-detail-content">
              {blocks.map((block, i) => (
                <div key={block.id || i}>
                  {block.heading && <h2 id={block.id}>{block.heading}</h2>}
                  {block.paragraphs.map((p, j) =>
                    p.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element -- content images have no fixed dimensions to give next/image
                      <img key={j} src={p.url} alt={p.alt} className="blog-detail-inline-image" />
                    ) : (
                      <p key={j}>{p.content}</p>
                    )
                  )}
                </div>
              ))}

              <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
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
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
