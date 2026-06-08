import { supabase } from '@/lib/supabase'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export const revalidate = 60

const CATEGORIES = [
  { key: 'team', label: 'Core Team', icon: '👥', color: 'var(--saffron)' },
  { key: 'founding_member', label: 'Founding Members', icon: '🌟', color: 'var(--gold)' },
  { key: 'advisor', label: 'Advisors', icon: '💡', color: 'var(--navy)' },
  { key: 'supported_by', label: 'Supported By', icon: '🤝', color: 'var(--green)' },
  { key: 'partner', label: 'Partners', icon: '🔗', color: 'var(--earth)' },
]

export default async function PeoplePage() {
  const { data: people } = await supabase.from('people').select('*').eq('is_active', true).order('order_index').order('created_at')
  const byCategory: Record<string, any[]> = {}
  people?.forEach((p: any) => {
    if (!byCategory[p.category]) byCategory[p.category] = []
    byCategory[p.category].push(p)
  })

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)' }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', padding: '100px 0 64px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>👥 Our People</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 56px)', color: 'white', marginBottom: 16 }}>The Faces Behind MHStart</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
              Meet the dedicated team, advisors, and supporters building Maharashtra&apos;s startup ecosystem together.
            </p>
          </div>
        </section>

        <div style={{ background: 'var(--gray-50)', padding: '64px 0' }}>
          <div className="container">
            {CATEGORIES.map(cat => {
              const members = byCategory[cat.key]
              if (!members?.length) return null
              return (
                <section key={cat.key} style={{ marginBottom: 72 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
                    <div style={{ fontSize: 28 }}>{cat.icon}</div>
                    <div>
                      <div className="section-eyebrow">{cat.label}</div>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'var(--navy)', marginTop: 4 }}>{cat.label}</h2>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                    {members.map((person: any) => (
                      <PersonCard key={person.id} person={person} accentColor={cat.color} />
                    ))}
                  </div>
                </section>
              )
            })}

            {Object.keys(byCategory).length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
                <p style={{ fontSize: 18 }}>People profiles coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function PersonCard({ person: p, accentColor }: { person: any; accentColor: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
      border: '1px solid var(--gray-100)',
    }}>
      <div style={{ height: 6, background: accentColor }} />
      <div style={{ padding: '24px 20px 20px', textAlign: 'center' }}>
        {p.photo_url ? (
          <img src={p.photo_url} alt={p.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentColor}`, marginBottom: 14 }} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 14px', color: 'white', fontFamily: 'var(--font-heading)' }}>
            {p.name.charAt(0)}
          </div>
        )}
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: 'var(--navy)', marginBottom: 4 }}>{p.name}</h3>
        {p.role && <p style={{ fontSize: 13, color: accentColor, fontWeight: 600, marginBottom: 4 }}>{p.role}</p>}
        {p.organization && <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 10 }}>{p.organization}</p>}
        {p.bio && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{p.bio.slice(0, 140)}{p.bio.length > 140 ? '...' : ''}</p>}
        {(p.linkedin || p.twitter || p.website) && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--saffron)', textDecoration: 'none', padding: '4px 10px', background: 'rgba(255,107,53,0.08)', borderRadius: 6 }}>in</a>}
            {p.twitter && <a href={p.twitter} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--saffron)', textDecoration: 'none', padding: '4px 10px', background: 'rgba(255,107,53,0.08)', borderRadius: 6 }}>𝕏</a>}
            {p.website && <a href={p.website} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--saffron)', textDecoration: 'none', padding: '4px 10px', background: 'rgba(255,107,53,0.08)', borderRadius: 6 }}>🌐</a>}
          </div>
        )}
      </div>
    </div>
  )
}
