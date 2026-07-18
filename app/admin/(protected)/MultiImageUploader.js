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

export default function MultiImageUploader({ name, defaultValue, label }) {
  const [urls, setUrls] = useState(Array.isArray(defaultValue) ? defaultValue : [])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function handleFiles(files) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadFile))
      setUrls(prev => [...prev, ...uploaded])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  function removeAt(index) {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="admin-field">
      {label && <label className="admin-label">{label}</label>}
      <input type="hidden" name={name} value={urls.join('\n')} />

      {urls.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {urls.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
              <button
                type="button"
                onClick={() => removeAt(i)}
                style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: '#f87171', color: '#fff', border: 'none',
                  fontSize: '0.7rem', lineHeight: 1, cursor: 'pointer',
                }}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '10px', padding: '1.25rem',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          {uploading ? 'Uploading...' : 'Drag & drop images here, or click to browse (multiple allowed)'}
        </p>
      </div>

      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
