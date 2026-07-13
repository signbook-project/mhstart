import Footer from '@/components/public/Footer';
import Navbar from '@/components/public/Navbar';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 60;

async function getNews() {
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return data || [];
}

export default async function NewsPage() {
  const news = await getNews();
  const pinned = news.filter((n: any) => n.is_pinned).slice(0, 2);
  const latest = news.filter((n: any) => !n.is_pinned);

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--navy-dark), var(--navy))",
          padding: "120px 0 64px",
          marginTop: "var(--nav-height)",
        }}
      >
        <div className="container">
          <div
            className="section-eyebrow"
            style={{ color: "var(--gold-light)" }}
          >
            📰 News & Updates
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(32px, 5vw, 56px)",
              color: "white",
              marginBottom: 16,
            }}
          >
            Ecosystem News
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 17,
              maxWidth: 560,
            }}
          >
            Latest news, funding announcements, events, and stories from
            Maharashtra&apos;s startup world.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link href="/news/submit" className="btn btn-primary">
              Submit Your News
            </Link>
          </div>
        </div>
      </section>

      <div
        style={{
          background: "var(--gray-50)",
          minHeight: "60vh",
          padding: "60px 0",
        }}
      >
        <div className="container">
          {/* Pinned */}
          {pinned.length > 0 && (
            <div style={{ marginBottom: 60 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: 18 }}>📌</span>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 22,
                    color: "var(--navy)",
                  }}
                >
                  Featured Stories
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: pinned.length > 1 ? "1fr 1fr" : "1fr",
                  gap: 28,
                }}
              >
                {pinned.map((article: any) => (
                  <NewsCard key={article.id} article={article} featured />
                ))}
              </div>
            </div>
          )}

          {/* Latest */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 22,
                color: "var(--navy)",
                marginBottom: 24,
              }}
            >
              Latest News
            </h2>
            {latest.length === 0 && pinned.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "var(--gray-400)",
                }}
              >
                <div style={{ fontSize: 56, marginBottom: 16 }}>📰</div>
                <p style={{ fontSize: 18 }}>
                  No news published yet. Be the first to submit!
                </p>
                <Link
                  href="/news/submit"
                  className="btn btn-primary"
                  style={{ marginTop: 20 }}
                >
                  Submit News
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                }}
              >
                {latest.map((article: any) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @media (max-width: 900px) {
          .news-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .news-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function NewsCard({ article, featured }: { article: any; featured?: boolean }) {
  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: "none" }}>
      <article className="card" style={{ height: "100%", cursor: "pointer" }}>
        <div
          style={{
            height: featured ? 260 : 200,
            overflow: "hidden",
            position: "relative",
            // background: article.cover_image ? `url(${article.cover_image}) center/cover` : 'linear-gradient(135deg, var(--navy), var(--navy-light))',
            background: article.cover_image
              ? `url(${article.cover_image}) center/contain no-repeat`
              : "linear-gradient(135deg, var(--navy), var(--navy-light))",
            backgroundColor: article.cover_image
              ? "var(--gray-100)"
              : undefined,
          }}
        >
          {!article.cover_image && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              📰
            </div>
          )}
          {article.is_pinned && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "var(--saffron)",
                color: "white",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              📌 FEATURED
            </div>
          )}
        </div>
        <div style={{ padding: "20px 24px 28px" }}>
          <p
            style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 8 }}
          >
            {new Date(
              article.published_at || article.created_at,
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {article.author_name && ` · ${article.author_name}`}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: featured ? 22 : 17,
              color: "var(--navy)",
              lineHeight: 1.3,
              marginBottom: 10,
            }}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.65,
              }}
            >
              {article.excerpt.slice(0, featured ? 180 : 100)}...
            </p>
          )}
          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "var(--saffron)",
              fontWeight: 600,
            }}
          >
            Read more →
          </p>
        </div>
      </article>
    </Link>
  );
}
