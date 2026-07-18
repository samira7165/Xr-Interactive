'use client'

import { useState, useRef } from 'react'

async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload-resume', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

export default function ResumeUploader({ name = 'resumeUrl' }) {
  const [url, setUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadFile(file)
      setUrl(result.url)
      setFileName(result.name)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
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
          borderRadius: '10px', padding: '1.5rem',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(192,132,252,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {fileName ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <span>{fileName}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setUrl(''); setFileName('') }}
              style={{
                background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px',
                color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '0.2rem 0.6rem', cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            {uploading ? 'Uploading...' : 'Drag & drop your CV here, or click to browse (PDF, DOC, DOCX — max 5MB)'}
          </p>
        )}
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</p>}
    </div>
  )
}
