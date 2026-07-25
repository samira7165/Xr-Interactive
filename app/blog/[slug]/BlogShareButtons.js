'use client'

import { Mail } from 'lucide-react'

const iconButtonStyle = {
  width: '36px', height: '36px', borderRadius: '50%',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid var(--border)', color: 'var(--text-secondary)',
  background: 'transparent', cursor: 'pointer', textDecoration: 'none',
}

export default function BlogShareButtons({ title }) {
  function open(getHref) {
    window.open(getHref(window.location.href), '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        type="button"
        onClick={() => open(url => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)}
        style={iconButtonStyle}
        aria-label="Share on X"
        title="Share on X"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.9h3.7l-8 9.2 9.5 12.5h-7.4l-5.8-7.6-6.6 7.6H.6l8.6-9.9L0 1.9h7.6l5.3 7 6-7zm-1.3 19.5h2L6.5 4h-2.1l13.2 17.4z" /></svg>
      </button>
      <button
        type="button"
        onClick={() => open(url => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
        style={iconButtonStyle}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
      </button>
      <button
        type="button"
        onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(window.location.href)}` }}
        style={iconButtonStyle}
        aria-label="Share via email"
        title="Share via email"
      >
        <Mail size={16} />
      </button>
    </div>
  )
}
