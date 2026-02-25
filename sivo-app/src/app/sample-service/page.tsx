import Link from 'next/link'

export default function SampleServicePage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Try Before You Commit</span>
            <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px' }}>SIVO Sample Programme</h1>
            <div style={{ width: 60, height: 2, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>

          <div className="card card-glow shimmer" style={{ padding: 32 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20, textAlign: 'center' }}>
              We understand you need to see and feel the quality before committing to a production order. Our sample programme is available to approved trade accounts.
            </p>

            {/* 3 Step Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { icon: '📦', title: 'Order Samples', desc: 'Select items from our collection' },
                { icon: '🔍', title: 'Inspect Quality', desc: 'Assess finish, weight, build' },
                { icon: '✅', title: 'Fee Refunded', desc: 'Credited on confirmed order' },
              ].map((s, i) => (
                <div key={i} style={{ padding: 16, textAlign: 'center', background: 'var(--surface, #1a1a2e)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Info Cards */}
            <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Sample Fee', value: <>Varies by item — <b style={{ color: 'var(--gold)' }}>fully refundable</b> against your first confirmed production order</> },
                { label: 'Shipping', value: <>Shipping is charged at cost and is <b style={{ color: '#fff' }}>non-refundable</b></> },
                { label: 'UK-Held Samples', value: 'Core items held in the UK for fast despatch — or request a personal store visit' },
              ].map((info, i) => (
                <div key={i} style={{
                  padding: 16, borderLeft: '3px solid var(--gold)',
                  background: 'var(--surface, #1a1a2e)', border: '1px solid var(--border)', borderRadius: 8,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                }}>
                  <div style={{ fontSize: 12, color: '#fff', flexShrink: 0, minWidth: 100 }}>{info.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{info.value}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/catalog" style={{
                display: 'inline-block', padding: '12px 28px',
                background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4,
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                textDecoration: 'none',
              }}>Browse Collection to Select Samples</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
