export default function AdminLoading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <div className="admin-spinner" />
      <style>{`
        .admin-spinner {
          width: 28px; height: 28px; border-radius: 50%;
          border: 3px solid var(--border); border-top-color: var(--accent);
          animation: admin-spin 0.7s linear infinite;
        }
        @keyframes admin-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
