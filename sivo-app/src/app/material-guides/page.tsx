export default function MaterialGuidesPage() {
  const materials = [
    {
      name: 'Acacia Wood',
      icon: '🌳',
      products: 14,
      specs: {
        origin: 'India & South-East Asia',
        durability: 'High',
        hardness: '1,750 Janka',
        grain: 'Varied — streaked, knotted',
        finishes: 'Natural, dark stain, lacquer',
        care: 'Wipe clean, oil annually',
      },
      bestFor: 'High-traffic environments: restaurants, hotels, busy retail spaces. Ideal for dining tables and commercial furniture.',
      advantages: [
        'Extremely durable and hard-wearing',
        'Beautiful natural grain variation',
        'Resistant to scratches and water damage',
        'Sustainably sourced from managed plantations',
        'Takes stain and finish well',
      ],
      considerations: [
        'Grain can be unpredictable',
        'Heavier than mango or pine',
        'Can darken over time with sun exposure',
      ],
    },
    {
      name: 'Mango Wood',
      icon: '🥭',
      products: 12,
      specs: {
        origin: 'India (Rajasthan)',
        durability: 'Medium–High',
        hardness: '1,070 Janka',
        grain: 'Varied — golden, streaked',
        finishes: 'Natural, white wash, dark stain',
        care: 'Wipe clean, oil every 6 months',
      },
      bestFor: 'Residential furniture, bedroom collections, and lifestyle retail. Popular with UK independent stores for its warm, natural character.',
      advantages: [
        'Warm honey tones that deepen with age',
        'Lighter weight than acacia — easier handling',
        'Sustainable — harvested from fruit plantations',
        'Takes paint and stain exceptionally well',
        'Cost-effective solid wood option',
      ],
      considerations: [
        'Softer than acacia — can dent more easily',
        'Needs regular oiling to maintain finish',
        'Colour variation between batches',
      ],
    },
    {
      name: 'Marble',
      icon: '🏛️',
      products: 4,
      specs: {
        origin: 'Makrana, Rajasthan',
        durability: 'High',
        hardness: '3–4 Mohs',
        grain: 'Natural veining — unique per piece',
        finishes: 'Polished, honed, sealed',
        care: 'Use coasters, seal annually',
      },
      bestFor: 'Statement dining tables, coffee tables, and accent pieces. Premium positioning for boutique retail and high-end residential projects.',
      advantages: [
        'Premium look and feel — instant luxury',
        'Each piece genuinely unique',
        'Makrana marble — same quarries as the Taj Mahal',
        'Naturally cool surface',
        'Timeless material that never goes out of style',
      ],
      considerations: [
        'Heavy — requires careful logistics',
        'Can stain if unsealed',
        'More expensive per unit',
        'Requires careful handling in transit',
      ],
    },
    {
      name: 'Recycled / Reclaimed Wood',
      icon: '♻️',
      products: 3,
      specs: {
        origin: 'India — reclaimed sources',
        durability: 'High',
        hardness: 'Varies by source timber',
        grain: 'Unique — nail marks, weathering',
        finishes: 'Natural, wax, clear lacquer',
        care: 'Wipe clean, wax periodically',
      },
      bestFor: 'Eco-conscious retailers, hospitality venues wanting authentic character, and customers who value sustainability and unique pieces.',
      advantages: [
        'Genuinely sustainable — zero new timber',
        'Every piece is one-of-a-kind',
        'Strong storytelling and provenance',
        'Appeals to eco-conscious consumers',
        'Natural weathered patina',
      ],
      considerations: [
        'Inconsistent sizing between batches',
        'May contain old nail marks or imperfections',
        'Limited availability — seasonal sourcing',
      ],
    },
    {
      name: 'Iron & Metal',
      icon: '⚙️',
      products: 20,
      specs: {
        origin: 'India — Jodhpur workshops',
        durability: 'Very High',
        hardness: 'N/A',
        grain: 'N/A — industrial finish',
        finishes: 'Powder coat, raw, blackened',
        care: 'Wipe clean, touch up as needed',
      },
      bestFor: 'Table bases, shelving frames, bar furniture, and contract-grade applications. Used across most SIVO collections as a complementary material.',
      advantages: [
        'Extremely strong and durable',
        'Industrial aesthetic highly popular in UK',
        'Powder coating resists rust and chips',
        'Contract-grade — suitable for hospitality',
        'Pairs beautifully with all wood types',
      ],
      considerations: [
        'Can scratch flooring without felt pads',
        'Heavier shipping weight',
        'Black finishes can show fingerprints',
      ],
    },
    {
      name: 'Sheesham (Indian Rosewood)',
      icon: '🪵',
      products: 5,
      specs: {
        origin: 'India (North)',
        durability: 'Very High',
        hardness: '2,440 Janka',
        grain: 'Tight — deep chocolate with golden streaks',
        finishes: 'Natural, dark, honey',
        care: 'Oil every 6 months, dust regularly',
      },
      bestFor: 'Traditional and transitional UK interiors. Classic solid wood furniture for living rooms, dining rooms, and bedrooms.',
      advantages: [
        'One of the hardest commercial timbers',
        'Deep, rich colour with beautiful grain',
        'Extremely long-lasting — generations of use',
        'Resistant to termites and decay',
        'Classic aesthetic — timeless appeal',
      ],
      considerations: [
        'CITES regulated — ensure documentation',
        'Heavier than most alternatives',
        'Higher price point due to scarcity',
      ],
    },
  ]

  return (
    <div className="pt-[80px]">
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="sub-label">Trade Knowledge</span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white mt-2">Material Guides</h1>
            <div className="gold-line-center" />
            <p className="text-sm text-[var(--muted)] mt-4 max-w-lg mx-auto leading-relaxed">
              Detailed specifications for every material in the SIVO collection. Use these guides to advise your clients and choose the right products for each project.
            </p>
          </div>

          <div className="space-y-8">
            {materials.map(m => (
              <div key={m.name} className="card p-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
                  {/* Left: Specs */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{m.icon}</span>
                      <div>
                        <h2 className="font-serif text-2xl text-white">{m.name}</h2>
                        <div className="text-xs text-[var(--muted)]">{m.products} products in collection</div>
                      </div>
                    </div>

                    {/* Spec Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {Object.entries(m.specs).map(([key, val]) => (
                        <div key={key} className="bg-[var(--surface)] rounded p-3">
                          <div className="text-[9px] font-semibold tracking-[1.5px] uppercase text-[var(--gold)] mb-1">
                            {key}
                          </div>
                          <div className="text-sm text-white">{val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Best For */}
                    <div className="mb-2">
                      <div className="text-sm font-semibold text-[var(--gold)] mb-1">Best For</div>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">{m.bestFor}</p>
                    </div>
                  </div>

                  {/* Right: Advantages & Considerations */}
                  <div className="p-6 sm:p-8 bg-[var(--surface)] border-t lg:border-t-0 lg:border-l border-[var(--border)]">
                    <div className="mb-6">
                      <div className="text-xs font-semibold tracking-wider uppercase text-emerald-400 mb-3">
                        ✓ Advantages
                      </div>
                      <div className="space-y-2">
                        {m.advantages.map(a => (
                          <div key={a} className="text-sm text-[var(--txt)] py-1.5 border-b border-[var(--border)] last:border-0">
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-3">
                        ⚠ Considerations
                      </div>
                      <div className="space-y-2">
                        {m.considerations.map(c => (
                          <div key={c} className="text-sm text-[var(--muted)] py-1.5 border-b border-[var(--border)] last:border-0">
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
