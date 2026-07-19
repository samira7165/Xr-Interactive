'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../ImageUploader'

export default function TeamMemberForm({ memberId, initialData }) {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const socialLinks = initialData?.socialLinks || {}

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setErrors({})
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const url = memberId ? `/api/admin/team/${memberId}` : '/api/admin/team'
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.success) {
      router.push('/admin/team')
      return
    }

    setErrors(data.errors || {})
    setMessage(data.message || 'Something went wrong. Please try again.')
    setPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: '640px' }}>
      <ImageUploader name="image" defaultValue={initialData?.image} label="Photo" />
      {errors.image && <p className="admin-error" style={{ marginTop: '-0.75rem', marginBottom: '1.1rem' }}>{errors.image[0]}</p>}

      <div className="admin-field">
        <label className="admin-label">Name</label>
        <input className="admin-input" name="name" defaultValue={initialData?.name} required />
        {errors.name && <p className="admin-error">{errors.name[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Role</label>
        <input className="admin-input" name="role" defaultValue={initialData?.role} placeholder="e.g. Creative Director" required />
        {errors.role && <p className="admin-error">{errors.role[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Bio</label>
        <textarea className="admin-textarea" name="bio" rows={3} defaultValue={initialData?.bio} required />
        {errors.bio && <p className="admin-error">{errors.bio[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Twitter URL (optional)</label>
        <input className="admin-input" name="twitter" defaultValue={socialLinks.twitter || ''} placeholder="https://twitter.com/..." />
      </div>
      <div className="admin-field">
        <label className="admin-label">LinkedIn URL (optional)</label>
        <input className="admin-input" name="linkedin" defaultValue={socialLinks.linkedin || ''} placeholder="https://linkedin.com/in/..." />
      </div>
      <div className="admin-field">
        <label className="admin-label">Display Order</label>
        <input className="admin-input" type="number" name="order" defaultValue={initialData?.order ?? 0} />
      </div>
      {message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
