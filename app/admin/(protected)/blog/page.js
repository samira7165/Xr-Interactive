import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deletePost } from './actions'
import DeletePostButton from './DeletePostButton'

export default async function AdminBlogList() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Blog Posts</h1>
        <Link href="/admin/blog/new" className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>New Post</Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>{post.published ? 'Yes' : 'No'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/blog/${post.id}/edit`} className="admin-btn" style={{ textDecoration: 'none' }}>Edit</Link>
                  <DeletePostButton onDelete={deletePost.bind(null, post.id)} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--text-muted)' }}>No blog posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
