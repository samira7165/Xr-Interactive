'use client'

import { useTransition } from 'react'

export default function DeleteContactButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this contact submission?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
