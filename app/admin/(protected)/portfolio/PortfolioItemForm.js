'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../ImageUploader'

const categories = ['VR', 'AR', 'Event', 'Campaign']

export default function PortfolioItemForm({ projectId, initialData }) {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const techStackDefault = Array.isArray(initialData?.techStack) ? initialData.techStack.join(', ') : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setErrors({})
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const url = projectId ? `/api/admin/portfolio/${projectId}` : '/api/admin/portfolio'
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.success) {
      router.push('/admin/portfolio')
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
        <label className="admin-label">Category</label>
        <select className="admin-select" name="category" defaultValue={initialData?.category || categories[0]} required>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="admin-error">{errors.category[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Description</label>
        <textarea className="admin-textarea" name="description" rows={3} defaultValue={initialData?.description} required />
        {errors.description && <p className="admin-error">{errors.description[0]}</p>}
      </div>
      <ImageUploader name="thumbnail" defaultValue={initialData?.thumbnail} label="Thumbnail" />
      {errors.thumbnail && <p className="admin-error" style={{ marginTop: '-0.75rem', marginBottom: '1.1rem' }}>{errors.thumbnail[0]}</p>}
      <div className="admin-field">
        <label className="admin-label">Tech Stack (comma-separated)</label>
        <input className="admin-input" name="techStack" defaultValue={techStackDefault} placeholder="e.g. Unity, ARKit, React" />
      </div>
      <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="featured" defaultChecked={initialData?.featured ?? false} id="featured" />
        <label htmlFor="featured" className="admin-label" style={{ marginBottom: 0 }}>Featured</label>
      </div>
      {message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
