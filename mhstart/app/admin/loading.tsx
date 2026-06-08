export default function AdminLoading() {
  return (
    <div style={{ padding: 32 }}>
      <div className="skeleton" style={{ height: 36, width: 220, borderRadius: 8, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: 320, borderRadius: 6, marginBottom: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
    </div>
  )
}
