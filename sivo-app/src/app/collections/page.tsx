import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export const revalidate = 60

export default async function CollectionsPage() {
  const supabase = createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`*, category:categories(name, slug), images:product_images(url, alt_text, is_primary, sort_order)`)
    .eq('in_stock', true)
    .order('sort_order')

  // Get unique collections
  const collectionNames = Array.from(new Set((products || []).map(p => p.collection).filter(Boolean)))

  // Group products by collection
  const collections = collectionNames.map(name => {
    const prods = (products || []).filter(p => p.collection === name)
    const hero = prods[0]
    const heroImg = hero?.images?.find((i: any) => i.is_primary)?.url || hero?.images?.[0]?.url || null
    const cats = Array.from(new Set(prods.map(p => p.category?.name).filter(Boolean)))
    return { name, products: prods, heroImg, categories: cats }
  })

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{
              display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
              color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8,
            }}>Curated Ranges</span>
            <h1 style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px',
            }}>Signature Collections</h1>
            <div style={{
              width: 60, height: 2, margin: '0 auto',
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            }} />
            <p style={{
              fontSize: 13, color: 'var(--muted)', marginTop: 10, maxWidth: 520,
              marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7,
            }}>
              Each SIVO collection is designed as a complete retail range — coordinated materials,
              complementary silhouettes, and mixed SKU ordering to simplify your buying.
            </p>
          </div>

          {/* Collection Grid */}
          {collections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--muted)' }}>Collections coming soon.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}>
              {collections.map(col => (
                <Link key={col.name} href={`/catalog?collection=${encodeURIComponent(col.name)}`}
                  style={{ textDecoration: 'none' }}
                  className="card card-glow"
                >
                  {/* Hero Image */}
                  <div style={{
                    height: 200, background: 'linear-gradient(135deg, var(--surface, #1a1a2e), var(--card))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {col.heroImg ? (
                      <img src={col.heroImg} alt={col.name} style={{
                        height: '85%', objectFit: 'contain',
                        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.4))',
                      }} />
                    ) : (
                      <div style={{ fontSize: 48, opacity: .2 }}>🪑</div>
                    )}
                    {/* Signature badge */}
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 4,
                      border: '1px solid rgba(201,169,110,.2)',
                      fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                      color: 'var(--muted)', background: 'rgba(0,0,0,.3)',
                      backdropFilter: 'blur(4px)',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                      Signature
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: 20 }}>
                    <div style={{
                      fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                      fontSize: 22, color: '#fff', marginBottom: 4,
                    }}>The {col.name} Collection</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
                      {col.products.length} pieces · Mixed SKU ordering available
                    </div>
                    {/* Category tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {col.categories.slice(0, 3).map(cat => (
                        <span key={cat} className="sivo-seal-badge">{cat}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 12 }}>
                      View Collection →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Browse CTA */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/catalog" style={{
              display: 'inline-block', padding: '12px 28px',
              background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4,
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Browse Full Catalogue</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
