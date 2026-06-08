import { supabase } from '@/lib/supabase'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import Link from 'next/link'
import Image from 'next/image'

async function getHomepageData() {
  const [settingsRes, newsRes, listingsRes, spotlightRes, bannersRes] = await Promise.all([
    supabase.from('settings').select('*'),
    supabase.from('news').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(6),
    supabase.from('map_listings').select('id,name,type,tagline,logo_url,city,sector').eq('status', 'active').limit(40),
    supabase.from('spotlight').select('*, listing:map_listings(*)').eq('is_active', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('banners').select('*').eq('is_active', true).order('order_index'),
  ])

  const settings: Record<string, any> = {}
  settingsRes.data?.forEach((s: any) => { settings[s.key] = s.value })

  return {
    settings,
    news: newsRes.data || [],
    listings: listingsRes.data || [],
    spotlight: spotlightRes.data?.[0] || null,
    banners: bannersRes.data || [],
  }
}

export const revalidate = 60

export default async function HomePage() {
  const { settings, news, listings, spotlight, banners } = await getHomepageData()
  const site = settings.site || {}
  const homepage = settings.homepage || {}

  const typeLabels: Record<string, string> = {
    startup: 'Startup', incubator: 'Incubator', vc: 'VC', accelerator: 'Accelerator',
    angel: 'Angel', government: 'Government', corporate: 'Corporate', other: 'Other'
  }

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 50%, #1A3A6B 100%)',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
            top: -200, right: -100,
          }} />
          <div style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%)',
            bottom: -100, left: 100,
          }} />
          {/* Geometric motif */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 1, height: '30%',
              background: 'rgba(255,255,255,0.03)',
              left: `${12 + i * 11}%`,
              top: '10%',
              transform: `rotate(${i % 2 === 0 ? 15 : -15}deg)`,
            }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 120, paddingBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: 'var(--saffron)', textTransform: 'uppercase' }}>Maharashtra&apos;s Startup Hub</span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 64px)',
                color: 'white', lineHeight: 1.15, marginBottom: 24,
              }}>
                {homepage.hero_title || "Building Maharashtra's\nStartup Future"}
              </h1>

              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
                {homepage.hero_subtitle || 'Connecting founders, investors, incubators, and enablers across the state. Discover. Connect. Grow.'}
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link href="/map" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                  🗺️ Explore Map
                </Link>
                <Link href="/submit" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', fontSize: 16, padding: '14px 32px' }}>
                  + Add Your Startup
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { num: listings.filter(l => l.type === 'startup').length || '100+', label: 'Startups' },
                  { num: listings.filter(l => l.type !== 'startup').length || '50+', label: 'Enablers' },
                  { num: news.length || '200+', label: 'News Stories' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--gold-light)', fontFamily: 'var(--font-display)' }}>{stat.num}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 1 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side graphic */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 360, height: 360, borderRadius: '50%',
                border: '2px solid rgba(255,107,53,0.3)',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 260, height: 260, borderRadius: '50%',
                  border: '2px solid rgba(212,160,23,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(212,160,23,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 64, fontFamily: 'var(--font-display)',
                  }}>🚀</div>
                </div>
                {/* Orbiting dots */}
                {['💡', '🏢', '💰', '🌟'].map((emoji, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                    top: `${50 + 45 * Math.sin(i * Math.PI / 2)}%`,
                    left: `${50 + 45 * Math.cos(i * Math.PI / 2)}%`,
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>{emoji}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: 24, height: 40, border: '2px solid rgba(255,255,255,0.3)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: 'var(--saffron)', borderRadius: 2, animation: 'scroll-dot 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* ===== TICKER ===== */}
      {listings.length > 0 && (
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {[...listings, ...listings].map((l, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-dot" />
                <span style={{ fontWeight: 700 }}>{l.name}</span>
                <span className={`badge badge-${l.type === 'startup' ? 'saffron' : 'navy'}`} style={{ fontSize: 11 }}>
                  {typeLabels[l.type] || l.type}
                </span>
                {l.city && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{l.city}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== SPOTLIGHT ===== */}
      {spotlight && (
        <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--cream) 0%, white 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)' }} />
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <div>
                <div className="section-eyebrow">⭐ Startup Spotlight</div>
                <h2 className="section-title">Startup of the Week</h2>
                <div style={{
                  marginTop: 32, background: 'white', borderRadius: 16,
                  padding: 32, boxShadow: 'var(--shadow-lg)',
                  borderLeft: '4px solid var(--saffron)',
                }}>
                  {spotlight.listing?.logo_url && (
                    <img src={spotlight.listing.logo_url} alt="logo" style={{ height: 48, objectFit: 'contain', marginBottom: 16 }} />
                  )}
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)', marginBottom: 8 }}>
                    {spotlight.custom_title || spotlight.listing?.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                    {spotlight.custom_description || spotlight.listing?.tagline}
                  </p>
                  {spotlight.listing?.sector?.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {spotlight.listing.sector.map((s: string) => (
                        <span key={s} className="badge badge-navy">{s}</span>
                      ))}
                    </div>
                  )}
                  {spotlight.listing && (
                    <Link href={`/map?id=${spotlight.listing.id}`} className="btn btn-primary">
                      View Profile →
                    </Link>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 320, height: 320, borderRadius: 24,
                  background: spotlight.custom_image || spotlight.listing?.logo_url
                    ? `url(${spotlight.custom_image || spotlight.listing?.logo_url}) center/contain no-repeat`
                    : 'linear-gradient(135deg, var(--saffron), var(--gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 80, boxShadow: 'var(--shadow-xl)',
                }}>
                  {!spotlight.custom_image && !spotlight.listing?.logo_url && '🚀'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== LATEST NEWS ===== */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <div className="section-eyebrow">📰 Latest News</div>
              <h2 className="section-title">Ecosystem Updates</h2>
              <p className="section-subtitle">Stay up to date with what&apos;s happening in Maharashtra&apos;s startup world.</p>
            </div>
            <Link href="/news" className="btn btn-outline">View All →</Link>
          </div>

          {news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
              <p>No news published yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {news.slice(0, 3).map((article: any, i: number) => (
                <Link key={article.id} href={`/news/${article.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="card" style={{ height: '100%', cursor: 'pointer' }}>
                    <div style={{
                      height: 200, overflow: 'hidden',
                      background: article.cover_image ? `url(${article.cover_image}) center/cover` : 'linear-gradient(135deg, var(--navy), var(--navy-light))',
                      position: 'relative',
                    }}>
                      {!article.cover_image && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📰</div>
                      )}
                    </div>
                    <div style={{ padding: '20px 24px 24px' }}>
                      <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>
                        {new Date(article.published_at || article.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 10 }}>{article.title}</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {article.excerpt?.slice(0, 100)}...
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== MAP PREVIEW ===== */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-eyebrow">🗺️ Ecosystem Map</div>
            <h2 className="section-title">Startups Across Maharashtra</h2>
            <p className="section-subtitle" style={{ margin: '12px auto 32px' }}>
              Explore the growing network of startups, incubators, VCs and enablers on our interactive map.
            </p>
            <Link href="/map" className="btn btn-primary">Open Full Map</Link>
          </div>

          {/* Type counts grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 48 }}>
            {[
              { type: 'startup', icon: '🚀', label: 'Startups', color: 'var(--saffron)' },
              { type: 'incubator', icon: '🏢', label: 'Incubators', color: 'var(--navy)' },
              { type: 'vc', icon: '💰', label: 'VCs & Angels', color: 'var(--gold)' },
              { type: 'accelerator', icon: '⚡', label: 'Accelerators', color: 'var(--green)' },
            ].map(t => {
              const count = listings.filter(l => l.type === t.type || (t.type === 'vc' && (l.type === 'vc' || l.type === 'angel'))).length
              return (
                <div key={t.type} style={{
                  background: 'white', borderRadius: 16, padding: '28px 24px', textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)', border: `1px solid ${t.color}22`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: t.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{count || '—'}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>{t.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23FF6B35' fill-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Get in Touch</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 48px)', color: 'white', marginBottom: 16 }}>
            Part of Maharashtra&apos;s Ecosystem?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, maxWidth: 540, margin: '0 auto 40px' }}>
            List your startup or organization on MHStart and get discovered by investors, partners, and collaborators.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/submit" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>+ Add Your Listing</Link>
            <Link href="/contact" className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: 16, padding: '14px 32px' }}>Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes scroll-dot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(16px); opacity: 0; }
        }
        @media (max-width: 768px) {
          section > .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > .container > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          section > .container > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}
