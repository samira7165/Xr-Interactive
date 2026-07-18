'use client'

import { useTransition } from 'react'

export default function DeleteApplicationButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this application?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
