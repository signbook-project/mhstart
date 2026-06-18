import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--navy-dark)",
        color: "rgba(255,255,255,0.8)",
        paddingTop: 64,
      }}
    >
      {/* Decorative top border */}
      <div
        style={{
          height: 4,
          background:
            "linear-gradient(90deg, var(--saffron), var(--gold), var(--saffron))",
        }}
      />

      <div className="container" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {/* <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 800, color: 'white',
                fontFamily: 'var(--font-display)',
              }}>MH</div> */}
              {/* <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white' }}>MHStart</div>
                <div style={{ fontSize: 10, color: 'var(--gold-light)', letterSpacing: 1.5, fontWeight: 600 }}>MAHARASHTRA</div>
              </div> */}
                <Image
                  src="/logo.png"
                  alt="MHStart"
                  width={200}
                  height={150}
                  style={{
                    objectFit: "contain",
                  }}
                />
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 300,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Empowering Maharashtra&apos;s startup ecosystem by connecting
              founders, investors, incubators, and enablers across the state.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-heading)",
                marginBottom: 20,
                fontSize: 16,
              }}
            >
              Explore
            </h4>
            {[
              { href: "/", label: "Home" },
              { href: "/news", label: "News & Updates" },
              { href: "/map", label: "Ecosystem Map" },
              { href: "/people", label: "Our People" },
              { href: "/about", label: "About Us" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: 10,
                  transition: "color 0.2s",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Get Involved */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-heading)",
                marginBottom: 20,
                fontSize: 16,
              }}
            >
              Get Involved
            </h4>
            {[
              { href: "/submit", label: "Add Your Startup" },
              { href: "/submit?type=enabler", label: "Add as Enabler" },
              { href: "/news/submit", label: "Submit News" },
              { href: "/contact", label: "Contact Us" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-heading)",
                marginBottom: 20,
                fontSize: 16,
              }}
            >
              Contact
            </h4>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              Maharashtra, India
              <br />
              info@mhstart.com
              <br />
              +91 98765 43210
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} MHStart. Empowering Maharashtra&apos;s
            Startup Ecosystem.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Use"].map((t) => (
              <a
                key={t}
                href="#"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
