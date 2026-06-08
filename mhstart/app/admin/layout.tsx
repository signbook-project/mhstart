'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

type AdminUser = { id: string; email: string; name: string }

const NAV = [
  { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/admin/news', icon: '📰', label: 'News' },
  { href: '/admin/listings', icon: '🗺️', label: 'Map Listings' },
  { href: '/admin/people', icon: '👥', label: 'People' },
  { href: '/admin/homepage', icon: '🏠', label: 'Homepage' },
  { href: '/admin/contacts', icon: '📬', label: 'Contacts' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    fetch('/api/admin/me')
      .then(r => {
        if (r.status === 401) { router.push('/admin/login'); return null }
        return r.json()
      })
      .then(d => { if (d?.data) setAdminUser(d.data) })
  }, [isLoginPage])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    toast.success('Logged out')
  }

  if (isLoginPage) return <>{children}</>

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: collapsed ? 72 : 260, transition: 'width 0.2s' }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '24px 16px' : '24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--saffron), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontFamily: 'var(--font-display)', color: 'white', flexShrink: 0 }}>MH</div>
          {!collapsed && <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'white', whiteSpace: 'nowrap' }}>MHStart</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5 }}>ADMIN PANEL</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px' : '10px 14px',
                borderRadius: 10, marginBottom: 4, textDecoration: 'none',
                background: active ? 'rgba(255,107,53,0.2)' : 'transparent',
                color: active ? 'var(--saffron-light)' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 4, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span>🌐</span>{!collapsed && 'View Site'}
          </Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 14, width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span>🚪</span>{!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="admin-content" style={{ marginLeft: collapsed ? 72 : 260, transition: 'margin-left 0.2s' }}>
        <div className="admin-topbar">
          <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--gray-400)', padding: 4 }}>
            {collapsed ? '→' : '←'}
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 700 }}>
              {(adminUser?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{adminUser?.name || 'Admin'}</span>
          </div>
        </div>
        <div className="admin-main">
          {children}
        </div>
      </div>
    </div>
  )
}
