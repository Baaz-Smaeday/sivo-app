import { createClient } from '@/lib/supabase-server'
import CatalogClient from './CatalogClient'

export const revalidate = 60

export default async function CatalogPage() {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images(url, alt_text, is_primary, sort_order)
    `)
    .eq('in_stock', true)
    .order('sort_order')

  return (
    <div className="pt-[80px] max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div style={{ marginBottom: 24 }}>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Full Collection</span>
        <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', fontWeight: 400, margin: '0 0 8px' }}>SIVO Collection</h1>
        <div style={{ width: 40, height: 2, background: 'var(--gold)', marginBottom: 8 }} />
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          {products?.length || 0} products across {categories?.length || 0} categories. Trade prices visible to approved accounts.
        </p>
      </div>

      <CatalogClient
        categories={categories || []}
        products={products || []}
      />
    </div>
  )
}
