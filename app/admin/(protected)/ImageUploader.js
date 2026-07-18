'use client'

import { useState, useRef } from 'react'

async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data.url
}

export default function ImageUploader({ name, defaultValue, label }) {
  const [url, setUrl] = useState(defaultValue || '')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const uploadedUrl = await uploadFile(file)
      setUrl(uploadedUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-field">
      {label && <label className="admin-label">{label}</label>}
      <input type="hidden" name={name} value={url} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '10px', padding: url ? '0.75rem' : '1.5rem',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {url ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={url} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
            <div style={{ flex: 1, textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {url}
            </div>
            <button
              type="button"
              className="admin-btn"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
              onClick={(e) => { e.stopPropagation(); setUrl('') }}
            >
              Remove
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            {uploading ? 'Uploading...' : 'Drag & drop an image here, or click to browse'}
          </p>
        )}
      </div>

      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
