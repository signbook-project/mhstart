export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--nav-height)', background: 'var(--gray-50)' }}>
      <div style={{ height: 320, background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', marginBottom: 48 }} />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: 'white', boxShadow: 'var(--shadow-sm)' }}>
              <div className="skeleton" style={{ height: 200 }} />
              <div style={{ padding: 20 }}>
                <div className="skeleton" style={{ height: 14, marginBottom: 10, borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 20, marginBottom: 8, borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
