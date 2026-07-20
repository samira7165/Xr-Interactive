import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogPostForm from '../../BlogPostForm'

export default async function EditBlogPostPage({ params }) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id: Number(id) } })

  if (!post) notFound()

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Blog Post</h1>
      <BlogPostForm postId={post.id} initialData={post} />
    </div>
  )
}
