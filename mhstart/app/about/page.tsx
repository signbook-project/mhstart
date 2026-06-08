import { supabase } from '@/lib/supabase'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import Link from 'next/link'

export const revalidate = 3600

export default async function AboutPage() {
  const { data } = await supabase.from('settings').select('value').eq('key', 'site').single()
  const site = data?.value || {}

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(160deg, var(--navy-dark), var(--navy) 60%, #1a3a7a)', padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent 70%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 680 }}>
              <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>About Us</div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 56px)', color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
                Powering Maharashtra&apos;s Startup Revolution
              </h1>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                {site.about || 'MHStart is the premier platform connecting startups, incubators, investors, and enablers across Maharashtra — building a thriving innovation ecosystem.'}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: '80px 0', background: 'white' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              <div>
                <div className="section-eyebrow">Our Mission</div>
                <h2 className="section-title" style={{ marginBottom: 24 }}>Building the Bridge Between Ideas and Opportunity</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20, fontSize: 16 }}>
                  Maharashtra has always been at the forefront of India&apos;s economic growth — from Mumbai&apos;s financial district to Pune&apos;s thriving tech corridor. Yet many innovators across the state remain unconnected to the resources they need.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                  MHStart bridges this gap by creating a unified platform where startups can be discovered, enablers can offer their services, and the entire ecosystem can collaborate to build Maharashtra&apos;s startup future.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { icon: '🚀', title: 'Discover', desc: 'Find startups and enablers across all 36 districts of Maharashtra' },
                  { icon: '🤝', title: 'Connect', desc: 'Network with founders, investors and ecosystem builders' },
                  { icon: '📰', title: 'Stay Informed', desc: 'Latest news, funding rounds and ecosystem events' },
                  { icon: '🗺️', title: 'Map It', desc: 'Visual ecosystem map showing the full startup landscape' },
                ].map(item => (
                  <div key={item.title} style={{ background: 'var(--gray-50)', borderRadius: 14, padding: 24 }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: 'var(--navy)', marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Maharashtra focus */}
        <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--cream), white)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow">Maharashtra First</div>
            <h2 className="section-title" style={{ margin: '0 auto 20px', maxWidth: 600 }}>Representing Every Corner of Maharashtra</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 56px' }}>From Mumbai&apos;s financial hub to Nagpur&apos;s smart city to the agri-innovation in Aurangabad — we represent the entire state.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
              {['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Solapur', 'Thane', 'Navi Mumbai', 'Amravati', 'Latur', 'Satara'].map(city => (
                <div key={city} style={{ background: 'white', borderRadius: 10, padding: '12px 8px', fontSize: 13, fontWeight: 600, color: 'var(--navy)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
                  📍 {city}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 0', background: 'var(--navy)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 4vw, 44px)', color: 'white', marginBottom: 16 }}>Ready to Join the Ecosystem?</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 36, fontSize: 17 }}>List your startup or organization and be part of Maharashtra&apos;s growing innovation story.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/submit" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Add Your Listing</Link>
              <Link href="/contact" className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: 16, padding: '14px 32px' }}>Get in Touch</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 768px) {
          section > .container > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section > .container > div[style*="grid-template-columns: repeat(6"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
