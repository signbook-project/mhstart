'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, listings: 0, people: 0, contacts: 0, pendingNews: 0, pendingListings: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/news').then(r => r.json()),
      fetch('/api/admin/listings').then(r => r.json()),
      fetch('/api/admin/people').then(r => r.json()),
      fetch('/api/admin/contacts').then(r => r.json()),
    ]).then(([news, listings, people, contacts]) => {
      setStats({
        news: news.data?.length || 0,
        listings: listings.data?.length || 0,
        people: people.data?.length || 0,
        contacts: contacts.data?.length || 0,
        pendingNews: news.data?.filter((n: any) => n.status === 'pending').length || 0,
        pendingListings: listings.data?.filter((l: any) => l.status === 'pending').length || 0,
      })
    }).catch(() => {})
  }, [])

  const statCards = [
    { label: 'Total News', value: stats.news, pending: stats.pendingNews, icon: '📰', href: '/admin/news', color: 'var(--saffron)' },
    { label: 'Map Listings', value: stats.listings, pending: stats.pendingListings, icon: '🗺️', href: '/admin/listings', color: 'var(--navy)' },
    { label: 'People', value: stats.people, pending: 0, icon: '👥', href: '/admin/people', color: 'var(--green)' },
    { label: 'Contact Messages', value: stats.contacts, pending: 0, icon: '📬', href: '/admin/contacts', color: 'var(--gold)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'var(--navy)' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Welcome back. Here&apos;s what&apos;s happening on MHStart.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {statCards.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--gray-400)', fontWeight: 600, marginBottom: 8 }}>{s.label}</p>
                  <p style={{ fontSize: 36, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</p>
                </div>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
              </div>
              {s.pending > 0 && (
                <div style={{ marginTop: 12, display: 'inline-block', background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {s.pending} pending review
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: '/admin/news?action=new', label: '+ Add News Article', icon: '📰' },
              { href: '/admin/news-senders?action=new', label: '+ Add News Sender', icon: '✉️' },
              { href: '/admin/listings?action=new', label: '+ Add Map Listing', icon: '📍' },
              { href: '/admin/people?action=new', label: '+ Add Person', icon: '👤' },
              { href: '/admin/homepage', label: '✏️ Edit Homepage', icon: '🏠' },
            ].map(a => (
              <Link key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--gray-50)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, transition: 'background 0.15s' }}>
                <span>{a.icon}</span> {a.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', marginBottom: 20 }}>Getting Started</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { step: '1', text: 'Visit /api/admin/setup to create first admin user', done: true },
              { step: '2', text: 'Configure SMTP settings for email', done: false },
              { step: '3', text: 'Add your first map listings', done: false },
              { step: '4', text: 'Edit homepage content', done: false },
              { step: '5', text: 'Add team members in People section', done: false },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.done ? 'var(--green)' : 'var(--gray-200)', color: item.done ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{item.done ? '✓' : item.step}</div>
                <p style={{ fontSize: 13, color: item.done ? 'var(--gray-400)' : 'var(--text-primary)', marginTop: 2, textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
