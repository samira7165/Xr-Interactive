'use client'

import { useTransition } from 'react'

export default function DeleteEmployeeButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this employee?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
