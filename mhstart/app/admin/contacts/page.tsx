'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    fetch('/api/admin/contacts')
      .then(r => r.json())
      .then(d => { setContacts(d.data || []); setLoading(false) })
  }
  useEffect(load, [])

  const markStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    setSelected(null)
    load()
  }

  const filtered = contacts.filter(c => filter === 'all' || c.status === filter)
  const newCount = contacts.filter(c => c.status === 'new').length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 12 }}>
          Contact Messages
          {newCount > 0 && (
            <span style={{ background: 'var(--saffron)', color: 'white', fontSize: 13, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{newCount} new</span>
          )}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Messages submitted through the contact form</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'new', 'read', 'replied'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
            borderColor: filter === f ? 'var(--saffron)' : 'var(--gray-200)',
            background: filter === f ? 'rgba(255,107,53,0.1)' : 'white',
            color: filter === f ? 'var(--saffron-dark)' : 'var(--text-secondary)',
            fontSize: 13, cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize',
          }}>
            {f} ({contacts.filter(c => f === 'all' || c.status === f).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* List */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              <p>No messages found</p>
            </div>
          ) : (
            <div>
              {filtered.map((c: any) => (
                <div
                  key={c.id}
                  onClick={() => { setSelected(c); if (c.status === 'new') markStatus(c.id, 'read') }}
                  style={{
                    padding: '16px 20px', borderBottom: '1px solid var(--gray-100)',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: selected?.id === c.id ? 'rgba(255,107,53,0.05)' : 'white',
                    borderLeft: c.status === 'new' ? '3px solid var(--saffron)' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (selected?.id !== c.id) (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)' }}
                  onMouseLeave={e => { if (selected?.id !== c.id) (e.currentTarget as HTMLElement).style.background = 'white' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0 }}>
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      <span className={`badge status-${c.status}`} style={{ fontSize: 10 }}>{c.status}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                        {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  {c.subject && <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginLeft: 46, marginTop: 4 }}>{c.subject}</p>}
                  <p style={{ fontSize: 13, color: 'var(--gray-400)', marginLeft: 46, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-sm)', padding: 28, height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 700 }}>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)' }}>{selected.name}</div>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: 13, color: 'var(--saffron)', textDecoration: 'none' }}>{selected.email}</a>
                  {selected.phone && <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{selected.phone}</div>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 20 }}>✕</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--gray-400)', marginBottom: 4 }}>DATE</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                {new Date(selected.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
              </div>
            </div>

            {selected.subject && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--gray-400)', marginBottom: 4 }}>SUBJECT</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>{selected.subject}</div>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--gray-400)', marginBottom: 8 }}>MESSAGE</div>
              <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: 16, fontSize: 15, lineHeight: 1.75, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                className="btn btn-primary"
                onClick={() => markStatus(selected.id, 'replied')}
                style={{ flex: 1, justifyContent: 'center', fontSize: 14 }}
              >
                📧 Reply via Email
              </a>
              {selected.status !== 'replied' && (
                <button
                  onClick={() => markStatus(selected.id, 'replied')}
                  className="btn btn-outline"
                  style={{ fontSize: 13 }}
                >
                  ✓ Mark Replied
                </button>
              )}
              <button
                onClick={() => del(selected.id)}
                style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#FEE2E2', cursor: 'pointer', fontSize: 13, color: '#991B1B', fontWeight: 600 }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
