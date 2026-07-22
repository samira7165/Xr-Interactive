'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export default function AdminNotifications({ newContacts = 0, newApplications = 0 }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const total = newContacts + newApplications

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)',
          background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <Bell size={17} strokeWidth={2} />
        {total > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px', fontSize: '0.65rem', fontWeight: 700,
            color: '#fff', background: 'var(--accent)', borderRadius: '999px',
            padding: '0.05rem 0.35rem', lineHeight: 1.4,
          }}>
            {total}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '260px',
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 200, overflow: 'hidden',
        }}>
          {total === 0 ? (
            <div style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>You&rsquo;re all caught up.</div>
          ) : (
            <>
              {newContacts > 0 && (
                <Link
                  href="/admin/contacts"
                  onClick={() => setOpen(false)}
                  className="admin-notif-item"
                  style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', borderBottom: newApplications > 0 ? '1px solid var(--border)' : 'none' }}
                >
                  {newContacts} new contact message{newContacts > 1 ? 's' : ''} this week
                </Link>
              )}
              {newApplications > 0 && (
                <Link
                  href="/admin/applications"
                  onClick={() => setOpen(false)}
                  className="admin-notif-item"
                  style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                >
                  {newApplications} new application{newApplications > 1 ? 's' : ''} this week
                </Link>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        .admin-notif-item:hover { background: var(--bg-card-hover); }
      `}</style>
    </div>
  )
}
