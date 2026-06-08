import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, var(--navy-dark), var(--navy))',
        paddingTop: 'var(--nav-height)',
      }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{
            fontSize: 120, fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1, marginBottom: 16,
          }}>404</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, color: 'white', marginBottom: 16 }}>
            Page Not Found
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 17, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Looks like this page took a wrong turn. Let&apos;s get you back to the ecosystem.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-primary" style={{ fontSize: 16, padding: '12px 28px' }}>← Go Home</Link>
            <Link href="/map" className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: 16, padding: '12px 28px' }}>🗺️ Explore Map</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
