'use client'
import Footer from '@/components/public/Footer'
import Navbar from '@/components/public/Navbar'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      setDone(true)
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        <section style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', padding: '80px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Contact</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 5vw, 52px)', color: 'white' }}>Get in Touch</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginTop: 12 }}>We&apos;d love to hear from you. Reach out for partnerships, queries or just to say hello!</p>
          </div>
        </section>

        <div style={{ background: 'var(--gray-50)', padding: '64px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
              {/* Info */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, color: 'var(--navy)', marginBottom: 28 }}>Contact Info</h2>
                {[
                  { icon: '📧', label: 'Email', value: 'build@mhstart.com', href: 'mailto:build@mhstart.com' },
                  { icon: '📞', label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: '📍', label: 'Location', value: 'Maharashtra, India', href: null },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', letterSpacing: 1, marginBottom: 2 }}>{item.label.toUpperCase()}</p>
                      {item.href ? (
                        <a href={item.href} style={{ color: 'var(--saffron)', fontWeight: 600, textDecoration: 'none' }}>{item.value}</a>
                      ) : (
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 32, padding: 20, background: 'white', borderRadius: 14, boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--saffron)' }}>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    🕐 Our team typically responds within 24 hours on business days.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div>
                {done ? (
                  <div style={{ textAlign: 'center', background: 'white', borderRadius: 20, padding: 56, boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, color: 'var(--navy)', marginBottom: 10 }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We&apos;ll get back to you soon.</p>
                    <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setDone(false)}>Send Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 20, padding: 40, boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="form-group">
                        <label className="form-label">Your Name *</label>
                        <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input className="form-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Message *</label>
                        <textarea className="form-textarea" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ minHeight: 150 }} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: 14 }}>
                      {loading ? 'Sending...' : '📨 Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 2fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
