'use client'
import BulkUploadModal from '@/components/admin/BulkUploadModal'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'team', label: '👥 Core Team' },
  { value: 'founding_member', label: '🌟 Founding Member' },
  { value: 'advisor', label: '💡 Advisor' },
  { value: 'supported_by', label: '🤝 Supported By' },
  { value: 'partner', label: '🔗 Partner' },
]

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [filterCat, setFilterCat] = useState('all')

  const load = () => {
    setLoading(true)
    fetch('/api/admin/people').then(r => r.json()).then(d => { setPeople(d.data || []); setLoading(false) })
  }
  useEffect(load, [])

  const del = async (id: string) => {
    if (!confirm('Delete this person?')) return
    await fetch(`/api/admin/people/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const toggleActive = async (id: string, is_active: boolean) => {
    await fetch(`/api/admin/people/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !is_active }) })
    load()
  }

  const filtered = people.filter(p => filterCat === 'all' || p.category === filterCat)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)' }}>People</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Manage team, advisors, founding members and partners</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowBulkUpload(true)}>📤 Bulk Upload</button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Person</button>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setFilterCat('all')} style={{ padding: '6px 16px', borderRadius: 20, border: '1.5px solid', borderColor: filterCat === 'all' ? 'var(--saffron)' : 'var(--gray-200)', background: filterCat === 'all' ? 'rgba(255,107,53,0.1)' : 'white', color: filterCat === 'all' ? 'var(--saffron-dark)' : 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
          All ({people.length})
        </button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilterCat(c.value)} style={{ padding: '6px 16px', borderRadius: 20, border: '1.5px solid', borderColor: filterCat === c.value ? 'var(--saffron)' : 'var(--gray-200)', background: filterCat === c.value ? 'rgba(255,107,53,0.1)' : 'white', color: filterCat === c.value ? 'var(--saffron-dark)' : 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
            {c.label} ({people.filter(p => p.category === c.value).length})
          </button>
        ))}
      </div>

      {/* Grid view */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16, color: 'var(--gray-400)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <p>No people added yet. Click "Add Person" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((p: any) => (
            <div key={p.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', opacity: p.is_active ? 1 : 0.6 }}>
              <div style={{ height: 4, background: p.is_active ? 'var(--saffron)' : 'var(--gray-200)' }} />
              <div style={{ padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {p.photo_url ? (
                  <img src={p.photo_url} alt={p.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 700, flexShrink: 0 }}>
                    {p.name.charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{p.name}</div>
                  {p.role && <div style={{ fontSize: 12, color: 'var(--saffron)', fontWeight: 600, marginTop: 2 }}>{p.role}</div>}
                  {p.organization && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 1 }}>{p.organization}</div>}
                  <div style={{ marginTop: 6 }}>
                    <span className="badge badge-navy" style={{ fontSize: 10 }}>{CATEGORIES.find(c => c.value === p.category)?.label || p.category}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
                <button onClick={() => { setEditing(p); setShowForm(true) }} style={{ flex: 1, padding: '6px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: 12, color: 'var(--navy)', fontWeight: 600 }}>✏️ Edit</button>
                <button onClick={() => toggleActive(p.id, p.is_active)} style={{ flex: 1, padding: '6px', borderRadius: 8, border: 'none', background: p.is_active ? '#FEF3C7' : '#D1FAE5', cursor: 'pointer', fontSize: 12, color: p.is_active ? '#92400E' : '#065F46', fontWeight: 600 }}>
                  {p.is_active ? '⏸ Hide' : '▶ Show'}
                </button>
                <button onClick={() => del(p.id)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#FEE2E2', cursor: 'pointer', fontSize: 12, color: '#991B1B' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <PersonFormModal person={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); load() }} />}
      {showBulkUpload && (
        <BulkUploadModal
          title="Bulk Upload People"
          templateUrl="/templates/people-bulk-upload-template.xlsx"
          uploadUrl="/api/admin/people/bulk-upload"
          onClose={() => setShowBulkUpload(false)}
          onComplete={load}
        />
      )}
    </div>
  )
}

function PersonFormModal({ person: p, onClose, onSave }: { person: any; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    name: p?.name || '', role: p?.role || '', bio: p?.bio || '',
    photo_url: p?.photo_url || '', category: p?.category || 'team',
    organization: p?.organization || '', order_index: p?.order_index || 0,
    linkedin: p?.linkedin || '', twitter: p?.twitter || '',
    website: p?.website || '', email: p?.email || '', is_active: p?.is_active !== false,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const url = p ? `/api/admin/people/${p.id}` : '/api/admin/people'
    const method = p ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(p ? 'Updated!' : 'Person added!'); onSave() } else toast.error('Failed to save')
    setSaving(false)
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto', padding: '32px 16px' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 640, padding: 36, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)' }}>✕</button>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--navy)', marginBottom: 28 }}>{p ? 'Edit Person' : 'Add Person'}</h2>

        {/* Preview */}
        {(form.photo_url || form.name) && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24, padding: 16, background: 'var(--gray-50)', borderRadius: 12 }}>
            {form.photo_url ? (
              <img src={form.photo_url} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white', fontWeight: 700 }}>{form.name.charAt(0)}</div>
            )}
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{form.name || 'Name preview'}</div>
              <div style={{ fontSize: 13, color: 'var(--saffron)' }}>{form.role}</div>
              {form.organization && <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{form.organization}</div>}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={set('name')} placeholder="Dr. Rajesh Kumar" />
          </div>
          <div className="form-group">
            <label className="form-label">Title / Role</label>
            <input className="form-input" value={form.role} onChange={set('role')} placeholder="Co-Founder & CEO" />
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <input className="form-input" value={form.organization} onChange={set('organization')} placeholder="Company / Institution" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input className="form-input" type="number" value={form.order_index} onChange={set('order_index')} placeholder="0" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Photo URL</label>
            <input className="form-input" type="url" value={form.photo_url} onChange={set('photo_url')} placeholder="https://..." />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" value={form.bio} onChange={set('bio')} placeholder="Brief bio..." style={{ minHeight: 100 }} />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input className="form-input" type="url" value={form.linkedin} onChange={set('linkedin')} />
          </div>
          <div className="form-group">
            <label className="form-label">Twitter URL</label>
            <input className="form-input" type="url" value={form.twitter} onChange={set('twitter')} />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input className="form-input" type="url" value={form.website} onChange={set('website')} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <label htmlFor="active" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Visible on website</label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Person'}</button>
        </div>
      </div>
    </div>
  )
}
