'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<'smtp' | 'password' | 'about'>('smtp')
  const [smtp, setSmtp] = useState({ host: '', port: 587, user: '', pass: '', from: '' })
  const [pw, setPw] = useState({ current_password: '', new_password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [smtpLoaded, setSmtpLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.data?.smtp) setSmtp({ host: '', port: 587, user: '', pass: '', from: '', ...d.data.smtp })
        setSmtpLoaded(true)
      })
  }, [])

  const saveSmtp = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'smtp', value: smtp }),
    })
    if (res.ok) toast.success('SMTP settings saved!')
    else toast.error('Failed to save')
    setSaving(false)
  }

  const testSmtp = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: smtp.user }),
    })
    if (res.ok) toast.success('Test email sent! Check your inbox.')
    else toast.error('Test failed — check SMTP settings.')
    setSaving(false)
  }

  const changePassword = async () => {
    if (pw.new_password !== pw.confirm) { toast.error('Passwords do not match'); return }
    if (pw.new_password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSaving(true)
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: pw.current_password, new_password: pw.new_password }),
    })
    if (res.ok) {
      toast.success('Password changed successfully!')
      setPw({ current_password: '', new_password: '', confirm: '' })
    } else {
      const d = await res.json()
      toast.error(d.error || 'Failed to change password')
    }
    setSaving(false)
  }

  const tabs = [
    { id: 'smtp', label: '📧 Email / SMTP' },
    { id: 'password', label: '🔒 Change Password' },
    { id: 'about', label: 'ℹ️ System Info' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>Configure email, security, and system settings</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--gray-100)', borderRadius: 12, padding: 4, maxWidth: 560 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: tab === t.id ? 'white' : 'transparent',
            color: tab === t.id ? 'var(--navy)' : 'var(--text-secondary)',
            boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── SMTP ── */}
      {tab === 'smtp' && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)', maxWidth: 640 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>Email / SMTP Configuration</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            Used for sending password reset emails and admin notifications. Supports Gmail, Outlook, or any SMTP provider.
          </p>

          {!smtpLoaded ? (
            <div style={{ color: 'var(--gray-400)', padding: 20 }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">SMTP Host</label>
                <input className="form-input" value={smtp.host} onChange={e => setSmtp(s => ({ ...s, host: e.target.value }))} placeholder="smtp.gmail.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Port</label>
                <select className="form-select" value={smtp.port} onChange={e => setSmtp(s => ({ ...s, port: parseInt(e.target.value) }))}>
                  <option value={587}>587 (TLS — recommended)</option>
                  <option value={465}>465 (SSL)</option>
                  <option value={25}>25 (plain)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">From Name / Email</label>
                <input className="form-input" value={smtp.from} onChange={e => setSmtp(s => ({ ...s, from: e.target.value }))} placeholder="MHStart <noreply@mhstart.com>" />
              </div>
              <div className="form-group">
                <label className="form-label">SMTP Username / Email</label>
                <input className="form-input" type="email" value={smtp.user} onChange={e => setSmtp(s => ({ ...s, user: e.target.value }))} placeholder="your@gmail.com" />
              </div>
              <div className="form-group">
                <label className="form-label">SMTP Password / App Password</label>
                <input className="form-input" type="password" value={smtp.pass} onChange={e => setSmtp(s => ({ ...s, pass: e.target.value }))} placeholder="••••••••••••••••" />
              </div>
            </div>
          )}

          <div style={{ padding: 16, background: 'rgba(212,160,23,0.08)', borderRadius: 10, border: '1px solid rgba(212,160,23,0.2)', marginBottom: 24, marginTop: 4 }}>
            <p style={{ fontSize: 13, color: '#7A5C00' }}>
              💡 <strong>Gmail users:</strong> Enable 2FA and create an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: 'var(--saffron)' }}>App Password</a> instead of your regular password.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={saveSmtp} disabled={saving}>{saving ? 'Saving...' : '💾 Save SMTP Settings'}</button>
            <button className="btn btn-outline" onClick={testSmtp} disabled={saving || !smtp.user}>📤 Send Test Email</button>
          </div>
        </div>
      )}

      {/* ── Password ── */}
      {tab === 'password' && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)', maxWidth: 480 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>Change Admin Password</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            Update your admin panel password. Make it strong — at least 8 characters with letters and numbers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={pw.current_password} onChange={e => setPw(p => ({ ...p, current_password: e.target.value }))} autoComplete="current-password" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={pw.new_password} onChange={e => setPw(p => ({ ...p, new_password: e.target.value }))} autoComplete="new-password" />
              {pw.new_password && pw.new_password.length < 8 && (
                <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>⚠️ Too short — minimum 8 characters</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
              {pw.confirm && pw.new_password !== pw.confirm && (
                <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>⚠️ Passwords do not match</p>
              )}
              {pw.confirm && pw.new_password === pw.confirm && pw.confirm.length >= 8 && (
                <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>✅ Passwords match</p>
              )}
            </div>
            <button
              className="btn btn-primary"
              onClick={changePassword}
              disabled={saving || !pw.current_password || !pw.new_password || pw.new_password !== pw.confirm}
              style={{ alignSelf: 'flex-start' }}
            >
              {saving ? 'Updating...' : '🔒 Update Password'}
            </button>
          </div>
        </div>
      )}

      {/* ── System Info ── */}
      {tab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 20 }}>System Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Platform', value: 'Next.js 14 (App Router)' },
                { label: 'Database', value: 'Supabase (PostgreSQL)' },
                { label: 'Hosting', value: 'Vercel (Free Tier)' },
                { label: 'Admin Login', value: 'admin@mhstart.com' },
                { label: 'Setup Endpoint', value: '/api/admin/setup (run once to create admin)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16, paddingBottom: 16, borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: 160, fontSize: 13, fontWeight: 700, color: 'var(--gray-400)', flexShrink: 0 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: item.label === 'Setup Endpoint' ? 'monospace' : 'inherit' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 20 }}>Required Environment Variables</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'NEXT_PUBLIC_SUPABASE_URL',
                'NEXT_PUBLIC_SUPABASE_ANON_KEY',
                'SUPABASE_SERVICE_ROLE_KEY',
                'JWT_SECRET',
                'NEXT_PUBLIC_SITE_URL',
              ].map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', flexShrink: 0 }} />
                  <code style={{ fontSize: 13, color: 'var(--navy)', fontFamily: 'monospace' }}>{v}</code>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 16 }}>
              Set these in your Vercel project under Settings → Environment Variables, or in a <code>.env.local</code> file for local development.
            </p>
          </div>

          <div style={{ background: 'rgba(255,107,53,0.06)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,107,53,0.15)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: 'var(--saffron-dark)', marginBottom: 8 }}>🚀 First Time Setup?</h4>
            <ol style={{ paddingLeft: 20, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 2 }}>
              <li>Deploy to Vercel and connect your Supabase project</li>
              <li>Run the SQL schema from <code>supabase-schema.sql</code> in Supabase SQL Editor</li>
              <li>Visit <code>/api/admin/setup</code> once to create the admin user</li>
              <li>Log in at <code>/admin/login</code> with <strong>admin@mhstart.com</strong></li>
              <li>Configure SMTP settings above to enable email notifications</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
