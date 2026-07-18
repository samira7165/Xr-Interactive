'use client'

import { useState } from 'react'
import { Copy, Check, Mail, Share2 } from 'lucide-react'

export default function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard access denied — ignore
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href })
      } catch {
        // user cancelled — ignore
      }
    } else {
      handleCopy()
    }
  }

  const iconButtonStyle = {
    width: '36px', height: '36px', borderRadius: '50%',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid var(--border)', color: 'var(--text-secondary)',
    background: 'transparent', cursor: 'pointer', textDecoration: 'none',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button type="button" onClick={handleCopy} style={iconButtonStyle} aria-label="Copy link" title="Copy link">
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <button
        type="button"
        onClick={() => {
          const body = `Check out this job opening: ${window.location.href}`
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
        }}
        style={iconButtonStyle}
        aria-label="Share via email"
        title="Share via email"
      >
        <Mail size={16} />
      </button>
      <button type="button" onClick={handleShare} style={iconButtonStyle} aria-label="Share" title="Share">
        <Share2 size={16} />
      </button>
    </div>
  )
}
