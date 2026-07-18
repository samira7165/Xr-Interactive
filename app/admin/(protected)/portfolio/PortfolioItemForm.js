'use client'

import { useActionState } from 'react'
import ImageUploader from '../ImageUploader'

const categories = ['VR', 'AR', 'Event', 'Campaign']

export default function PortfolioItemForm({ action, initialData }) {
  const [state, formAction, pending] = useActionState(action, { errors: {} })
  const techStackDefault = Array.isArray(initialData?.techStack) ? initialData.techStack.join(', ') : ''

  return (
    <form action={formAction} className="admin-card" style={{ maxWidth: '640px' }}>
      <div className="admin-field">
        <label className="admin-label">Title</label>
        <input className="admin-input" name="title" defaultValue={initialData?.title} required />
        {state.errors?.title && <p className="admin-error">{state.errors.title[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Slug</label>
        <input className="admin-input" name="slug" defaultValue={initialData?.slug} required />
        {state.errors?.slug && <p className="admin-error">{state.errors.slug[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Category</label>
        <select className="admin-select" name="category" defaultValue={initialData?.category || categories[0]} required>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {state.errors?.category && <p className="admin-error">{state.errors.category[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Description</label>
        <textarea className="admin-textarea" name="description" rows={3} defaultValue={initialData?.description} required />
        {state.errors?.description && <p className="admin-error">{state.errors.description[0]}</p>}
      </div>
      <ImageUploader name="thumbnail" defaultValue={initialData?.thumbnail} label="Thumbnail" />
      {state.errors?.thumbnail && <p className="admin-error" style={{ marginTop: '-0.75rem', marginBottom: '1.1rem' }}>{state.errors.thumbnail[0]}</p>}
      <div className="admin-field">
        <label className="admin-label">Tech Stack (comma-separated)</label>
        <input className="admin-input" name="techStack" defaultValue={techStackDefault} placeholder="e.g. Unity, ARKit, React" />
      </div>
      <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="featured" defaultChecked={initialData?.featured ?? false} id="featured" />
        <label htmlFor="featured" className="admin-label" style={{ marginBottom: 0 }}>Featured</label>
      </div>
      {state.message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{state.message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
