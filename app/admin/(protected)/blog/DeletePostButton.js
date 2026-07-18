'use client'

import { useTransition } from 'react'

export default function DeletePostButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this post?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
