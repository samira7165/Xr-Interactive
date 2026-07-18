'use client'

import { useActionState } from 'react'
import { updateProfile } from './actions'
import ImageUploader from '../ImageUploader'

export default function SettingsForm({ initialName, initialImage }) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined)

  return (
    <form action={formAction} className="admin-card" style={{ maxWidth: '480px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1.25rem' }}>Edit Profile</h3>

      <ImageUploader name="image" defaultValue={initialImage} label="Profile Picture" />

      <div className="admin-field">
        <label className="admin-label">Display Name</label>
        <input className="admin-input" name="name" defaultValue={initialName || ''} placeholder="Your name" />
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: '1.5rem 0 1.25rem' }}>Change Password</h3>
      <div className="admin-field">
        <label className="admin-label">Current Password</label>
        <input className="admin-input" type="password" name="currentPassword" placeholder="Only needed if setting a new password" />
      </div>
      <div className="admin-field">
        <label className="admin-label">New Password</label>
        <input className="admin-input" type="password" name="newPassword" placeholder="Leave blank to keep current password" />
      </div>

      {state?.error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{state.error}</p>}
      {state?.success && <p style={{ color: '#34D399', fontSize: '0.85rem', marginBottom: '1rem' }}>Saved successfully.</p>}

      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
