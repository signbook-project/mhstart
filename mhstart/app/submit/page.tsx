'use client'
import { useState } from 'react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import toast from 'react-hot-toast'

const SECTORS = ['AgriTech', 'EdTech', 'FinTech', 'HealthTech', 'CleanTech', 'E-Commerce', 'Logistics', 'AI/ML', 'SaaS', 'D2C', 'Manufacturing', 'Media', 'Gaming', 'Other']
const TYPES = [
  { value: 'startup', label: '🚀 Startup' },
  { value: 'incubator', label: '🏢 Incubator' },
  { value: 'vc', label: '💰 VC / Investor' },
  { value: 'accelerator', label: '⚡ Accelerator' },
  { value: 'angel', label: '👼 Angel Network' },
  { value: 'government', label: '🏛️ Government Body' },
  { value: 'corporate', label: '🏗️ Corporate' },
  { value: 'other', label: '🔵 Other' },
]
const STAGES = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Growth', 'Profitable']

export default function SubmitListingPage() {
  const [form, setForm] = useState({
    type: 'startup', name: '', tagline: '', description: '',
    contact_name: '', email: '', phone: '', website: '',
    address: '', city: '', district: '', lat: '', lng: '',
    founded_year: '', team_size: '', stage: '',
    sector: [] as string[], linkedin: '', twitter: '', instagram: '',
    logo_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleSector = (s: string) => {
    setForm(f => ({
      ...f, sector: f.sector.includes(s) ? f.sector.filter(x => x !== s) : [...f.sector, s]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/listings/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lat: form.lat ? parseFloat(form.lat) : null, lng: form.lng ? parseFloat(form.lng) : null })
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  if (submitted) return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center', background: 'white', borderRadius: 20, padding: 56, maxWidth: 500, boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'var(--navy)', marginBottom: 12 }}>Listing Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Your listing has been submitted for review. Once approved, it will appear on our ecosystem map.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/map" className="btn btn-primary">View Map</a>
            <a href="/" className="btn btn-outline">Go Home</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'calc(var(--nav-height) + 48px)', background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ marginBottom: 36 }}>
            <div className="section-eyebrow">📍 Add Listing</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, color: 'var(--navy)', marginBottom: 10 }}>Join the Ecosystem Map</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Add your startup, incubator, VC firm, or organization to Maharashtra&apos;s ecosystem map.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 20, padding: 40, boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Section title="Organization Type">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, type: t.value }))}
                    style={{
                      padding: '12px 8px', borderRadius: 10, border: '2px solid',
                      borderColor: form.type === t.value ? 'var(--saffron)' : 'var(--gray-200)',
                      background: form.type === t.value ? 'rgba(255,107,53,0.06)' : 'white',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600, textAlign: 'center',
                      color: form.type === t.value ? 'var(--saffron)' : 'var(--text-secondary)',
                      transition: 'all 0.15s',
                    }}>{t.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Basic Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Organization Name *</label>
                  <input className="form-input" required value={form.name} onChange={set('name')} placeholder="Your startup / organization name" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Tagline</label>
                  <input className="form-input" value={form.tagline} onChange={set('tagline')} placeholder="One line description" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={set('description')} placeholder="Tell us about your organization..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Logo URL</label>
                  <input className="form-input" type="url" value={form.logo_url} onChange={set('logo_url')} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-input" type="url" value={form.website} onChange={set('website')} placeholder="https://..." />
                </div>
                {form.type === 'startup' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Stage</label>
                      <select className="form-select" value={form.stage} onChange={set('stage')}>
                        <option value="">Select stage</option>
                        {STAGES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Team Size</label>
                      <select className="form-select" value={form.team_size} onChange={set('team_size')}>
                        <option value="">Select size</option>
                        {['1-5', '6-15', '16-50', '51-200', '200+'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label className="form-label">Founded Year</label>
                  <input className="form-input" type="number" min="1900" max={new Date().getFullYear()} value={form.founded_year} onChange={set('founded_year')} placeholder="2020" />
                </div>
              </div>
            </Section>

            <Section title="Sectors">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SECTORS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSector(s)} style={{
                    padding: '6px 14px', borderRadius: 20, border: '1.5px solid',
                    borderColor: form.sector.includes(s) ? 'var(--saffron)' : 'var(--gray-200)',
                    background: form.sector.includes(s) ? 'rgba(255,107,53,0.1)' : 'white',
                    color: form.sector.includes(s) ? 'var(--saffron-dark)' : 'var(--text-secondary)',
                    fontSize: 13, cursor: 'pointer', fontWeight: 500,
                  }}>{s}</button>
                ))}
              </div>
            </Section>

            <Section title="Contact Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Contact Name *</label>
                  <input className="form-input" required value={form.contact_name} onChange={set('contact_name')} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" required value={form.email} onChange={set('email')} placeholder="contact@company.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                </div>
              </div>
            </Section>

            <Section title="Location">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Address</label>
                  <input className="form-input" value={form.address} onChange={set('address')} placeholder="Full address" />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" required value={form.city} onChange={set('city')} placeholder="Mumbai, Pune, Nagpur..." />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input className="form-input" value={form.district} onChange={set('district')} placeholder="District" />
                </div>
                <div className="form-group">
                  <label className="form-label">Latitude (for map pin)</label>
                  <input className="form-input" type="number" step="any" value={form.lat} onChange={set('lat')} placeholder="e.g. 19.0760" />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude (for map pin)</label>
                  <input className="form-input" type="number" step="any" value={form.lng} onChange={set('lng')} placeholder="e.g. 72.8777" />
                </div>
                <p style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--gray-400)' }}>
                  💡 Tip: Search your address on <a href="https://maps.google.com" target="_blank" style={{ color: 'var(--saffron)' }}>Google Maps</a> and right-click to get coordinates.
                </p>
              </div>
            </Section>

            <Section title="Social Links" last>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input className="form-input" type="url" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Twitter URL</label>
                  <input className="form-input" type="url" value={form.twitter} onChange={set('twitter')} placeholder="https://twitter.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Instagram URL</label>
                  <input className="form-input" type="url" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
                </div>
              </div>
            </Section>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: 16 }}>
              {loading ? 'Submitting...' : '🚀 Submit for Review'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 28 : 0, paddingBottom: 32, borderBottom: last ? 'none' : '1px solid var(--gray-100)', marginTop: 28 }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: 'var(--navy)', marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  )
}
