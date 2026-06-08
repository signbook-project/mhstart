import { supabase } from '@/lib/supabase'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  // Related news
  const { data: related } = await supabase
    .from('news')
    .select('id,title,slug,cover_image,published_at,excerpt')
    .eq('status', 'published')
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', background: 'var(--gray-50)', minHeight: '100vh' }}>
        {/* Article Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', padding: '60px 0 80px' }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <Link href="/news" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              ← Back to News
            </Link>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              {article.tags?.map((tag: string) => (
                <span key={tag} className="badge badge-saffron" style={{ background: 'rgba(255,107,53,0.2)', color: 'var(--saffron-light)' }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 4vw, 44px)', color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
                {new Date(article.published_at || article.created_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              {article.author_name && (
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>By {article.author_name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {article.cover_image && (
          <div style={{ maxWidth: 860, margin: '-40px auto 0', padding: '0 24px' }}>
            <img src={article.cover_image} alt={article.title} style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 16, boxShadow: 'var(--shadow-xl)' }} />
          </div>
        )}

        {/* Content */}
        <div className="container" style={{ maxWidth: 860, padding: '48px 24px 80px' }}>
          <div style={{
            background: 'white', borderRadius: 16, padding: '48px',
            boxShadow: 'var(--shadow-sm)',
            fontSize: 17, lineHeight: 1.8, color: 'var(--text-primary)',
          }}>
            {article.excerpt && (
              <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.6, marginBottom: 32, paddingBottom: 32, borderBottom: '2px solid var(--gray-100)' }}>
                {article.excerpt}
              </p>
            )}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
          </div>

          {/* Share */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--gray-400)', fontWeight: 600 }}>Share:</span>
            {['Twitter', 'LinkedIn', 'WhatsApp'].map(platform => (
              <a key={platform} href="#" style={{
                padding: '8px 16px', background: 'white', borderRadius: 8,
                fontSize: 13, fontWeight: 600, color: 'var(--navy)', textDecoration: 'none',
                border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)',
              }}>{platform}</a>
            ))}
          </div>
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <div style={{ background: 'white', padding: '60px 0' }}>
            <div className="container">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--navy)', marginBottom: 32 }}>More Stories</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {related.map((r: any) => (
                  <Link key={r.id} href={`/news/${r.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="card">
                      <div style={{ height: 160, background: r.cover_image ? `url(${r.cover_image}) center/cover` : 'linear-gradient(135deg, var(--navy), var(--navy-light))' }} />
                      <div style={{ padding: '16px 20px 20px' }}>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>
                          {new Date(r.published_at || r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: 'var(--navy)', lineHeight: 1.4 }}>{r.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style>{`
        .article-content h1, .article-content h2, .article-content h3 {
          font-family: var(--font-heading);
          color: var(--navy);
          margin: 1.5em 0 0.5em;
        }
        .article-content p { margin-bottom: 1.2em; }
        .article-content img { max-width: 100%; border-radius: 10px; margin: 1em 0; }
        .article-content a { color: var(--saffron); }
        .article-content ul, .article-content ol { padding-left: 1.5em; margin-bottom: 1em; }
        .article-content blockquote {
          border-left: 4px solid var(--saffron);
          padding-left: 20px;
          color: var(--text-secondary);
          font-style: italic;
          margin: 1.5em 0;
        }
        @media (max-width: 600px) {
          .article-content { font-size: 15px; }
        }
      `}</style>
    </>
  )
}
