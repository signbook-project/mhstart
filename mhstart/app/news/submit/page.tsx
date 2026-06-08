'use client'
import { useState } from 'react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import toast from 'react-hot-toast'

export default function SubmitNewsPage() {
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover_image: '', author_name: '', author_email: '', tags: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/news/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success('News submitted for review!')
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center', background: 'white', borderRadius: 20, padding: 56, maxWidth: 500, boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'var(--navy)', marginBottom: 12 }}>Submitted Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Your news article has been submitted for review. Our team will publish it after verification.
          </p>
          <a href="/news" className="btn btn-primary">Back to News</a>
        </div>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', background: 'var(--gray-50)', minHeight: '100vh', padding: 'calc(var(--nav-height) + 48px) 0 80px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 36 }}>
            <div className="section-eyebrow">📰 Submit News</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, color: 'var(--navy)', marginBottom: 10 }}>Share Your Story</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Submit news about your startup, funding, events, or any ecosystem updates. Our team will review and publish.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 20, padding: 40, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Article Title *</label>
                <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter your news headline" />
              </div>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input className="form-input" required value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input className="form-input" type="email" required value={form.author_email} onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))} placeholder="email@example.com" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Short Summary *</label>
                <textarea className="form-textarea" required value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="A 2-3 sentence summary of the article" style={{ minHeight: 90 }} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Full Article Content *</label>
                <textarea className="form-textarea" required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your full article here..." style={{ minHeight: 240 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input className="form-input" type="url" value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="funding, startup, event" />
              </div>
            </div>

            <div style={{ marginTop: 8, padding: 16, background: 'rgba(255,107,53,0.06)', borderRadius: 10, border: '1px solid rgba(255,107,53,0.15)', marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                📋 All submissions are reviewed by our team before publishing. You&apos;ll receive an email once your article is live.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }}>
              {loading ? 'Submitting...' : '🚀 Submit for Review'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
