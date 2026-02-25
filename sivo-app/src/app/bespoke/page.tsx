export default function BespokePage() {
  const options = [
    { title: 'Custom Dimensions', desc: 'Tables, desks, and storage built to your specified sizes' },
    { title: 'Custom Finishes', desc: 'Stain colours, lacquer types, wax finishes, and painted options' },
    { title: 'Material Selection', desc: 'Acacia, mango, sheesham, pine, reclaimed wood, marble, iron' },
    { title: 'Hardware & Details', desc: 'Leg styles, handle choices, metal finish options' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Custom Manufacturing</span>
            <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px' }}>Bespoke Orders</h1>
            <div style={{ width: 60, height: 2, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>

          <div style={{ padding: 32, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
              Need something not in our standard catalogue? SIVO offers bespoke manufacturing for qualifying orders.
            </p>

            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              {options.map((o, i) => (
                <div key={i} style={{
                  padding: 16, borderLeft: '3px solid var(--gold)',
                  background: 'var(--surface, #1a1a2e)', border: '1px solid var(--border)', borderRadius: 8,
                }}>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{o.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{o.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
              Bespoke orders require higher MOQs (typically 20+ units per SKU) and extended lead times. A prototype fee may apply. Discuss your requirements with your account manager.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
