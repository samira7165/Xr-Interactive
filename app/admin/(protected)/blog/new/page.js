import BlogPostForm from '../BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>New Blog Post</h1>
      <BlogPostForm />
    </div>
  )
}
