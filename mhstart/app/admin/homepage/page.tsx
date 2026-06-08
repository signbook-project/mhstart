'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<any>({})
  const [banners, setBanners] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [spotlight, setSpotlight] = useState<any>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [tab, setTab] = useState<'hero' | 'banners' | 'spotlight' | 'site'>('hero')
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.data || {}))
    fetch('/api/admin/banners').then(r => r.json()).then(d => setBanners(d.data || []))
    fetch('/api/admin/listings?status=active').then(r => r.json()).then(d => setListings(d.data || []))
    fetch('/api/admin/spotlight').then(r => r.json()).then(d => setSpotlight(d.data || null))
  }, [])

  const saveSetting = async (key: string, value: any) => {
    setSaving(key)
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
    toast.success('Saved!')
    setSaving(null)
  }

  const [hero, setHero] = useState<any>(null)
  const [site, setSite] = useState<any>(null)
  useEffect(() => {
    if (settings.homepage) setHero({ ...settings.homepage })
    if (settings.site) setSite({ ...settings.site })
  }, [settings])

  const tabs = [
    { id: 'hero', label: '🏠 Hero Section' },
    { id: 'site', label: '⚙️ Site Info' },
    { id: 'banners', label: '🖼️ Banners' },
    { id: 'spotlight', label: '⭐ Spotlight' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)' }}>Homepage Editor</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Edit all homepage content from here</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--gray-100)', borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} style={{ flex: 1, padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? 'var(--navy)' : 'var(--text-secondary)', boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero */}
      {tab === 'hero' && hero && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 24 }}>Hero Section</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Hero Title</label>
              <input className="form-input" value={hero.hero_title || ''} onChange={e => setHero((h: any) => ({ ...h, hero_title: e.target.value }))} placeholder="Maharashtra's Startup Ecosystem" />
            </div>
            <div className="form-group">
              <label className="form-label">Hero Subtitle</label>
              <textarea className="form-textarea" value={hero.hero_subtitle || ''} onChange={e => setHero((h: any) => ({ ...h, hero_subtitle: e.target.value }))} style={{ minHeight: 90 }} />
            </div>
            <div className="form-group">
              <label className="form-label">CTA Button Text</label>
              <input className="form-input" value={hero.hero_cta || ''} onChange={e => setHero((h: any) => ({ ...h, hero_cta: e.target.value }))} placeholder="Explore Ecosystem" />
            </div>
            <div className="form-group">
              <label className="form-label">Hero Background Image URL (optional)</label>
              <input className="form-input" type="url" value={hero.hero_image || ''} onChange={e => setHero((h: any) => ({ ...h, hero_image: e.target.value }))} placeholder="https://..." />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => saveSetting('homepage', hero)} disabled={saving === 'homepage'}>
              {saving === 'homepage' ? 'Saving...' : '💾 Save Hero'}
            </button>
          </div>
        </div>
      )}

      {/* Site Info */}
      {tab === 'site' && site && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 24 }}>Site Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input className="form-input" value={site.name || ''} onChange={e => setSite((s: any) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input className="form-input" value={site.tagline || ''} onChange={e => setSite((s: any) => ({ ...s, tagline: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">About Text (used in About page & Footer)</label>
              <textarea className="form-textarea" value={site.about || ''} onChange={e => setSite((s: any) => ({ ...s, about: e.target.value }))} style={{ minHeight: 120 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-input" type="email" value={site.contact_email || ''} onChange={e => setSite((s: any) => ({ ...s, contact_email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input className="form-input" value={site.contact_phone || ''} onChange={e => setSite((s: any) => ({ ...s, contact_phone: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input className="form-input" value={site.address || ''} onChange={e => setSite((s: any) => ({ ...s, address: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => saveSetting('site', site)} disabled={saving === 'site'}>
            {saving === 'site' ? 'Saving...' : '💾 Save Site Info'}
          </button>
        </div>
      )}

      {/* Banners */}
      {tab === 'banners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Banners shown on homepage (ordered by display order)</p>
            <button className="btn btn-primary" onClick={() => { setEditingBanner(null); setShowBannerForm(true) }}>+ Add Banner</button>
          </div>
          {banners.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
              <p>No banners added yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {banners.map((b: any) => (
                <div key={b.id} style={{ background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 16, alignItems: 'center' }}>
                  {b.image_url && <img src={b.image_url} alt="" style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{b.title || 'Untitled Banner'}</div>
                    {b.subtitle && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{b.subtitle}</div>}
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>Order: {b.order_index} · {b.is_active ? '✅ Active' : '⏸ Inactive'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditingBanner(b); setShowBannerForm(true) }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                    <button onClick={() => deleteBanner(b.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#FEE2E2', cursor: 'pointer', fontSize: 12, color: '#991B1B' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showBannerForm && <BannerFormModal banner={editingBanner} onClose={() => setShowBannerForm(false)} onSave={() => { setShowBannerForm(false); fetch('/api/admin/banners').then(r => r.json()).then(d => setBanners(d.data || [])) }} />}
        </div>
      )}

      {/* Spotlight */}
      {tab === 'spotlight' && (
        <SpotlightEditor listings={listings} spotlight={spotlight} onSave={(s: any) => setSpotlight(s)} />
      )}
    </div>
  )

  async function deleteBanner(id: string) {
    if (!confirm('Delete this banner?')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    fetch('/api/admin/banners').then(r => r.json()).then(d => setBanners(d.data || []))
  }
}

function SpotlightEditor({ listings, spotlight, onSave }: any) {
  const [form, setForm] = useState({
    listing_id: spotlight?.listing_id || '',
    custom_title: spotlight?.custom_title || '',
    custom_description: spotlight?.custom_description || '',
    custom_image: spotlight?.custom_image || '',
    week_start: spotlight?.week_start || new Date().toISOString().slice(0, 10),
    is_active: spotlight?.is_active !== false,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/spotlight', { method: spotlight ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: spotlight?.id }) })
    if (res.ok) { toast.success('Spotlight saved!'); const d = await res.json(); onSave(d.data) }
    else toast.error('Failed to save')
    setSaving(false)
  }

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>⭐ Startup Spotlight</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Choose a startup to highlight on the homepage as "Startup of the Week"</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Select Startup / Listing</label>
          <select className="form-select" value={form.listing_id} onChange={e => setForm(f => ({ ...f, listing_id: e.target.value }))}>
            <option value="">— Select from active listings —</option>
            {listings.map((l: any) => <option key={l.id} value={l.id}>{l.name} ({l.type})</option>)}
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Custom Title (overrides listing name)</label>
          <input className="form-input" value={form.custom_title} onChange={e => setForm(f => ({ ...f, custom_title: e.target.value }))} placeholder="Leave blank to use listing name" />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Custom Description (overrides tagline)</label>
          <textarea className="form-textarea" value={form.custom_description} onChange={e => setForm(f => ({ ...f, custom_description: e.target.value }))} style={{ minHeight: 100 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Custom Image URL</label>
          <input className="form-input" type="url" value={form.custom_image} onChange={e => setForm(f => ({ ...f, custom_image: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Week Starting</label>
          <input className="form-input" type="date" value={form.week_start} onChange={e => setForm(f => ({ ...f, week_start: e.target.value }))} />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="sp_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 16, height: 16 }} />
          <label htmlFor="sp_active" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Show on homepage</label>
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={save} disabled={saving}>
        {saving ? 'Saving...' : '⭐ Save Spotlight'}
      </button>
    </div>
  )
}

function BannerFormModal({ banner: b, onClose, onSave }: any) {
  const [form, setForm] = useState({ title: b?.title || '', subtitle: b?.subtitle || '', image_url: b?.image_url || '', link_url: b?.link_url || '', link_text: b?.link_text || '', order_index: b?.order_index || 0, is_active: b?.is_active !== false })
  const [saving, setSaving] = useState(false)
  const save = async () => {
    setSaving(true)
    const url = b ? `/api/admin/banners/${b.id}` : '/api/admin/banners'
    const method = b ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Saved!'); onSave() } else toast.error('Failed')
    setSaving(false)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 560, padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'var(--navy)', marginBottom: 24 }}>{b ? 'Edit Banner' : 'New Banner'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Image URL *</label><input className="form-input" type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label className="form-label">Link URL</label><input className="form-input" type="url" value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Link Button Text</label><input className="form-input" value={form.link_text} onChange={e => setForm(f => ({ ...f, link_text: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Order</label><input className="form-input" type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) }))} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="b_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <label htmlFor="b_active" style={{ fontSize: 14, fontWeight: 600 }}>Active</label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Banner'}</button>
        </div>
      </div>
    </div>
  )
}
