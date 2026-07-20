'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../ImageUploader'

export default function BlogPostForm({ postId, initialData }) {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setErrors({})
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const url = postId ? `/api/admin/blog/${postId}` : '/api/admin/blog'
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.success) {
      router.push('/admin/blog')
      return
    }

    setErrors(data.errors || {})
    setMessage(data.message || 'Something went wrong. Please try again.')
    setPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: '640px' }}>
      <div className="admin-field">
        <label className="admin-label">Title</label>
        <input className="admin-input" name="title" defaultValue={initialData?.title} required />
        {errors.title && <p className="admin-error">{errors.title[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Slug</label>
        <input className="admin-input" name="slug" defaultValue={initialData?.slug} required />
        {errors.slug && <p className="admin-error">{errors.slug[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Excerpt</label>
        <textarea className="admin-textarea" name="excerpt" rows={2} defaultValue={initialData?.excerpt} required />
        {errors.excerpt && <p className="admin-error">{errors.excerpt[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Body (optional)</label>
        <textarea className="admin-textarea" name="body" rows={6} defaultValue={initialData?.body} />
      </div>
      <div className="admin-field">
        <label className="admin-label">Category</label>
        <input className="admin-input" name="category" defaultValue={initialData?.category} placeholder="e.g. AR/VR, Events, Technology" required />
        {errors.category && <p className="admin-error">{errors.category[0]}</p>}
      </div>
      <ImageUploader name="image" defaultValue={initialData?.image} label="Image" />
      {errors.image && <p className="admin-error" style={{ marginTop: '-0.75rem', marginBottom: '1.1rem' }}>{errors.image[0]}</p>}
      <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="published" defaultChecked={initialData?.published ?? true} id="published" />
        <label htmlFor="published" className="admin-label" style={{ marginBottom: 0 }}>Published</label>
      </div>
      {message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
