// components/public/ProgramsSection.tsx
// Drop into the homepage wherever "Our Programs" should sit (after Spotlight is typical).
// Static content for now — no DB table exists for this yet (see note at bottom for making it admin-editable).

const programs = [
  {
    icon: "🚀",
    title: "Startup Sandbox",
    desc: "This is a -1 to 0 program, where you can launch your idea with our partner program getting all required business infrastructure to pilot your ideas.",
  },
  {
    icon: "💳",
    title: "Credit Support",
    desc: "We offer many partner credits from our ecosystem allowing you to get access to credits across Cloud, Mail Services, Incubators, AI tools and more.",
  },
  {
      icon: '🛡️',
    title: "MA-Startup Aadhar",
    desc: "We are working on this program to offer a unique ID to all Maharashtra-incepted startups to get your recognition and identity in the ecosystem.",
  },
];

export default function ProgramsSection() {
  return (
    <section style={{ padding: "80px 0", background: "white" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div className="section-eyebrow">What We Offer</div>
        <h2
          className="section-title"
          style={{ margin: "0 auto 20px", maxWidth: 600 }}
        >
          Our Programs
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto 56px" }}>
          We run programs and ideas to support startups at every stage of their
          journey.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {programs.map((p) => (
            <div
              key={p.title}
              style={{
                background: "var(--gray-50)",
                borderRadius: 14,
                padding: 32,
                textAlign: "left",
                border: "1px solid var(--gray-100)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 18,
                  color: "var(--navy)",
                  marginBottom: 10,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          section > .container > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/*
TO MAKE THIS ADMIN-EDITABLE LATER:
1. Add a `programs` jsonb column to the `settings` table (same pattern as `homepage` / `site`)
2. Add a "Programs" tab to AdminHomepagePage.tsx, same pattern as the Spotlight tab
3. Fetch it here with: const { data } = await supabase.from('settings').select('value').eq('key','programs').single()
*/
