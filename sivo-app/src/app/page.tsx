import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

export default async function HomePage() {
  const supabase = createClient()
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { data: categories } = await supabase.from('categories').select('name, slug').order('name')

  const catIcons: Record<string, string> = {
    'Dining Tables': '🍽️', 'Coffee Tables': '☕', 'Side & Accent Tables': '🪑',
    'Bar Collections': '🍷', 'Storage & Shelving': '📚', 'Bedroom Furniture': '🛏️',
    'Writing Desks': '✍️', 'Bathroom Furniture': '🚿', 'Contract Furniture': '🏢',
    'Dining Sets': '🪑', 'Console Tables': '🏛️', 'Mirrors': '🪞',
  }

  return (
    <div className="pt-[60px]">
      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-deco" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl">
            <div className="sub-label mb-4 animate-fade-up">Premium UK Trade Furniture</div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] text-white leading-[1.1] mb-6 animate-fade-up delay-100">
              Direct from Indian Artisans to Your Showroom
            </h1>
            <p className="text-[var(--muted)] text-base sm:text-lg mb-8 leading-relaxed max-w-xl animate-fade-up delay-200">
              Curated furniture collections with genuine wholesale pricing. 30–40% below UK wholesale. Full UK compliance documentation included.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">
                Browse Collection
              </Link>
              <Link href="/auth?tab=register" className="btn-outline text-sm tracking-wider uppercase">
                Apply for Trade Account
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 animate-fade-up delay-300">
              {[
                { n: `${count || 30}+`, l: 'Products' },
                { n: '30–40%', l: 'Below UK Wholesale' },
                { n: '8–10', l: 'Week Lead Time' },
              ].map(s => (
                <div key={s.l}>
                  <div className="font-serif text-2xl text-[var(--gold)]">{s.n}</div>
                  <div className="text-[10px] tracking-wider uppercase text-[var(--muted)]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="py-7 border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-4 sm:gap-7">
          <span className="text-[9px] tracking-[2px] text-[var(--muted)] uppercase">Trusted by UK independents</span>
          {['BS EN Tested Where Applicable', 'REACH Compliant Where Applicable', 'FSC Certified Where Applicable', 'UK & VAT Registered', 'Documentation on Request'].map(t => (
            <span key={t} className="sivo-seal-badge">{t}</span>
          ))}
        </div>
      </section>

      {/* ─── WHY SIVO ─── */}
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="sub-label">The SIVO Difference</span>
            <h2 className="font-serif text-3xl sm:text-[46px] text-white leading-tight mt-2">Why Independent Retailers Choose SIVO</h2>
            <div className="gold-line-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { i: '🏭', t: 'Direct Sourcing', d: 'We work directly with master craftsmen in Jodhpur, Jaipur, and across Rajasthan. No middlemen, no inflated pricing.' },
              { i: '💰', t: '30–40% Below UK Wholesale', d: 'Genuine factory-gate pricing. Our trade buyers consistently achieve higher margins than traditional supply chains.' },
              { i: '✅', t: 'Full UK Compliance', d: 'Every product comes with UK fire safety documentation, HMRC-compliant invoicing, and FSC certification where applicable.' },
              { i: '🎨', t: 'Curated Collections', d: 'Each piece is selected for UK market appeal, quality construction, and retail viability. We don\'t sell everything.' },
              { i: '🚢', t: 'Container Shipping', d: 'Consolidated container shipping from India. 8–10 week lead time. Full logistics support from factory to your door.' },
              { i: '🤝', t: 'Dedicated Account Manager', d: 'Every trade partner gets a named account manager for ordering, sampling, and custom requirements.' },
            ].map(s => (
              <div key={s.t} className="card card-glow p-6">
                <div className="text-3xl mb-3">{s.i}</div>
                <div className="font-serif text-lg text-white mb-2">{s.t}</div>
                <div className="text-xs text-[var(--muted)] leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIGNATURE COLLECTIONS BANNER ─── */}
      <section className="coll-banner">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="sub-label">Curated Ranges</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white mt-2 mb-4">Signature Collections</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                Each SIVO collection is designed as a complete retail range — coordinated materials, complementary silhouettes, and mixed SKU ordering to simplify your buying.
              </p>
              <Link href="/collections" className="btn-gold text-sm tracking-wider uppercase">
                View Collections
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Mango Heritage', 'Acacia Industrial', 'Marble & Iron', 'Reclaimed Teak'].map(c => (
                <div key={c} className="card p-5 text-center card-glow">
                  <div className="font-serif text-base text-white">{c}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-1">View Range →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="sub-label">Browse by Category</span>
            <h2 className="font-serif text-3xl sm:text-[46px] text-white leading-tight mt-2">Full Collection</h2>
            <div className="gold-line-center" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {(categories || []).map((c: any) => (
              <Link key={c.slug} href={`/catalog?cat=${c.slug}`}
                    className="card card-glow p-5 text-center cursor-pointer">
                <div className="text-2xl mb-2">{catIcons[c.name] || '📦'}</div>
                <div className="font-serif text-sm text-white">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section" style={{ background: 'linear-gradient(140deg, var(--navy), var(--dark))' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="sub-label">Getting Started</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: '👤', t: 'Apply', d: 'Trade accounts for UK retailers, designers, and hospitality buyers. Reviewed within 1–2 days.' },
              { i: '🛒', t: 'Build Your Basket', d: 'Browse collections. Add mixed SKUs. Meet per-SKU MOQs. Submit one quote.' },
              { i: '🔬', t: 'Production & QC', d: '8–10 week production. Dual-stage quality control. Progress updates throughout.' },
              { i: '🚚', t: 'UK Delivery', d: 'Consolidated container shipping. Full compliance documentation. Delivered to your door.' },
            ].map(s => (
              <div key={s.t} className="card p-6 text-center">
                <div className="text-4xl mb-3">{s.i}</div>
                <div className="font-serif text-lg text-white mb-2">{s.t}</div>
                <div className="text-xs text-[var(--muted)] leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section text-center" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.06), transparent)' }}>
        <div className="max-w-xl mx-auto px-4">
          <div className="text-5xl mb-4">🇬🇧</div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Apply for a SIVO Trade Account</h2>
          <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
            Access trade pricing, book personal viewings, and order from our full collection. Approval within 1–2 working days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
              Apply for Trade Account
            </Link>
            <Link href="/trade-viewing" className="btn-outline text-sm tracking-wider uppercase">
              Book a Trade Viewing
            </Link>
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-4">
            ✓ Trade accounts only · ✓ No obligation · ✓ UK-based support
          </div>
        </div>
      </section>
    </div>
  )
}
