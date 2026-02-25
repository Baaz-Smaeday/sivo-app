import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-center px-4 bg-gradient-to-b from-brand-bg to-brand-surface">
        <div className="max-w-3xl">
          <div className="text-[10px] font-semibold tracking-[3px] uppercase text-brand-gold mb-4">
            Premium UK Trade Furniture
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Direct from Indian Artisans to Your Showroom
          </h1>
          <p className="text-brand-muted text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Curated furniture collections with genuine wholesale pricing. 30–40% below UK wholesale. Full UK compliance documentation included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">
              Browse Collection
            </Link>
            <Link href="/auth?tab=register" className="btn-outline text-sm tracking-wider uppercase">
              Apply for Trade Account
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-brand-surface border-y border-brand-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { label: 'UK Registered', icon: '🇬🇧' },
            { label: '8–10 Wk Lead', icon: '📦' },
            { label: 'Docs on Request', icon: '✅' },
            { label: 'FSC Where Applicable', icon: '🌿' },
            { label: '50+ UK Partners', icon: '🤝' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-brand-muted">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-[10px] font-semibold tracking-[3px] uppercase text-brand-gold mb-3">Why Trade with SIVO</div>
          <h2 className="font-serif text-3xl text-white">Built for Serious Retailers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Direct Sourcing', desc: 'We work directly with master craftsmen in Jodhpur, Jaipur, and across Rajasthan. No middlemen, no inflated pricing.' },
            { title: '30–40% Below UK Wholesale', desc: 'Genuine factory-gate pricing. Our trade buyers consistently achieve higher margins than traditional supply chains.' },
            { title: 'Full UK Compliance', desc: 'Every product comes with UK fire safety documentation, HMRC-compliant invoicing, and FSC certification where applicable.' },
            { title: 'Curated Collections', desc: 'We don\'t sell everything. Each piece is selected for UK market appeal, quality construction, and retail viability.' },
            { title: 'Container Shipping', desc: 'Consolidated container shipping from India. 8–10 week lead time. Full logistics support from factory to your door.' },
            { title: 'Dedicated Account Manager', desc: 'Every trade partner gets a named account manager for ordering, sampling, and custom requirements.' },
          ].map(item => (
            <div key={item.title} className="card p-6">
              <h3 className="font-serif text-lg text-white mb-3">{item.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-surface border-y border-brand-border py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="font-serif text-3xl text-white mb-4">Ready to See Trade Prices?</h2>
          <p className="text-brand-muted mb-8">Apply for a trade account to unlock wholesale pricing across our entire collection.</p>
          <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
            Apply for Trade Account
          </Link>
        </div>
      </section>
    </div>
  )
}
