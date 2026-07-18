'use client'

import { useTransition } from 'react'

export default function DeleteServiceButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this service?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
