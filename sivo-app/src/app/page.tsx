import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import HomeClient from './HomeClient'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { data: categories } = await supabase.from('categories').select('name, slug').order('name')

  // Get featured products with images for the collection banner
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`*, images:product_images(url, alt_text, is_primary, sort_order)`)
    .eq('in_stock', true)
    .limit(8)
    .order('sort_order')

  const catIcons: Record<string, string> = {
    'Dining Tables': '🍽️', 'Coffee Tables': '☕', 'Side & Accent Tables': '🪑',
    'Bar Collections': '🍷', 'Storage & Shelving': '📚', 'Bedroom Furniture': '🛏️',
    'Writing Desks': '✍️', 'Bathroom Furniture': '🚿', 'Contract Furniture': '🏢',
    'Dining Sets': '🪑', 'Console Tables': '🏛️', 'Mirrors': '🪞',
    'TV & Media Units': '📺', 'Sideboards': '🗄️', 'Bookcases': '📖',
    'Desks': '💼', 'Dressing Tables': '💄', 'Cabinets': '🗄️',
  }

  return (
    <div className="pt-[60px]">
      {/* Client component for auth-aware portal greeting */}
      <HomeClient />

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-deco" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-[680px]">
            <div className="sivo-seal-badge mb-4 inline-block animate-fade-up">Appointment-Led UK Trade House</div>
            <h1 className="font-serif text-[clamp(34px,5.5vw,66px)] font-light leading-[1.08] text-white mb-5 animate-fade-up delay-100">
              Handcrafted Furniture,<br />
              <em className="text-[var(--gold)] italic font-normal">Produced to UK Standards</em>
            </h1>
            <p className="text-[15px] text-[var(--muted)] leading-[1.8] max-w-[540px] mb-7 animate-fade-up delay-200">
              A curated collection of solid wood, metal, and mixed-material furniture — produced under SIVO specifications, quality-controlled at source, and delivered with full compliance documentation.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
              <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">
                Browse Collection
              </Link>
              <Link href="/trade-viewing" className="btn-outline text-sm tracking-wider uppercase">
                Book Trade Viewing
              </Link>
              <Link href="/collections" className="btn-outline text-sm tracking-wider uppercase">
                Signature Collections
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-9 animate-fade-up delay-300">
              <span className="text-[9px] tracking-[2px] text-[var(--muted)] uppercase">
                🇬🇧 UK Registered · VAT Registered · Compliance-Led · Trade Accounts Only
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTAINER COUNTDOWN ─── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-5 relative z-[5]">
        <div className="card p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,167,38,.15)' }}>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs text-orange-400 font-medium">🚢 Next Shipment Window: March 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[var(--txt)]">Order by <b className="text-white">28 Feb</b> to reserve container space</span>
            <div className="w-[120px] h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-orange-400" style={{ width: '65%' }} />
            </div>
            <span className="text-[10px] text-[var(--muted)]">65% allocated</span>
          </div>
        </div>
      </div>

      {/* ─── TRUST BAR ─── */}
      <section className="py-7 border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-4 sm:gap-7">
          <span className="text-[9px] tracking-[2px] text-[var(--muted)] uppercase">Trusted by UK independents</span>
          {['BS EN Tested Where Applicable', 'REACH Compliant Where Applicable', 'FSC Certified Where Applicable', 'UK & VAT Registered', 'Documentation on Request'].map(t => (
            <span key={t} className="sivo-seal-badge">{t}</span>
          ))}
        </div>
      </section>

      {/* ─── WHY SIVO PILLARS ─── */}
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="sub-label">The SIVO Difference</span>
            <h2 className="font-serif text-3xl sm:text-[46px] text-white leading-tight mt-2">Why Independent Retailers Choose SIVO</h2>
            <div className="gold-line-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: '🔬', t: 'Controlled Production', d: 'Every product manufactured through our vetted production network. Dual-stage QC — pre-production material checks and pre-shipment final inspection.' },
              { i: '🇬🇧', t: 'UK Compliance Built In', d: 'BS EN structural testing, REACH chemical compliance, and FSC timber certification where applicable. Documentation provided with every order.' },
              { i: '🚢', t: 'Consolidated Shipping', d: 'Mixed SKU orders consolidated into scheduled container shipments. Regular windows reduce per-unit freight and simplify your buying cycle.' },
              { i: '🤝', t: 'Personal Trade Support', d: 'Dedicated UK-based account manager. In-person trade viewings with samples. We visit your store. Reply within 24 hours guaranteed.' },
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

      {/* ─── SIGNATURE COLLECTION BANNER (Amravati) ─── */}
      <section className="coll-banner">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="sub-label">Signature Collection</span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] text-white leading-[1.15] mt-2 mb-4">
                The Amravati<br /><em className="text-[var(--gold)]">Dining Collection</em>
              </h2>
              <p className="text-[13px] text-[var(--muted)] leading-[1.8] mb-5">
                Solid acacia wood with signature iron hairpin legs. Available in multiple table sizes with complementary seating and storage — designed to work as a complete retail range.
              </p>
              <div className="flex gap-4 mb-5">
                {[{ n: '8', l: 'Pieces' }, { n: '3', l: 'Table Sizes' }, { n: 'Mixed', l: 'SKU Ordering' }].map(s => (
                  <div key={s.l}>
                    <div className="font-serif text-2xl text-[var(--gold)]">{s.n}</div>
                    <div className="text-[9px] text-[var(--muted)] uppercase tracking-[1px]">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">Shop Amravati</Link>
                <Link href="/collections" className="btn-outline text-sm tracking-wider uppercase">All Collections →</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(featuredProducts || []).slice(0, 4).map((p: any) => {
                const img = p.images?.find((i: any) => i.is_primary)?.url || p.images?.[0]?.url
                return (
                  <Link key={p.id} href={`/catalog/${p.slug}`}
                        className="card card-glow aspect-square overflow-hidden flex items-center justify-center bg-[var(--surface)]">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl opacity-20">🪑</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SAMPLE PROGRAMME ─── */}
      <section className="section" style={{ background: 'linear-gradient(140deg, var(--navy), var(--dark))' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="sub-label">UK-Based Samples</span>
              <h2 className="font-serif text-[clamp(26px,3vw,38px)] text-white mt-2 mb-4">SIVO Sample Programme</h2>
              <p className="text-[13px] text-[var(--muted)] leading-[1.8] mb-4">
                We keep core product samples in the UK. Request a personal viewing at our showroom or we&apos;ll bring samples to your store. See the finish, feel the quality, assess the weight — before you commit.
              </p>
              <div className="space-y-2 mb-5">
                {['UK-held hero samples across collections', 'Sample fee credited against first production order', 'Personal delivery to your store on request'].map(t => (
                  <div key={t} className="card p-3.5" style={{ borderLeft: '3px solid var(--gold)' }}>
                    <span className="text-[11px] text-white">✓ {t}</span>
                  </div>
                ))}
              </div>
              <Link href="/trade-viewing" className="btn-gold text-sm tracking-wider uppercase">
                Book a Sample Viewing →
              </Link>
            </div>
            <div className="card p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)' }}>
              <div className="text-[56px] mb-3">🇬🇧</div>
              <div className="font-serif text-xl text-white mb-2">We Visit You</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                SIVO visits independent UK retailers with finish samples, hero items, and collection catalogues. No trade show — personal appointments only.
              </div>
              <span className="sivo-seal-badge">Appointment Only</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIVO VISUALISE™ ─── */}
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div className="card p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)' }}>
              <div className="text-[72px] mb-3" style={{ filter: 'drop-shadow(0 4px 20px rgba(201,169,110,.2))' }}>🔄</div>
              <div className="font-serif text-xl text-white mb-1">SIVO Visualise™</div>
              <div className="text-[11px] text-[var(--muted)]">3D & AR Product Viewer</div>
            </div>
            <div>
              <span className="sub-label">Product Technology</span>
              <h2 className="font-serif text-[clamp(26px,3vw,38px)] text-white mt-2 mb-3">
                Plan Your Floor Layout<br />Before You Order
              </h2>
              <p className="text-[13px] text-[var(--muted)] leading-[1.8] mb-4">
                View products in interactive 3D or place them in your showroom using augmented reality. Accurate to real-world dimensions — helping you plan displays, check proportions, and show customers before stock arrives.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="sivo-seal-badge">🔄 View 3D Model</span>
                <span className="sivo-seal-badge">📱 Visualise in Your Space (AR)</span>
                <span className="sivo-seal-badge">📄 Download Spec Sheet</span>
              </div>
              <div className="text-[10px] text-[var(--muted)] leading-relaxed">
                Compatible with iOS AR Quick Look and Android Scene Viewer. Accurate scaling to real dimensions. Available on selected products.
              </div>
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
