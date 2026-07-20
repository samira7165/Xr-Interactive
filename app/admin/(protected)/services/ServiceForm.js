'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ServiceIcon from '@/components/ServiceIcon'
import MultiImageUploader from '../MultiImageUploader'

export default function ServiceForm({ serviceId, initialData }) {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const featuresDefault = Array.isArray(initialData?.features) ? initialData.features.join('\n') : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setErrors({})
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const url = serviceId ? `/api/admin/services/${serviceId}` : '/api/admin/services'
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.success) {
      router.push('/admin/services')
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
        <label className="admin-label">Description</label>
        <textarea className="admin-textarea" name="description" rows={3} defaultValue={initialData?.description} required />
        {errors.description && <p className="admin-error">{errors.description[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Icon (lucide-react icon name, e.g. Glasses, Gamepad2, Globe)</label>
        <input className="admin-input" name="icon" defaultValue={initialData?.icon} required />
        {initialData?.icon && <div style={{ marginTop: '0.5rem' }}><ServiceIcon name={initialData.icon} size={24} color="#C084FC" /></div>}
        {errors.icon && <p className="admin-error">{errors.icon[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Tag (short label shown on the homepage slideshow, e.g. "XR")</label>
        <input className="admin-input" name="tag" defaultValue={initialData?.tag || ''} />
      </div>
      <div className="admin-field">
        <label className="admin-label">Gradient (CSS background value, optional)</label>
        <input className="admin-input" name="gradient" defaultValue={initialData?.gradient || ''} placeholder="linear-gradient(135deg, #2D1B69 0%, #1A1035 100%)" />
      </div>
      <div className="admin-field">
        <label className="admin-label">Features (one per line)</label>
        <textarea className="admin-textarea" name="features" rows={4} defaultValue={featuresDefault} placeholder={'VR Games\nAR Filters\nWebAR'} />
      </div>
      <MultiImageUploader name="images" defaultValue={initialData?.images} label="Slideshow Images (shown in the homepage slideshow for this service)" />
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
