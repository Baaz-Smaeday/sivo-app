'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useBasket } from '@/lib/basket'

type Category = { id: string; name: string; slug: string }
type Product = {
  id: string; sku: string; name: string; slug: string;
  trade_price: number; rrp: number | null; moq: number;
  materials: string | null; dimensions: string | null;
  description: string | null; featured: boolean; collection: string | null;
  category: { name: string; slug: string } | null;
  images: { url: string; alt_text: string | null; is_primary: boolean; sort_order: number }[];
}

export default function CatalogClient({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [canSeePrice, setCanSeePrice] = useState(false)
  const supabase = createClient()
  const { addItem, items: basketItems } = useBasket()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
        if (profile?.role === 'admin' || profile?.status === 'approved') setCanSeePrice(true)
      }
    }
    check()
  }, [])

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category?.slug === activeCategory)
  const getImg = (p: Product) => p.images?.find(i => i.is_primary)?.url || p.images?.[0]?.url || null
  const inBasket = (id: string) => basketItems.some(i => i.productId === id)

  // Determine stock status from SKU pattern or random for demo
  const getStockType = (p: Product) => {
    if (p.featured) return 'uk' // Featured items = in UK stock
    return 'lead' // Default = 8-10 week lead
  }

  return (
    <div>
      {/* Mixed SKU Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        background: 'rgba(201,169,110,.06)', border: '1px solid rgba(201,169,110,.12)',
        borderRadius: 8, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13 }}>📦</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>Mixed SKU ordering available</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>· Combine products from different collections into one consolidated shipment</span>
        <Link href="/trade-terms" style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>View trade terms →</Link>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded text-xs tracking-wider uppercase transition-colors ${activeCategory === 'all' ? 'bg-brand-gold text-brand-bg font-semibold' : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'}`}>
          All ({products.length})
        </button>
        {categories.map(cat => {
          const count = products.filter(p => p.category?.slug === cat.slug).length
          if (count === 0) return null
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.slug)} className={`px-4 py-2 rounded text-xs tracking-wider uppercase transition-colors ${activeCategory === cat.slug ? 'bg-brand-gold text-brand-bg font-semibold' : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'}`}>
              {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>No products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(product => {
            const img = getImg(product)
            const stockType = getStockType(product)
            const isInBasket = inBasket(product.id)

            return (
              <div key={product.id} className="card card-glow shimmer" style={{ overflow: 'hidden' }}>
                {/* Image */}
                <Link href={`/catalog/${product.slug}`}>
                  <div className="pc-img">
                    {product.featured && <div className="new-badge">New</div>}
                    {img ? (
                      <img src={img} alt={product.name} />
                    ) : (
                      <div style={{ fontSize: 48, opacity: .3 }}>🪑</div>
                    )}
                    {/* Badges overlay */}
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 2 }}>
                      <span className="sivo-seal-badge">SIVO Verified</span>
                    </div>
                  </div>
                </Link>

                {/* Body */}
                <div className="pc-body">
                  {/* Tags row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    {product.category && (
                      <span style={{
                        display: 'inline-block', padding: '3px 8px', borderRadius: 3,
                        fontSize: 8, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
                        background: 'rgba(201,169,110,.12)', color: 'var(--gold)',
                      }}>{product.category.name}</span>
                    )}
                    {stockType === 'uk' ? (
                      <span className="stock-badge stock-uk">In UK Stock</span>
                    ) : (
                      <span className="stock-badge stock-lead">8-10 Week Lead</span>
                    )}
                  </div>

                  {/* Name + SKU */}
                  <Link href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="pc-name">{product.name}</div>
                  </Link>
                  <div className="pc-code">{product.sku}</div>

                  {/* Specs */}
                  <div className="pc-specs">
                    {product.materials && <>Material: <b>{product.materials}</b><br /></>}
                    {product.dimensions && <>Size: <b>{product.dimensions}</b><br /></>}
                    {product.moq && <>MOQ: <b>{product.moq} units</b></>}
                  </div>

                  {/* Price */}
                  {canSeePrice ? (
                    <>
                      <div className="pc-price">
                        £{product.trade_price.toLocaleString()}{' '}
                        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>per unit</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', margin: '-4px 0 8px' }}>
                        From £{(product.trade_price * product.moq).toLocaleString()}{' '}
                        <span style={{ opacity: .7 }}>({product.moq} units MOQ)</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ margin: '8px 0' }}>
                      <Link href="/auth?tab=login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', background: 'rgba(201,169,110,.06)',
                        border: '1px dashed rgba(201,169,110,.2)', borderRadius: 'var(--r)',
                        fontSize: 11, color: 'var(--gold)', textDecoration: 'none',
                      }}>
                        🔒 Login for trade price
                      </Link>
                    </div>
                  )}

                  {/* Add to basket button */}
                  <button
                    className={`btn-add ${isInBasket ? 'btn-added' : ''}`}
                    onClick={() => addItem({
                      productId: product.id, name: product.name, sku: product.sku,
                      price: product.trade_price, moq: product.moq,
                      image: img, materials: product.materials,
                    })}
                  >
                    {isInBasket ? `✓ In Basket` : '+ Add to Quote Basket'}
                  </button>

                  {/* Save / Project row */}
                  {canSeePrice && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 11, cursor: 'pointer', color: 'var(--muted)', transition: 'color .2s' }}>♡ Save</span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span style={{ fontSize: 11, cursor: 'pointer', color: '#42a5f5' }}>📁 Project</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
