'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@mhstart.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  // Redirect to admin if already logged in
  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => { if (r.ok) router.replace('/admin') })
      .finally(() => setChecking(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) { toast.error('Invalid credentials'); return }
      router.push('/admin')
    } catch {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 60%, #1a3a7a 100%)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,107,53,0.3)', borderTopColor: 'var(--saffron)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 60%, #1a3a7a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.1), transparent 70%)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontFamily: 'var(--font-display)', color: 'white',
            boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
          }}>MH</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white' }}>MHStart</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>Admin Panel</p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--navy)', marginBottom: 28, textAlign: 'center' }}>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 14, fontSize: 15 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--gray-400)' }}>
            <a href="/" style={{ color: 'var(--saffron)', textDecoration: 'none' }}>← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  )
}
