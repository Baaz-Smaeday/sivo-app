import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      collection:collections(name, slug),
      images:product_images(id, url, alt_text, is_primary, sort_order)
    `)
    .eq('slug', params.slug)
    .single()

  if (!product) notFound()

  // Get related products from same category
  const { data: related } = await supabase
    .from('products')
    .select(`
      id, name, slug, trade_price, materials, moq,
      category:categories(name),
      images:product_images(url, is_primary)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  return <ProductDetailClient product={product} related={related || []} />
}
