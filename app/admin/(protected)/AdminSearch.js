'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

export default function AdminSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    setOpen(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(value.trim())}`)
        const data = await res.json()
        setResults(data.results || [])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  function clear() {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  const grouped = results.reduce((acc, r) => {
    (acc[r.group] ||= []).push(r)
    return acc
  }, {})

  return (
    <div ref={containerRef} className="admin-search-root" style={{ position: 'relative', flex: 1, maxWidth: '360px', minWidth: '140px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '0.45rem 0.7rem',
      }}>
        <Search size={16} strokeWidth={2} color="var(--text-muted)" />
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          placeholder="Search everything…"
          style={{
            border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 0,
            fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)', padding: 0 }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', maxHeight: '360px', overflowY: 'auto', zIndex: 200,
        }}>
          {loading && (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No results for &ldquo;{query}&rdquo;</div>
          )}
          {!loading && Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div style={{
                padding: '0.5rem 1rem 0.25rem', fontSize: '0.68rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)',
              }}>
                {group}
              </div>
              {items.map((item, i) => (
                <Link
                  key={`${group}-${i}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="admin-search-result"
                  style={{
                    display: 'block', padding: '0.5rem 1rem', textDecoration: 'none',
                    color: 'var(--text-primary)', fontSize: '0.88rem',
                  }}
                >
                  {item.label}
                  {item.sublabel && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}> — {item.sublabel}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-search-result:hover { background: var(--bg-card-hover); }
        @media (max-width: 640px) {
          .admin-search-root { display: none; }
        }
      `}</style>
    </div>
  )
}
