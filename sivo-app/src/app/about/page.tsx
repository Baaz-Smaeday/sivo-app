import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="pt-[80px]">
      {/* Hero */}
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="sub-label">Why SIVO</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-6 mt-2">The Smarter Way to Source Furniture</h1>
          <div className="gold-line-center mb-6" />
          <p className="text-[var(--muted)] text-base leading-relaxed max-w-2xl mx-auto">
            SIVO connects UK retailers directly with India&apos;s finest furniture artisans. No middlemen, no inflated pricing — just exceptional quality at genuine wholesale rates.
          </p>
        </div>
      </section>

      {/* The Problem / Solution */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8">
            <h2 className="font-serif text-2xl text-white mb-4">The Traditional Way</h2>
            <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed">
              <p>❌ Multiple intermediaries between factory and retailer</p>
              <p>❌ 3–5 markups before products reach your showroom</p>
              <p>❌ No visibility into manufacturing or quality control</p>
              <p>❌ Inconsistent compliance documentation</p>
              <p>❌ Limited control over customisation</p>
            </div>
          </div>
          <div className="card p-8" style={{ borderColor: 'rgba(201,169,110,.3)' }}>
            <h2 className="font-serif text-2xl text-[var(--gold)] mb-4">The SIVO Way</h2>
            <div className="space-y-3 text-sm text-[var(--txt)] leading-relaxed">
              <p>✓ Direct from artisan workshops to your store</p>
              <p>✓ One transparent markup — 30–40% below UK wholesale</p>
              <p>✓ Full quality inspection before shipping</p>
              <p>✓ Complete UK compliance docs included with every order</p>
              <p>✓ Custom finishes, sizes, and specifications available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="section" style={{ background: 'linear-gradient(140deg, var(--navy), var(--dark))' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="sub-label">Our Services</span>
            <h2 className="font-serif text-3xl text-white mt-2">How We Help UK Buyers</h2>
            <div className="gold-line-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: 'Managed Sourcing', d: 'Every product sourced through our vetted production network. One UK point of contact.', i: '🔍' },
              { t: 'Custom Manufacturing', d: 'Custom sizes, finishes, materials. From prototype to bulk production.', i: '🏭' },
              { t: 'UK Compliance', d: 'BS EN tested. REACH compliant where applicable. Full documentation on request.', i: '✅' },
              { t: 'Managed Logistics', d: 'Door-to-door UK delivery. Container consolidation and customs handled.', i: '🚛' },
              { t: 'Quality Control', d: 'Dual-stage QC: pre-production material checks and pre-shipment inspection.', i: '🔬' },
              { t: 'Sample Programme', d: 'UK-held samples. Fee credited against first confirmed production order.', i: '📦' },
            ].map(s => (
              <div key={s.t} className="card p-6">
                <div className="text-3xl mb-3">{s.i}</div>
                <div className="font-serif text-lg text-white mb-2">{s.t}</div>
                <div className="gold-line mb-3" />
                <div className="text-xs text-[var(--muted)] leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="sub-label">Our Process</span>
            <h2 className="font-serif text-3xl text-white mt-2">How We Work</h2>
            <div className="gold-line-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Curate', desc: 'We select pieces from master craftsmen across Rajasthan — only designs with proven UK market appeal.' },
              { step: '02', title: 'Quality Check', desc: 'Every product is inspected at source. Finishes, joints, and hardware are verified before shipping.' },
              { step: '03', title: 'Ship', desc: 'Consolidated container shipping from India. Full logistics management, customs clearance included.' },
              { step: '04', title: 'Deliver', desc: 'Direct to your warehouse or store. Complete documentation for HMRC, fire safety, and FSC.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="text-3xl font-serif text-[var(--gold)] mb-3">{item.step}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-white">Built on Trust</h2>
            <div className="gold-line-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'UK Registered Company', desc: 'SIVO Home Ltd is a registered UK company. Full HMRC compliance on every transaction.' },
              { title: '50+ Trade Partners', desc: 'Trusted by independent retailers, interior designers, and hospitality groups across the UK.' },
              { title: 'Dedicated Support', desc: 'Every trade account gets a named account manager — Navi Singh, direct line and email.' },
            ].map(item => (
              <div key={item.title} className="card p-6 text-center card-glow">
                <h3 className="font-serif text-lg text-white mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center" style={{ background: 'var(--navy)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl text-white mb-4">Ready to Partner with SIVO?</h2>
          <p className="text-[var(--muted)] mb-8">Apply for a trade account and start sourcing at genuine wholesale prices.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
              Apply for Trade Account
            </Link>
            <Link href="/catalog" className="btn-outline text-sm tracking-wider uppercase">
              Browse Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
