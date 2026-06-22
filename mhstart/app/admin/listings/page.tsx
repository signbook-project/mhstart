'use client'
import BulkUploadModal from '@/components/admin/BulkUploadModal'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const TYPE_LABELS: Record<string, string> = { startup: '🚀 Startup', incubator: '🏢 Incubator', vc: '💰 VC', accelerator: '⚡ Accelerator', angel: '👼 Angel', government: '🏛️ Govt', corporate: '🏗️ Corporate', other: '🔵 Other' }

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/listings').then(r => r.json()).then(d => { setListings(d.data || []); setLoading(false) })
  }
  useEffect(load, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/listings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    toast.success(`Status updated to ${status}`)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const filtered = listings.filter(l => filter === 'all' || l.status === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)' }}>Map Listings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Manage startups, incubators and enablers on the map</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowBulkUpload(true)}>📤 Bulk Upload</button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Listing</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'pending', 'active', 'paused', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
            borderColor: filter === f ? 'var(--saffron)' : 'var(--gray-200)',
            background: filter === f ? 'rgba(255,107,53,0.1)' : 'white',
            color: filter === f ? 'var(--saffron-dark)' : 'var(--text-secondary)',
            fontSize: 13, cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize',
          }}>{f} ({listings.filter(l => f === 'all' || l.status === f).length})</button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              {['Name', 'Type', 'City', 'Contact', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray-400)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>No listings found</td></tr>
            ) : filtered.map((l: any) => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {l.logo_url && <img src={l.logo_url} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain', border: '1px solid var(--gray-200)' }} />}
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{l.name}</p>
                      {l.tagline && <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{l.tagline.slice(0, 50)}</p>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13 }}>{TYPE_LABELS[l.type] || l.type}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{l.city || '—'}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{l.email || l.contact_name || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge status-${l.status}`} style={{ fontSize: 11 }}>{l.status}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => { setEditing(l); setShowForm(true) }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                    {l.status === 'pending' && <button onClick={() => updateStatus(l.id, 'active')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'var(--green)', cursor: 'pointer', fontSize: 12, color: 'white' }}>✓ Approve</button>}
                    {l.status === 'active' && <button onClick={() => updateStatus(l.id, 'paused')} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: 12 }}>⏸ Pause</button>}
                    {l.status === 'paused' && <button onClick={() => updateStatus(l.id, 'active')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'var(--green)', cursor: 'pointer', fontSize: 12, color: 'white' }}>▶ Resume</button>}
                    {l.status === 'pending' && <button onClick={() => updateStatus(l.id, 'rejected')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#EF4444', cursor: 'pointer', fontSize: 12, color: 'white' }}>✕ Reject</button>}
                    <button onClick={() => del(l.id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#FEE2E2', cursor: 'pointer', fontSize: 12, color: '#991B1B' }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <ListingFormModal listing={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); load() }} />}
      {showBulkUpload && (
        <BulkUploadModal
          title="Bulk Upload Map Listings"
          templateUrl="/templates/map-listings-bulk-upload-template.xlsx"
          uploadUrl="/api/admin/listings/bulk-upload"
          onClose={() => setShowBulkUpload(false)}
          onComplete={load}
        />
      )}
    </div>
  )
}

function ListingFormModal({ listing: l, onClose, onSave }: { listing: any; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    type: l?.type || 'startup', name: l?.name || '', tagline: l?.tagline || '',
    description: l?.description || '', logo_url: l?.logo_url || '', website: l?.website || '',
    contact_name: l?.contact_name || '', email: l?.email || '', phone: l?.phone || '',
    address: l?.address || '', city: l?.city || '', district: l?.district || '',
    lat: l?.lat || '', lng: l?.lng || '', stage: l?.stage || '', team_size: l?.team_size || '',
    founded_year: l?.founded_year || '', sector: l?.sector?.join(', ') || '',
    linkedin: l?.linkedin || '', twitter: l?.twitter || '', status: l?.status || 'active',
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const sector = form.sector ? form.sector.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    const url = l ? `/api/admin/listings/${l.id}` : '/api/admin/listings'
    const method = l ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sector, lat: form.lat ? parseFloat(String(form.lat)) : null, lng: form.lng ? parseFloat(String(form.lng)) : null }) })
    if (res.ok) { toast.success(l ? 'Updated!' : 'Created!'); onSave() } else toast.error('Failed')
    setSaving(false)
  }

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto', padding: '32px 16px' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 760, padding: 36, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--navy)', marginBottom: 28 }}>{l ? 'Edit Listing' : 'New Listing'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={set('type')}>
              {Object.entries(TYPE_LABELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={set('status')}>
              <option value="active">Active</option><option value="pending">Pending</option><option value="paused">Paused</option><option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Name *</label>
            <input className="form-input" value={form.name} onChange={set('name')} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Tagline</label>
            <input className="form-input" value={form.tagline} onChange={set('tagline')} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input className="form-input" value={form.city} onChange={set('city')} />
          </div>
          <div className="form-group">
            <label className="form-label">District</label>
            <input className="form-input" value={form.district} onChange={set('district')} />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input className="form-input" type="number" step="any" value={form.lat} onChange={set('lat')} />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input className="form-input" type="number" step="any" value={form.lng} onChange={set('lng')} />
          </div>
          <div className="form-group">
            <label className="form-label">Sectors (comma-separated)</label>
            <input className="form-input" value={form.sector} onChange={set('sector')} />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input className="form-input" type="url" value={form.website} onChange={set('website')} />
          </div>
          <div className="form-group">
            <label className="form-label">Logo URL</label>
            <input className="form-input" type="url" value={form.logo_url} onChange={set('logo_url')} />
          </div>
          <div className="form-group">
            <label className="form-label">Founded Year</label>
            <input className="form-input" type="number" value={form.founded_year} onChange={set('founded_year')} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Listing'}</button>
        </div>
      </div>
    </div>
  )
}
