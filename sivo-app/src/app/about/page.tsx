import Link from 'next/link'

export default function AboutPage() {
  const advantages = [
    { icon: '🏭', title: 'SIVO Production Network', desc: 'All products are manufactured through our vetted production partners. No direct factory contact required — we manage the entire production chain.' },
    { icon: '🔬', title: 'Pre-Production & Pre-Shipment QC', desc: 'Dual-stage quality control. Material and construction verified before production begins. Final inspection before any container is sealed.' },
    { icon: '🇬🇧', title: 'Compliance & Documentation', desc: 'BS EN structural testing, REACH chemical compliance, and FSC timber certification where applicable. Documentation available for every order on request.' },
    { icon: '📦', title: 'Retail-Ready Packaging', desc: 'Products arrive boxed with care instructions and assembly guides where required. White-label packaging available for trade customers.' },
    { icon: '🚢', title: 'Consolidated Container Scheduling', desc: 'Mixed SKU orders consolidated into shared or full containers. Regular scheduled shipments to reduce your per-unit logistics cost.' },
    { icon: '📋', title: 'Clear Documentation', desc: 'Proforma invoices, packing lists, phytosanitary certificates, material declarations, and compliance docs provided with every shipment.' },
    { icon: '🔄', title: 'Mixed SKU Flexibility', desc: 'Order across multiple product lines in a single shipment. Meet per-SKU MOQs and we handle the consolidation.' },
    { icon: '🤝', title: 'UK Trade Support', desc: 'Dedicated UK-based account support. No language barriers, no timezone issues. One point of contact for your entire order.' },
  ]

  const stats = [
    { value: '30+', label: 'Products' },
    { value: '100%', label: 'UK Compliant' },
    { value: '8–10', label: 'Week Production' },
    { value: 'Mixed', label: 'SKU Flexibility' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero Banner */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, rgba(201,169,110,.08), rgba(13,27,42,.9))',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{
            display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
            color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 12,
          }}>Why SIVO</span>

          <h1 style={{
            fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
            fontSize: 'clamp(32px, 4.5vw, 56px)', color: '#fff', lineHeight: 1.1,
            margin: '0 0 20px', fontWeight: 400,
          }}>
            Structured Sourcing.<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Built for UK Trade.</em>
          </h1>

          <p style={{
            fontSize: 15, color: 'var(--muted)', maxWidth: 620,
            margin: '0 auto 32px', lineHeight: 1.8,
          }}>
            SIVO is a UK-registered private label furniture brand. Every product is produced under our
            specifications, quality-controlled at source, and delivered with full UK compliance documentation.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontSize: 36, color: 'var(--gold)',
                }}>{s.value}</div>
                <div style={{
                  fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The SIVO Advantage */}
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{
              display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
              color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8,
            }}>The SIVO Advantage</span>
            <h2 style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', fontWeight: 400, margin: '0 0 12px',
            }}>Why Source Through SIVO</h2>
            <div style={{
              width: 60, height: 2, margin: '0 auto',
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            }} />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16,
          }}>
            {advantages.map((a, i) => (
              <div key={i} className="card card-glow shimmer" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontSize: 17, color: '#fff', marginBottom: 6,
                }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '48px 0', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
            fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 400,
          }}>Ready to Source Smarter?</h2>
          <p style={{
            fontSize: 14, color: 'var(--muted)', maxWidth: 480,
            margin: '0 auto 24px',
          }}>
            Apply for a trade account to access our full catalogue with wholesale pricing.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth?tab=register" style={{
              display: 'inline-block', padding: '12px 24px',
              background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4,
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Apply for Trade Account</Link>
            <Link href="/catalog" style={{
              display: 'inline-block', padding: '12px 24px',
              border: '1px solid var(--border)', borderRadius: 4,
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              color: 'var(--muted)', textDecoration: 'none',
            }}>Browse Collection</Link>
            <Link href="/how-to-order" style={{
              display: 'inline-block', padding: '12px 24px',
              border: '1px solid var(--border)', borderRadius: 4,
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              color: 'var(--muted)', textDecoration: 'none',
            }}>How Ordering Works</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
