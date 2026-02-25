export default function ServicesPage() {
  const services = [
    { icon: '🔍', title: 'Managed Sourcing', desc: 'Every product sourced through our vetted production network. One UK point of contact.' },
    { icon: '🏭', title: 'Custom Manufacturing', desc: 'Custom sizes, finishes, materials. From prototype to bulk production.' },
    { icon: '✅', title: 'UK Compliance', desc: 'BS EN tested. REACH compliant where applicable. Full documentation on request.' },
    { icon: '🚛', title: 'Managed Logistics', desc: 'Door-to-door UK delivery. Container consolidation and customs handled.' },
    { icon: '🔬', title: 'Quality Control', desc: 'Dual-stage QC: pre-production material checks and pre-shipment inspection.' },
    { icon: '📦', title: 'Sample Programme', desc: 'UK-held samples. Fee credited against first confirmed production order.' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Our Services</span>
            <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px' }}>How We Help UK Buyers</h1>
            <div style={{ width: 60, height: 2, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {services.map((s, i) => (
              <div key={i} className="card card-glow shimmer" style={{ padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 19, color: '#fff', marginBottom: 6 }}>{s.title}</div>
                <div style={{ width: 30, height: 2, background: 'var(--gold)', marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
