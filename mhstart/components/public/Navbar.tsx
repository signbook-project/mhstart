'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/news', label: 'News' },
  { href: '/map', label: 'Ecosystem Map' },
  { href: '/people', label: 'People' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 'var(--nav-height)',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid var(--gray-100)' : 'none',
      }}>
        <div className="container-wide" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: 'white',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 4px 12px rgba(255,107,53,0.35)',
            }}>MH</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: scrolled ? 'var(--navy)' : 'white', lineHeight: 1 }}>MHStart</div>
              <div style={{ fontSize: 10, color: scrolled ? 'var(--saffron)' : 'rgba(255,220,180,0.9)', letterSpacing: 1.5, fontWeight: 600 }}>MAHARASHTRA</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 16px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                color: pathname === link.href
                  ? 'var(--saffron)'
                  : scrolled ? 'var(--text-primary)' : 'rgba(255,255,255,0.9)',
                background: pathname === link.href ? 'rgba(255,107,53,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>{link.label}</Link>
            ))}
            <Link href="/submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13, marginLeft: 8 }}>
              + Add Listing
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setOpen(!open)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            display: 'none',
            flexDirection: 'column', gap: 5, alignItems: 'center',
          }} className="mobile-menu-btn">
            <span style={{ display: 'block', width: 24, height: 2, background: scrolled ? 'var(--navy)' : 'white', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: scrolled ? 'var(--navy)' : 'white', opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: scrolled ? 'var(--navy)' : 'white', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0, bottom: 0,
          background: 'rgba(6,24,64,0.98)', zIndex: 199,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
              padding: '14px 40px', borderRadius: 10, textDecoration: 'none',
              fontSize: 18, fontWeight: 600,
              color: pathname === link.href ? 'var(--saffron)' : 'white',
            }}>{link.label}</Link>
          ))}
          <Link href="/submit" className="btn btn-primary" onClick={() => setOpen(false)} style={{ marginTop: 16 }}>+ Add Listing</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
