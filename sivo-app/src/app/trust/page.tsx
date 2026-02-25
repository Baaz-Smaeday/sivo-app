export default function TrustPage() {
  const items = [
    { icon: '🇬🇧', title: 'UK Registered Brand', desc: 'SIVO is a UK-registered trade brand. VAT registered. Operating from Horsedge Mill, Oldham, Greater Manchester.' },
    { icon: '🔬', title: 'BS EN Structural Testing', desc: 'Furniture tested to BS EN 12520/12521 standards where applicable. Test reports available upon request.' },
    { icon: '🌿', title: 'REACH Chemical Compliance', desc: 'Chemical safety declarations for all finishes, lacquers, and treatments. REACH documentation provided with applicable orders.' },
    { icon: '🌲', title: 'FSC Certified Timber', desc: 'Sustainably sourced timber with Forest Stewardship Council chain of custody certification where applicable.' },
    { icon: '🔥', title: 'UK Fire Compliance', desc: 'Upholstered items meet UK fire safety regulations where applicable. Certification available on request.' },
    { icon: '📋', title: 'Material Declarations', desc: 'Material composition declarations available for all products. Wood species, metal types, and finish specifications documented.' },
    { icon: '📦', title: 'Packaging Standards', desc: 'ISPM-15 compliant packing. Products boxed with foam protection, corner guards, and retail-ready care instruction cards.' },
    { icon: '📄', title: 'Care & Maintenance', desc: 'Printed care sheets included with every product. Digital versions available for your own customer communications.' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero Banner */}
      <section style={{
        padding: '60px 0',
        background: 'linear-gradient(135deg, rgba(201,169,110,.08), rgba(13,27,42,.9))',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Compliance & Standards</span>
          <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '12px 0 16px' }}>Trust & Compliance</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 540, margin: '0 auto' }}>Products are produced with UK and EU regulatory standards in mind. Compliance documentation available upon request.</p>
        </div>
      </section>

      {/* Cards Grid */}
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {items.map((item, i) => (
              <div key={i} className="card card-glow shimmer" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <span style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 17, color: '#fff' }}>{item.title}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
