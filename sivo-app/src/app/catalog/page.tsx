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
      <div className="mb-8">
        <span className="sub-label">Full Collection</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-white mt-2">SIVO Collection</h1>
        <div className="gold-line mt-2 mb-3" />
        <p className="text-[var(--muted)] text-sm">
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
