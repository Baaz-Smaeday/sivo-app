export default function PortfolioPage() {
  const projects = [
    { name: 'Boutique Hotel — 200 Tables', type: 'Hospitality', timeline: '4mo' },
    { name: 'UK Retailer — Contract Range', type: 'Retail', timeline: '6mo' },
    { name: 'Canary Wharf Apartments', type: 'Residential', timeline: '8mo' },
    { name: 'Restaurant Group — 15 Sites', type: 'Hospitality', timeline: '5mo' },
    { name: 'Co-Working UK Offices', type: 'Corporate', timeline: '6mo' },
    { name: 'Dubai Luxury Villas', type: 'Residential', timeline: '10mo' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Our Work</span>
            <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px' }}>Project Portfolio</h1>
            <div style={{ width: 60, height: 2, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {projects.map((p, i) => (
              <div key={i} style={{ padding: 24, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 4,
                  fontSize: 10, fontWeight: 600, letterSpacing: .5, textTransform: 'uppercase',
                  background: 'rgba(201,169,110,.15)', color: 'var(--gold)', marginBottom: 8,
                }}>{p.type}</span>
                <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 19, color: '#fff', marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Timeline: {p.timeline}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
