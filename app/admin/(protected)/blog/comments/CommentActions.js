'use client'

import { useTransition } from 'react'

export default function CommentActions({ approved, onApprove, onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {!approved && (
        <button
          className="admin-btn admin-btn-primary"
          disabled={pending}
          onClick={() => startTransition(() => onApprove())}
        >
          Approve
        </button>
      )}
      <button
        className="admin-btn admin-btn-danger"
        disabled={pending}
        onClick={() => { if (confirm('Delete this comment?')) startTransition(() => onDelete()) }}
      >
        Delete
      </button>
    </div>
  )
}
