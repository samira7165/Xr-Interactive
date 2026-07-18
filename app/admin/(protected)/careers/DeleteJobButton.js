'use client'

import { useTransition } from 'react'

export default function DeleteJobButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this job posting?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
