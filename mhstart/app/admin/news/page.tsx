'use client'
import BulkUploadModal from '@/components/admin/BulkUploadModal'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Article = { id: string; title: string; status: string; is_pinned: boolean; author_name: string; created_at: string; submitted_by_type: string }

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/news').then(r => r.json()).then(d => { setArticles(d.data || []); setLoading(false) })
  }
  useEffect(load, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/news/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    toast.success(`Article ${status}`)
    load()
  }

  const togglePin = async (id: string, pinned: boolean) => {
    await fetch(`/api/admin/news/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_pinned: !pinned }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const filtered = articles.filter(a => filter === 'all' || a.status === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)' }}>News Articles</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Manage news, reviews, and publications</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowBulkUpload(true)}>📤 Bulk Upload</button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Article</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'pending', 'published', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
            borderColor: filter === f ? 'var(--saffron)' : 'var(--gray-200)',
            background: filter === f ? 'rgba(255,107,53,0.1)' : 'white',
            color: filter === f ? 'var(--saffron-dark)' : 'var(--text-secondary)',
            fontSize: 13, cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize',
          }}>{f} ({articles.filter(a => f === 'all' || a.status === f).length})</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              {['Title', 'Author', 'Source', 'Status', 'Pinned', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--gray-400)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--gray-400)' }}>No articles found</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '14px 16px', maxWidth: 280 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{a.author_name || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge" style={{ fontSize: 11, background: a.submitted_by_type === 'admin' ? 'rgba(10,36,99,0.1)' : 'rgba(255,107,53,0.1)', color: a.submitted_by_type === 'admin' ? 'var(--navy)' : 'var(--saffron-dark)' }}>
                    {a.submitted_by_type}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge status-${a.status}`} style={{ fontSize: 11 }}>{a.status}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => togglePin(a.id, a.is_pinned)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                    {a.is_pinned ? '📌' : '📍'}
                  </button>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--gray-400)' }}>
                  {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setEditing(a); setShowForm(true) }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: 12, color: 'var(--navy)' }}>Edit</button>
                    {a.status === 'pending' && <>
                      <button onClick={() => updateStatus(a.id, 'published')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'var(--green)', cursor: 'pointer', fontSize: 12, color: 'white' }}>✓ Publish</button>
                      <button onClick={() => updateStatus(a.id, 'rejected')} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#EF4444', cursor: 'pointer', fontSize: 12, color: 'white' }}>✕ Reject</button>
                    </>}
                    {a.status === 'published' && <button onClick={() => updateStatus(a.id, 'pending')} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: 12 }}>Unpublish</button>}
                    <button onClick={() => del(a.id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#FEE2E2', cursor: 'pointer', fontSize: 12, color: '#991B1B' }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <NewsFormModal article={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); load() }} />}
      {showBulkUpload && (
        <BulkUploadModal
          title="Bulk Upload News Articles"
          templateUrl="/templates/news-bulk-upload-template.xlsx"
          uploadUrl="/api/admin/news/bulk-upload"
          onClose={() => setShowBulkUpload(false)}
          onComplete={load}
        />
      )}
    </div>
  )
}

function NewsFormModal({ article, onClose, onSave }: { article: any; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    title: article?.title || '', excerpt: article?.excerpt || '', content: article?.content || '',
    cover_image: article?.cover_image || '', author_name: article?.author_name || '',
    author_email: article?.author_email || '', status: article?.status || 'published',
    is_pinned: article?.is_pinned || false, tags: article?.tags?.join(', ') || '',
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const tags = form.tags ? form.tags.split(',').map((t: string) => t.trim()) : []
    const url = article ? `/api/admin/news/${article.id}` : '/api/admin/news'
    const method = article ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, tags }) })
    if (res.ok) { toast.success(article ? 'Updated!' : 'Created!'); onSave() }
    else toast.error('Failed to save')
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto', padding: '32px 16px' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 760, padding: 36, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)' }}>✕</button>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--navy)', marginBottom: 28 }}>{article ? 'Edit Article' : 'New Article'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Author Name</label>
            <input className="form-input" value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Author Email</label>
            <input className="form-input" type="email" value={form.author_email} onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Short Summary / Excerpt</label>
            <textarea className="form-textarea" style={{ minHeight: 80 }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Full Content (HTML supported)</label>
            <textarea className="form-textarea" style={{ minHeight: 240, fontFamily: 'monospace', fontSize: 13 }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" type="url" value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input className="form-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="published">Published</option>
              <option value="pending">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
            <input type="checkbox" id="pinned" checked={form.is_pinned} onChange={e => setForm(f => ({ ...f, is_pinned: e.target.checked }))} style={{ width: 18, height: 18 }} />
            <label htmlFor="pinned" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>📌 Pin this article (shows as featured)</label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Article'}</button>
        </div>
      </div>
    </div>
  )
}
