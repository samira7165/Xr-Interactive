'use client'

import { useTransition } from 'react'

export default function DeleteItemButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this portfolio item?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
