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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-[10px] font-semibold tracking-[3px] uppercase text-brand-gold mb-2">Trade Collection</div>
        <h1 className="font-serif text-3xl sm:text-4xl text-white">Browse Our Range</h1>
        <p className="text-brand-muted text-sm mt-2">
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
