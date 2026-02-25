export default function AboutPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start',
          }}>
            {/* Left - Text */}
            <div>
              <div style={{ marginBottom: 24 }}>
                <span style={{
                  display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
                  color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8,
                }}>About Us</span>
                <h1 style={{
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontSize: 42, color: '#fff', fontWeight: 400, margin: '0 0 12px',
                }}>About SIVO</h1>
                <div style={{ width: 40, height: 2, background: 'var(--gold)' }} />
              </div>

              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 16 }}>
                SIVO is a UK-registered private label furniture brand specialising in handcrafted solid wood,
                metal, and mixed-material furniture. Every product in our collection is produced under SIVO
                specifications through our vetted production network.
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 16 }}>
                We operate a compliance-led sourcing model with dual-stage quality control, pre-production
                material verification, and pre-shipment inspection. All products are delivered with full UK
                regulatory documentation.
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9 }}>
                Our consolidated container shipping model allows UK trade buyers to order mixed SKUs across
                our full range, reducing per-unit freight costs while maintaining flexibility. We manage
                production, quality control, logistics, and customs clearance — so you receive product, not
                problems.
              </p>
            </div>

            {/* Right - Quote + Office */}
            <div>
              {/* Founder Quote */}
              <div className="card card-glow shimmer" style={{
                padding: 32, marginBottom: 16, position: 'relative',
                background: 'linear-gradient(140deg, var(--navy, #0D1B2A), var(--dark, #0b0b0e))',
              }}>
                <div style={{
                  position: 'absolute', top: -8, left: -8, width: 40, height: 40,
                  borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)',
                  borderRadius: '8px 0 0 0',
                }} />
                <div style={{
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontSize: 18, fontStyle: 'italic', color: 'var(--txt, #e0e0e0)',
                  lineHeight: 1.8, textAlign: 'center',
                }}>
                  &ldquo;We built SIVO to give UK trade buyers a structured, transparent, and
                  compliance-led alternative to direct factory sourcing.&rdquo;
                </div>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: 12, color: 'var(--gold)' }}>Founder, SIVO</span>
                </div>
              </div>

              {/* UK Office */}
              <div className="card card-glow shimmer" style={{ padding: 20 }}>
                <div style={{
                  fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                  color: 'var(--gold)', marginBottom: 10,
                }}>UK Office</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                  Horsedge Mill<br />
                  Oldham, Greater Manchester<br />
                  United Kingdom<br /><br />
                  UK Registered · VAT Registered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
