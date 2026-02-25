import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import HomeClient from './HomeClient'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { data: categories } = await supabase.from('categories').select('name, slug').order('name')

  // Featured products with images for collection banner
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`*, images:product_images(url, alt_text, is_primary, sort_order)`)
    .eq('in_stock', true)
    .limit(8)
    .order('sort_order')

  // New arrivals (featured products)
  const { data: newArrivals } = await supabase
    .from('products')
    .select(`*, images:product_images(url, alt_text, is_primary, sort_order)`)
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(4)
    .order('created_at', { ascending: false })

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
      <section className="hero-section relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(140deg, rgba(11,11,14,.88) 0%, rgba(13,27,42,.82) 40%, rgba(10,15,24,.75) 100%)'
          }} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-deco" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-[680px]">
            <div className="sivo-seal-badge mb-4 inline-block" style={{ animation: 'heroReveal .8s ease .15s both' }}>
              Est. 2024 · Trade Only · UK Registered
            </div>
            <h1 className="font-serif text-[clamp(34px,5.5vw,66px)] font-light leading-[1.08] text-white mb-5" style={{ animation: 'heroReveal .8s ease .4s both' }}>
              Handcrafted Furniture,<br />
              <em className="text-[var(--gold)] italic font-normal">Produced to UK Standards</em>
            </h1>
            <p className="text-[15px] text-[var(--muted)] leading-[1.8] max-w-[540px] mb-7" style={{ animation: 'heroReveal .8s ease .6s both' }}>
              Furniture made for life. A curated collection of solid wood, metal, and mixed-material pieces — produced under SIVO specifications, quality-controlled at source, and delivered with full compliance documentation.
            </p>
            <div className="flex flex-wrap gap-3" style={{ animation: 'heroReveal .8s ease .8s both' }}>
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
            <div className="flex items-center gap-2 mt-9" style={{ animation: 'heroReveal .8s ease 1s both' }}>
              <span className="text-[9px] tracking-[2px] text-[var(--muted)] uppercase">
                🇬🇧 UK Registered · VAT Registered · Compliance-Led · Trade Accounts Only
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTAINER COUNTDOWN ─── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-5 relative z-[5]">
        <div className="card shimmer" style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          borderColor: 'rgba(255,167,38,.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" style={{ display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'var(--orange, #ffa726)', fontWeight: 500 }}>
              🚢 Next Shipment Window: March 2026
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 11, color: 'var(--txt)' }}>
              Order by <b style={{ color: '#fff' }}>28 Feb</b> to reserve container space
            </span>
            <div style={{ width: 120, height: 6, borderRadius: 50, background: 'var(--surface)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 50, width: '65%', background: 'linear-gradient(90deg, var(--gold), #ffa726)' }} />
            </div>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>65% allocated</span>
          </div>
        </div>
      </div>

      {/* ─── TRADE PROMISE STRIP (4 icons) ─── */}
      <section style={{ padding: 0, borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
            {[
              { i: '🇬🇧', t: 'UK-Based Trade Support', d: 'Dedicated account management' },
              { i: '🚢', t: 'Lead-Time Clarity', d: 'Scheduled container windows' },
              { i: '🔒', t: 'Trade Accounts Only', d: 'Approved retailers & designers' },
              { i: '✨', t: 'Crafted with Purpose', d: 'Artisan-made, compliance-led' },
            ].map((s, idx) => (
              <div key={s.t} style={{
                padding: '24px 16px',
                borderRight: idx < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.i}</div>
                <div style={{ fontSize: 11, color: '#fff', fontWeight: 500, letterSpacing: '0.5px' }}>{s.t}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPLIANCE BADGES ─── */}
      <section style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', background: 'rgba(201,169,110,.02)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['BS EN Tested', 'REACH Compliant', 'FSC Certified', 'UK & VAT Registered', 'Documentation Included'].map(t => (
            <span key={t} className="sivo-seal-badge">{t}</span>
          ))}
        </div>
      </section>

      {/* ─── WHY SIVO PILLARS ─── */}
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="sub-label">The SIVO Difference</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 46px)', color: '#fff', lineHeight: 1.15, marginTop: 8 }}>
              Why Independent Retailers Choose SIVO
            </h2>
            <div className="gold-line" style={{ margin: '10px auto 0', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { i: '🔬', t: 'Controlled Production', d: 'Every product manufactured through our vetted production network. Dual-stage QC — pre-production material checks and pre-shipment final inspection.' },
              { i: '🇬🇧', t: 'UK Compliance Built In', d: 'BS EN structural testing, REACH chemical compliance, and FSC timber certification where applicable. Documentation provided with every order.' },
              { i: '🚢', t: 'Consolidated Shipping', d: 'Mixed SKU orders consolidated into scheduled container shipments. Regular windows reduce per-unit freight and simplify your buying cycle.' },
              { i: '🤝', t: 'Personal Trade Support', d: 'Dedicated UK-based account manager. In-person trade viewings with samples. We visit your store. Reply within 24 hours guaranteed.' },
            ].map(s => (
              <div key={s.t} className="card card-glow" style={{ padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{s.i}</div>
                <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 18, color: '#fff', marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIGNATURE COLLECTION BANNER (Amravati) ─── */}
      <section className="coll-banner">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <span className="sub-label">Signature Collection</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#fff', lineHeight: 1.15, margin: '8px 0 16px' }}>
                The Amravati<br /><em style={{ color: 'var(--gold)' }}>Dining Collection</em>
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
                Solid acacia wood with signature iron hairpin legs. Available in multiple table sizes with complementary seating and storage — designed to work as a complete retail range.
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {[{ n: '8', l: 'Pieces' }, { n: '3', l: 'Table Sizes' }, { n: 'Mixed', l: 'SKU Ordering' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 24, color: 'var(--gold)' }}>{s.n}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">Shop Amravati</Link>
                <Link href="/collections" className="btn-outline text-sm tracking-wider uppercase">All Collections →</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(featuredProducts || []).slice(0, 4).map((p: any) => {
                const img = p.images?.find((i: any) => i.is_primary)?.url || p.images?.[0]?.url
                return (
                  <Link key={p.id} href={`/catalog/${p.slug}`}
                        className="card card-glow" style={{ aspectRatio: '1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
                    {img ? (
                      <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 32, opacity: 0.2 }}>🪑</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIVO SAMPLE PROGRAMME ─── */}
      <section className="section" style={{ background: 'linear-gradient(140deg, var(--navy), var(--dark))' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <span className="sub-label">UK-Based Samples</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(26px,3vw,38px)', color: '#fff', marginBottom: 16 }}>SIVO Sample Programme</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
                We keep core product samples in the UK. Request a personal viewing at our showroom or we&apos;ll bring samples to your store. See the finish, feel the quality, assess the weight — before you commit.
              </p>
              <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                {['UK-held hero samples across collections', 'Sample fee credited against first production order', 'Personal delivery to your store on request'].map(t => (
                  <div key={t} className="card" style={{ padding: 14, borderLeft: '3px solid var(--gold)' }}>
                    <span style={{ fontSize: 11, color: '#fff' }}>✓ {t}</span>
                  </div>
                ))}
              </div>
              <Link href="/trade-viewing" className="btn-gold text-sm tracking-wider uppercase">
                Book a Sample Viewing →
              </Link>
            </div>
            <div className="card card-glow shimmer" style={{ padding: 32, textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🇬🇧</div>
              <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 20, color: '#fff', marginBottom: 8 }}>We Visit You</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                SIVO visits independent UK retailers with finish samples, hero items, and collection catalogues. No trade show — personal appointments only.
              </div>
              <div className="sivo-seal-badge" style={{ display: 'inline-block', marginTop: 16 }}>Appointment Only</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="section">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              <span className="sub-label">Just Added</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#fff', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                New Arrivals
                <span style={{
                  display: 'inline-flex', padding: '2px 8px',
                  background: 'var(--gold)', color: 'var(--dark)',
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  borderRadius: 50, verticalAlign: 'middle',
                }}>
                  {newArrivals.length} NEW
                </span>
              </h2>
              <div className="gold-line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {newArrivals.map((p: any) => {
                const img = p.images?.find((i: any) => i.is_primary)?.url || p.images?.[0]?.url
                return (
                  <Link key={p.id} href={`/catalog/${p.slug}`} className="card card-glow" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--surface)', overflow: 'hidden' }}>
                      {img ? (
                        <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 32, opacity: 0.2 }}>🪑</span>
                        </div>
                      )}
                      <span className="sivo-seal-badge" style={{
                        position: 'absolute', top: 8, left: 8,
                        background: 'rgba(26,26,30,.85)', backdropFilter: 'blur(8px)',
                        fontSize: 8, padding: '3px 8px',
                      }}>
                        SIVO VERIFIED
                      </span>
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'var(--gold)', color: 'var(--dark)',
                        fontSize: 9, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 4, letterSpacing: '0.5px',
                      }}>
                        NEW
                      </span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 15, color: '#fff', marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginBottom: 6 }}>{p.sku}</div>
                      {p.trade_price && (
                        <div style={{ fontSize: 18, color: 'var(--gold)', fontFamily: 'var(--f1, Georgia, serif)', fontStyle: 'italic' }}>
                          £{p.trade_price} <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'normal' }}>per unit</span>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── MATERIAL GUIDES PREVIEW ─── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
            <div style={{ padding: 32 }}>
              <span className="sub-label">Trade Knowledge</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#fff', margin: '8px 0 16px' }}>
                Material Guides
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
                Detailed specifications for every material in the SIVO collection. Help your clients choose the right products for their projects.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className="sivo-seal-badge">🌳 Acacia</span>
                <span className="sivo-seal-badge">🥭 Mango</span>
                <span className="sivo-seal-badge">🏛️ Marble</span>
                <span className="sivo-seal-badge">⚙️ Metal</span>
              </div>
              <Link href="/material-guides" className="btn-gold text-sm tracking-wider uppercase">
                View Material Guides →
              </Link>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,.06), transparent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Care sheets · Specifications · Comparison tables</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIVO VISUALISE™ ─── */}
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'center' }}>
            <div className="card card-glow shimmer" style={{
              padding: 32, textAlign: 'center', position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)',
            }}>
              <div style={{ fontSize: 72, marginBottom: 12, filter: 'drop-shadow(0 4px 20px rgba(201,169,110,.2))' }}>🔄</div>
              <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 22, color: '#fff', marginBottom: 4 }}>SIVO Visualise™</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>3D &amp; AR Product Viewer</div>
            </div>
            <div>
              <span className="sub-label">Product Technology</span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(26px,3vw,38px)', color: '#fff', marginBottom: 12 }}>
                Plan Your Floor Layout<br />Before You Order
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
                View products in interactive 3D or place them in your showroom using augmented reality. Accurate to real-world dimensions — helping you plan displays, check proportions, and show customers before stock arrives.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className="sivo-seal-badge">🔄 View 3D Model</span>
                <span className="sivo-seal-badge">📱 Visualise in Your Space (AR)</span>
                <span className="sivo-seal-badge">📄 Download Spec Sheet</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                Compatible with iOS AR Quick Look and Android Scene Viewer. Accurate scaling to real dimensions. Available on selected products.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY ─── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="sub-label">Browse by Category</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 46px)', color: '#fff', lineHeight: 1.15, marginTop: 8 }}>Full Collection</h2>
            <div className="gold-line" style={{ margin: '10px auto 0', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
            {(categories || []).map((c: any) => (
              <Link key={c.slug} href={`/catalog?cat=${c.slug}`}
                    className="card card-glow" style={{ padding: 20, textAlign: 'center', cursor: 'pointer', textDecoration: 'none' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{catIcons[c.name] || '📦'}</div>
                <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 16, color: '#fff' }}>{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section" style={{ background: 'linear-gradient(140deg, var(--navy), var(--dark))' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="sub-label">Getting Started</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', color: '#fff', marginTop: 8 }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { i: '👤', t: 'Apply', d: 'Trade accounts for UK retailers, designers, and hospitality buyers. Reviewed within 1–2 days.' },
              { i: '🛒', t: 'Build Your Basket', d: 'Browse collections. Add mixed SKUs. Meet per-SKU MOQs. Submit one quote.' },
              { i: '🔬', t: 'Production & QC', d: '8–10 week production. Dual-stage quality control. Progress updates throughout.' },
              { i: '🚚', t: 'UK Delivery', d: 'Consolidated container shipping. Full compliance documentation. Delivered to your door.' },
            ].map(s => (
              <div key={s.t} className="card card-glow shimmer" style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{s.i}</div>
                <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 18, color: '#fff', marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,169,110,.06), transparent)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🇬🇧</div>
          <h2 className="font-serif" style={{ fontSize: 36, color: '#fff', marginBottom: 8 }}>Apply for a SIVO Trade Account</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 auto 24px', lineHeight: 1.7 }}>
            Access trade pricing, book personal viewings, and order from our full collection. Approval within 1–2 working days.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
              Apply for Trade Account
            </Link>
            <Link href="/trade-viewing" className="btn-outline text-sm tracking-wider uppercase">
              Book a Trade Viewing
            </Link>
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 12 }}>
            ✓ Trade accounts only · ✓ No obligation · ✓ UK-based support
          </div>
        </div>
      </section>
    </div>
  )
}
