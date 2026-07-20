'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MultiImageUploader from '../MultiImageUploader'

const types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']

export default function JobForm({ jobId, initialData }) {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const responsibilitiesDefault = Array.isArray(initialData?.responsibilities) ? initialData.responsibilities.join('\n') : ''
  const requirementsDefault = Array.isArray(initialData?.requirements) ? initialData.requirements.join('\n') : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setErrors({})
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const url = jobId ? `/api/admin/careers/${jobId}` : '/api/admin/careers'
    const res = await fetch(url, { method: 'POST', body: formData })
    const data = await res.json().catch(() => ({}))

    if (res.ok && data.success) {
      router.push('/admin/careers')
      return
    }

    setErrors(data.errors || {})
    setMessage(data.message || 'Something went wrong. Please try again.')
    setPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card" style={{ maxWidth: '640px' }}>
      <div className="admin-field">
        <label className="admin-label">Job Title</label>
        <input className="admin-input" name="title" defaultValue={initialData?.title} placeholder="e.g. Senior Unity Developer" required />
        {errors.title && <p className="admin-error">{errors.title[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Slug (used in the job's URL, e.g. /careers/senior-unity-developer)</label>
        <input className="admin-input" name="slug" defaultValue={initialData?.slug} required />
        {errors.slug && <p className="admin-error">{errors.slug[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Department (optional)</label>
        <input className="admin-input" name="department" defaultValue={initialData?.department || ''} placeholder="e.g. Engineering" />
      </div>
      <div className="admin-field">
        <label className="admin-label">Location</label>
        <input className="admin-input" name="location" defaultValue={initialData?.location} placeholder="e.g. Dhaka, Bangladesh" required />
        {errors.location && <p className="admin-error">{errors.location[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Job Type</label>
        <select className="admin-select" name="type" defaultValue={initialData?.type || types[0]} required>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.type && <p className="admin-error">{errors.type[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Level (optional)</label>
        <input className="admin-input" name="level" defaultValue={initialData?.level || ''} placeholder="e.g. Mid-Level" />
      </div>
      <div className="admin-field">
        <label className="admin-label">Compensation (optional)</label>
        <input className="admin-input" name="compensation" defaultValue={initialData?.compensation || ''} placeholder="e.g. 50,000-60,000 BDT/Month" />
      </div>

      <MultiImageUploader name="images" defaultValue={initialData?.images} label="Images (optional — shown on the job's detail page)" />

      <div className="admin-field">
        <label className="admin-label">Description (Role Purpose)</label>
        <textarea className="admin-textarea" name="description" rows={4} defaultValue={initialData?.description} required />
        {errors.description && <p className="admin-error">{errors.description[0]}</p>}
      </div>
      <div className="admin-field">
        <label className="admin-label">Responsibilities — "What You'll Do" (one per line)</label>
        <textarea className="admin-textarea" name="responsibilities" rows={4} defaultValue={responsibilitiesDefault} placeholder={'Plan and execute campaigns\nOptimize conversion funnels'} />
      </div>
      <div className="admin-field">
        <label className="admin-label">Requirements — "What You'll Bring" (one per line)</label>
        <textarea className="admin-textarea" name="requirements" rows={4} defaultValue={requirementsDefault} placeholder={'3+ years of experience\nStrong analytical skills'} />
      </div>
      <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="active" defaultChecked={initialData?.active ?? true} id="active" />
        <label htmlFor="active" className="admin-label" style={{ marginBottom: 0 }}>Active (visible on the public Careers page)</label>
      </div>
      {message && <p className="admin-error" style={{ marginBottom: '1rem' }}>{message}</p>}
      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
