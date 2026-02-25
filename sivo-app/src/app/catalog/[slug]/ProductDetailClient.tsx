'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useBasket } from '@/lib/basket'

export default function ProductDetailClient({ product, related }: { product: any; related: any[] }) {
  const [canSeePrice, setCanSeePrice] = useState(false)
  const [qty, setQty] = useState(product.moq || 1)
  const [added, setAdded] = useState(false)
  const supabase = createClient()
  const { addItem, items } = useBasket()

  const inBasket = items.find((i: any) => i.productId === product.id)
  const primaryImage = product.images?.find((i: any) => i.is_primary)?.url || product.images?.[0]?.url || null

  const handleAddToBasket = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.trade_price,
      moq: product.moq,
      qty: qty,
      image: primaryImage,
      materials: product.materials,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .single()
        if (profile?.role === 'admin' || profile?.status === 'approved') {
          setCanSeePrice(true)
        }
      }
    }
    checkAccess()
  }, [])

  const total = product.trade_price * qty

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-brand-muted mb-6">
        <Link href="/catalog" className="hover:text-brand-gold transition-colors">Collection</Link>
        <span>/</span>
        {product.category && (
          <>
            <span className="hover:text-brand-gold">{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-brand-text">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square bg-brand-surface rounded-lg overflow-hidden">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted">
              <div className="text-center">
                <div className="text-6xl mb-4">🪑</div>
                <p className="text-sm">Product image coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <div className="text-[10px] font-semibold tracking-[2px] uppercase text-brand-gold mb-2">
              {product.category.name}
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">{product.name}</h1>

          <div className="text-xs text-brand-muted mb-4">SKU: {product.sku}</div>

          {/* Price */}
          {canSeePrice ? (
            <div className="mb-6">
              <div className="font-serif text-3xl text-brand-gold">
                £{product.trade_price.toLocaleString()}
              </div>
              <div className="text-xs text-brand-muted">per unit · wholesale trade price</div>
              {product.rrp && (
                <div className="text-xs text-brand-muted mt-1">
                  RRP: £{product.rrp.toLocaleString()}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-brand-surface border border-brand-border rounded-lg">
              <p className="text-sm text-brand-muted">
                <Link href="/auth?tab=login" className="text-brand-gold hover:underline font-medium">
                  Login
                </Link>
                {' '}or{' '}
                <Link href="/auth?tab=register" className="text-brand-gold hover:underline font-medium">
                  apply for a trade account
                </Link>
                {' '}to see wholesale pricing.
              </p>
            </div>
          )}

          {/* Order Calculator */}
          {canSeePrice && (
            <div className="card p-5 mb-6">
              <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-muted mb-3">Order Calculator</div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-brand-muted">Quantity</span>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQty(Math.max(product.moq, qty - 1))}
                    className="w-10 h-10 border border-brand-border text-brand-text rounded-l flex items-center justify-center hover:bg-brand-surface"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="w-16 h-10 bg-brand-surface border-y border-brand-border text-center text-white text-sm"
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 border border-brand-border text-brand-text rounded-r flex items-center justify-center hover:bg-brand-surface"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Order Total</span>
                <span className="font-serif text-2xl text-brand-gold">
                  £{total.toLocaleString()}
                </span>
              </div>
              <div className="text-[10px] text-brand-muted">
                MOQ: {product.moq} units · 50% deposit to confirm
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.materials && (
              <div className="card p-4">
                <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-gold mb-1">Material</div>
                <div className="text-sm text-white">{product.materials}</div>
              </div>
            )}
            {product.dimensions && (
              <div className="card p-4">
                <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-gold mb-1">Dimensions</div>
                <div className="text-sm text-white">{product.dimensions}</div>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="card p-4 mb-6">
              <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-gold mb-2">Description</div>
              <p className="text-sm text-brand-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: '🇬🇧', label: 'UK Registered' },
              { icon: '📦', label: `${product.lead_time_days ? Math.round(product.lead_time_days / 7) : '8–10'} Wk Lead` },
              { icon: '✅', label: 'Docs on Request' },
              { icon: '🌿', label: 'FSC Where Applicable' },
            ].map(badge => (
              <div key={badge.label} className="card p-3 text-center">
                <div className="text-lg mb-1">{badge.icon}</div>
                <div className="text-[9px] text-brand-muted tracking-wider">{badge.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {canSeePrice ? (
            <button onClick={handleAddToBasket}
                    className={`w-full text-sm tracking-wider uppercase py-3 px-6 rounded transition-all duration-300 font-semibold ${
                      added || inBasket
                        ? 'bg-emerald-600 text-white'
                        : 'btn-gold'
                    }`}>
              {added ? '✓ Added to Quote Basket!' : inBasket ? `✓ In Quote Basket (${inBasket.qty})` : '+ Add to Quote Basket'}
            </button>
          ) : (
            <Link href="/auth?tab=register" className="btn-gold w-full text-sm tracking-wider uppercase block text-center">
              Apply for Trade Account
            </Link>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p: any) => {
              const img = p.images?.find((i: any) => i.is_primary)?.url || p.images?.[0]?.url || null
              return (
                <Link href={`/catalog/${p.slug}`} key={p.id} className="card group overflow-hidden hover:border-brand-gold/30 transition-colors">
                  <div className="aspect-square bg-brand-surface">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted text-3xl">🪑</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs text-white font-medium group-hover:text-brand-gold transition-colors">{p.name}</h3>
                    <div className="text-[10px] text-brand-muted mt-1">{p.materials}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
