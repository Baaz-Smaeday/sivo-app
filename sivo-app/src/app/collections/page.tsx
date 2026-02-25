import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

export default async function CollectionsPage() {
  const supabase = createClient()
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('name')

  const staticCollections = [
    {
      name: 'Mango Heritage',
      desc: 'Solid mango wood with natural grain variation. Warm honey tones that deepen over time. Traditional joinery meets contemporary silhouettes — designed for the UK living and dining space.',
      tags: ['Solid Mango', 'Natural Finish', 'UK Fire Tested'],
      count: 8,
    },
    {
      name: 'Acacia Industrial',
      desc: 'Live-edge acacia wood paired with blackened iron frames. Raw, honest materials that bring character to modern retail and hospitality settings.',
      tags: ['Live Edge', 'Iron Base', 'Contract Grade'],
      count: 6,
    },
    {
      name: 'Marble & Iron',
      desc: 'White and green marble tops on geometric iron bases. Statement pieces for boutique retail, high-end residential, and commercial interiors.',
      tags: ['Natural Marble', 'Iron Frame', 'Statement Pieces'],
      count: 5,
    },
    {
      name: 'Reclaimed Teak',
      desc: 'Sustainably sourced reclaimed teak with visible history — nail marks, weathering, and patina. Each piece is genuinely unique.',
      tags: ['Reclaimed', 'Sustainable', 'Unique Patina'],
      count: 4,
    },
    {
      name: 'Sheesham Classic',
      desc: 'Indian rosewood (Sheesham) with deep chocolate grain. The quintessential solid wood range for traditional and transitional UK interiors.',
      tags: ['Sheesham', 'Traditional', 'Durable'],
      count: 7,
    },
    {
      name: 'Bone Inlay',
      desc: 'Hand-cut bone inlay on solid wood. Geometric and floral patterns crafted by specialist artisans in Udaipur. Statement bedroom and living room furniture.',
      tags: ['Handcrafted', 'Bone Inlay', 'Artisan Made'],
      count: 4,
    },
  ]

  const displayCollections = (collections && collections.length > 0) ? collections : staticCollections

  return (
    <div className="pt-[80px]">
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="sub-label">Curated Ranges</span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white mt-2">Signature Collections</h1>
            <div className="gold-line-center" />
            <p className="text-sm text-[var(--muted)] mt-4 max-w-lg mx-auto leading-relaxed">
              Each SIVO collection is designed as a complete retail range — coordinated materials, complementary silhouettes, and mixed SKU ordering to simplify your buying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayCollections.map((c: any) => (
              <div key={c.name} className="card card-glow p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(c.tags || []).map((t: string) => (
                    <span key={t} className="tag tag-gold">{t}</span>
                  ))}
                </div>
                <h2 className="font-serif text-2xl text-white mb-3">{c.name}</h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                  {c.desc || c.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)]">{c.count || '—'} products</span>
                  <Link href={`/catalog?collection=${c.slug || c.name.toLowerCase().replace(/ /g, '-')}`}
                        className="text-xs text-[var(--gold)] hover:text-[var(--gold-l)] transition-colors tracking-wider uppercase">
                    View Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h3 className="font-serif text-2xl text-white mb-3">Need a Custom Range?</h3>
            <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">
              We work with our production partners to create exclusive collections. Custom finishes, sizes, and specifications available.
            </p>
            <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
              Discuss Custom Collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
