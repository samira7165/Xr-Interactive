'use client'

import { useTransition } from 'react'

export default function RemoveAdminButton({ onRemove }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      className="admin-btn admin-btn-danger"
      disabled={pending}
      onClick={() => {
        if (!confirm('Remove this admin account? They will no longer be able to log in.')) return
        startTransition(async () => {
          const result = await onRemove()
          if (result?.error) alert(result.error)
        })
      }}
    >
      Remove
    </button>
  )
}
