import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { approveComment, deleteComment } from './actions'
import CommentActions from './CommentActions'

export default async function AdminBlogCommentsList() {
  const comments = await prisma.comment.findMany({
    orderBy: [{ approved: 'asc' }, { createdAt: 'desc' }],
    include: { post: { select: { title: true, slug: true } } },
  })

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Blog Comments</h1>
        <Link href="/admin/blog" className="admin-btn" style={{ textDecoration: 'none' }}>Back to Posts</Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Post</th>
              <th>Name</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id}>
                <td>
                  <Link href={`/blog/${comment.post.slug}`} target="_blank" style={{ color: 'var(--purple-light)' }}>
                    {comment.post.title}
                  </Link>
                </td>
                <td>{comment.name}</td>
                <td style={{ maxWidth: '320px', whiteSpace: 'pre-wrap' }}>{comment.body}</td>
                <td>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.55rem', borderRadius: '999px',
                    color: comment.approved ? '#4ade80' : '#facc15',
                    background: comment.approved ? 'rgba(74,222,128,0.12)' : 'rgba(250,204,21,0.12)',
                  }}>
                    {comment.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <CommentActions
                    approved={comment.approved}
                    onApprove={approveComment.bind(null, comment.id)}
                    onDelete={deleteComment.bind(null, comment.id)}
                  />
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr><td colSpan={6} style={{ color: 'var(--text-muted)' }}>No comments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
