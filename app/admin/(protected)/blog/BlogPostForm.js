'use client'

import { useActionState } from 'react'
import ImageUploader from '../ImageUploader'

export default function BlogPostForm({ action, initialData }) {
  const [state, formAction, pending] = useActionState(action, { errors: {} })

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
        <label className="admin-label">Excerpt</label>
        <textarea className="admin-textarea" name="excerpt" rows={2} defaultValue={initialData?.excerpt} required />
        {state.errors?.excerpt && <p className="admin-error">{state.errors.excerpt[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Body (optional)</label>
        <textarea className="admin-textarea" name="body" rows={6} defaultValue={initialData?.body} />
      </div>
      <div className="admin-field">
        <label className="admin-label">Category</label>
        <input className="admin-input" name="category" defaultValue={initialData?.category} placeholder="e.g. AR/VR, Events, Technology" required />
        {state.errors?.category && <p className="admin-error">{state.errors.category[0]}</p>}
      </div>
      <ImageUploader name="image" defaultValue={initialData?.image} label="Image" />
      {state.errors?.image && <p className="admin-error" style={{ marginTop: '-0.75rem', marginBottom: '1.1rem' }}>{state.errors.image[0]}</p>}
      <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="published" defaultChecked={initialData?.published ?? true} id="published" />
        <label htmlFor="published" className="admin-label" style={{ marginBottom: 0 }}>Published</label>
      </div>
      {state.message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{state.message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
