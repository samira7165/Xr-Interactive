'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../ImageUploader'

export default function TeamMemberForm({ action, initialData }) {
  const [state, formAction, pending] = useActionState(action, { errors: {} })
  const router = useRouter()
  const socialLinks = initialData?.socialLinks || {}

  useEffect(() => {
    if (state.success) router.push('/admin/team')
  }, [state.success, router])

  return (
    <form action={formAction} className="admin-card" style={{ maxWidth: '640px' }}>
      <ImageUploader name="image" defaultValue={initialData?.image} label="Photo" />
      {state.errors?.image && <p className="admin-error" style={{ marginTop: '-0.75rem', marginBottom: '1.1rem' }}>{state.errors.image[0]}</p>}

      <div className="admin-field">
        <label className="admin-label">Name</label>
        <input className="admin-input" name="name" defaultValue={initialData?.name} required />
        {state.errors?.name && <p className="admin-error">{state.errors.name[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Role</label>
        <input className="admin-input" name="role" defaultValue={initialData?.role} placeholder="e.g. Creative Director" required />
        {state.errors?.role && <p className="admin-error">{state.errors.role[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Bio</label>
        <textarea className="admin-textarea" name="bio" rows={3} defaultValue={initialData?.bio} required />
        {state.errors?.bio && <p className="admin-error">{state.errors.bio[0]}</p>}
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
      {state.message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{state.message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
