'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type Category = {
  id: string
  name: string
  slug: string
}

type Product = {
  id: string
  sku: string
  name: string
  slug: string
  trade_price: number
  rrp: number | null
  moq: number
  materials: string | null
  dimensions: string | null
  description: string | null
  featured: boolean
  category: { name: string; slug: string } | null
  images: { url: string; alt_text: string | null; is_primary: boolean; sort_order: number }[]
}

export default function CatalogClient({
  categories,
  products,
}: {
  categories: Category[]
  products: Product[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [canSeePrice, setCanSeePrice] = useState(false)
  const supabase = createClient()

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

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category?.slug === activeCategory)

  const getPrimaryImage = (product: Product) => {
    const primary = product.images?.find(i => i.is_primary)
    return primary?.url || product.images?.[0]?.url || null
  }

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded text-xs tracking-wider uppercase transition-colors ${
            activeCategory === 'all'
              ? 'bg-brand-gold text-brand-bg font-semibold'
              : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'
          }`}
        >
          All ({products.length})
        </button>
        {categories.map(cat => {
          const count = products.filter(p => p.category?.slug === cat.slug).length
          if (count === 0) return null
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded text-xs tracking-wider uppercase transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-brand-gold text-brand-bg font-semibold'
                  : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'
              }`}
            >
              {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-muted text-lg">No products yet.</p>
          <p className="text-brand-muted text-sm mt-2">Products will appear here once added via the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <Link href={`/catalog/${product.slug}`} key={product.id} className="card group overflow-hidden hover:border-brand-gold/30 transition-colors">
              {/* Image */}
              <div className="aspect-square bg-brand-surface relative overflow-hidden">
                {getPrimaryImage(product) ? (
                  <img
                    src={getPrimaryImage(product)!}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
                    No image
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-brand-gold text-brand-bg text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                {product.category && (
                  <div className="text-[9px] tracking-[1.5px] uppercase text-brand-gold mb-1">
                    {product.category.name}
                  </div>
                )}
                <h3 className="text-sm text-white font-medium mb-2 group-hover:text-brand-gold transition-colors">
                  {product.name}
                </h3>
                {product.materials && (
                  <p className="text-xs text-brand-muted mb-3">{product.materials}</p>
                )}

                {/* Price */}
                {canSeePrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg text-brand-gold">
                      £{product.trade_price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-brand-muted">per unit · trade</span>
                  </div>
                ) : (
                  <div className="text-xs text-brand-muted">
                    <Link href="/auth?tab=login" className="text-brand-gold hover:underline">
                      Login for trade price
                    </Link>
                  </div>
                )}

                {/* MOQ */}
                <div className="text-[10px] text-brand-muted mt-1">
                  MOQ: {product.moq} units
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
