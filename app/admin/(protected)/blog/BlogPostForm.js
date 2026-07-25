'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader, { uploadFile } from '../ImageUploader'

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BlogPostForm({ postId, initialData }) {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  // Editing an existing post already has a real slug — don't let a title
  // edit silently change a live post's URL. Auto-derive only for new posts,
  // and stop as soon as the user types into the slug field themselves.
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug))

  const [body, setBody] = useState(initialData?.body || '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const bodyRef = useRef(null)

  function handleTitleChange(e) {
    const value = e.target.value
    setTitle(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  function handleSlugChange(e) {
    setSlug(e.target.value)
    setSlugEdited(true)
  }

  function insertIntoBody(text) {
    const el = bodyRef.current
    const start = el?.selectionStart ?? body.length
    const end = el?.selectionEnd ?? body.length
    const before = body.slice(0, start)
    const after = body.slice(end)
    // Image lines are parsed on their own line (see blog/[slug]/page.js), so
    // make sure the insertion starts on a fresh line.
    const prefix = before && !before.endsWith('\n') ? '\n' : ''
    const insertion = `${prefix}${text}\n`
    const newValue = before + insertion + after
    setBody(newValue)

    const cursor = (before + insertion).length
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(cursor, cursor)
    })
  }

  async function handleInsertImage(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setImageUploading(true)
    setImageError('')
    try {
      const url = await uploadFile(file)
      insertIntoBody(`![](${url})`)
    } catch (err) {
      setImageError(err.message)
    } finally {
      setImageUploading(false)
    }
  }

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
        <label className="admin-label" htmlFor="post-title">Title</label>
        <input id="post-title" className="admin-input" name="title" value={title} onChange={handleTitleChange} required />
        {errors.title && <p className="admin-error">{errors.title[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label" htmlFor="post-slug">Slug</label>
        <input id="post-slug" className="admin-input" name="slug" value={slug} onChange={handleSlugChange} required />
        {errors.slug && <p className="admin-error">{errors.slug[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label" htmlFor="post-excerpt">Excerpt</label>
        <textarea id="post-excerpt" className="admin-textarea" name="excerpt" rows={2} defaultValue={initialData?.excerpt} required />
        {errors.excerpt && <p className="admin-error">{errors.excerpt[0]}</p>}
      </div>
      <div className="admin-field">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <label className="admin-label" htmlFor="post-body" style={{ marginBottom: 0 }}>Body (optional)</label>
          <label className="admin-btn" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem', cursor: 'pointer' }}>
            {imageUploading ? 'Uploading...' : 'Insert Image'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              disabled={imageUploading}
              onChange={handleInsertImage}
            />
          </label>
        </div>
        <textarea
          ref={bodyRef}
          id="post-body"
          className="admin-textarea"
          name="body"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        />
        {imageError && <p className="admin-error">{imageError}</p>}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>
          Start a line with <code>## </code> to begin a new section (e.g. <code>## Project Goal</code>) — this
          also builds the &ldquo;In this Article&rdquo; table of contents on the post page. Leave a blank line
          between paragraphs. Use &ldquo;Insert Image&rdquo; to drop a picture in at the cursor — you can add as
          many as you like.
        </p>
      </div>
      <div className="admin-field">
        <label className="admin-label" htmlFor="post-category">Category</label>
        <input id="post-category" className="admin-input" name="category" defaultValue={initialData?.category} placeholder="e.g. AR/VR, Events, Technology" required />
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
