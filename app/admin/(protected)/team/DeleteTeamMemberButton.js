'use client'

import { useTransition } from 'react'

export default function DeleteTeamMemberButton({ onDelete }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => { if (confirm('Delete this team member?')) startTransition(() => onDelete()) }}
    >
      Delete
    </button>
  )
}
