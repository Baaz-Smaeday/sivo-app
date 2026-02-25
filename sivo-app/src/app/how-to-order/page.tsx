import Link from 'next/link'

export default function HowToOrderPage() {
  return (
    <div className="pt-[80px]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-[10px] font-semibold tracking-[3px] uppercase text-brand-gold mb-4">How to Order</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-white mb-6">Simple, Transparent Ordering</h1>
        <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
          From first enquiry to delivery at your door — here&apos;s exactly how ordering with SIVO works.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-8">
          {[
            {
              step: '1',
              title: 'Apply for a Trade Account',
              desc: 'Complete our short application form. We verify your business credentials and approve accounts within 1–2 working days. Once approved, you get full access to trade pricing across our entire collection.',
            },
            {
              step: '2',
              title: 'Browse & Select Products',
              desc: 'Explore our curated collection with detailed product information, trade prices, and MOQs. Use our order calculator to build your selection and see live totals. Request samples if you need to see finishes in person.',
            },
            {
              step: '3',
              title: 'Request a Quote',
              desc: 'Add products to your quote basket and submit. Your account manager will review your selection, confirm availability and lead times, and provide a formal quote within 24 hours.',
            },
            {
              step: '4',
              title: 'Confirm & Pay Deposit',
              desc: 'Once you\'re happy with the quote, confirm your order with a 50% deposit. We accept bank transfer (BACS). The remaining 50% is due before shipping.',
            },
            {
              step: '5',
              title: 'Production & Quality Check',
              desc: 'Your order goes into production at our partner workshops. We conduct quality inspections at the factory before shipping. You\'ll receive progress updates from your account manager.',
            },
            {
              step: '6',
              title: 'Shipping & Delivery',
              desc: 'Orders ship via consolidated container from India. Typical lead time is 8–10 weeks from order confirmation. We handle all logistics, customs clearance, and deliver to your UK address.',
            },
          ].map(item => (
            <div key={item.step} className="card p-6 flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-bg font-serif text-xl font-bold">
                {item.step}
              </div>
              <div className="pt-[80px]">
                <h3 className="font-serif text-xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-surface border-y border-brand-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-white text-center mb-10">Common Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'What is the minimum order quantity?', a: 'MOQs vary by product, typically 4–30 units. These are shown on each product page. We can sometimes accommodate lower quantities for first orders.' },
              { q: 'Can I mix products in one order?', a: 'Yes. You can combine different products in a single container to meet minimum shipping volumes. Your account manager will help optimise your order.' },
              { q: 'Do you offer samples?', a: 'Yes. We can send finish swatches and small samples for most products. For larger items, we recommend booking a virtual or in-person viewing.' },
              { q: 'What about customs and import duties?', a: 'All our pricing is ex-works. Import duty and VAT are payable on arrival in the UK. We provide all necessary documentation for smooth customs clearance.' },
              { q: 'Can I request custom sizes or finishes?', a: 'Absolutely. Our artisan partners can accommodate custom specifications. Discuss requirements with your account manager for pricing and lead times.' },
            ].map(item => (
              <div key={item.q} className="card p-6">
                <h3 className="text-white font-medium mb-2">{item.q}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center px-4 py-16">
        <h2 className="font-serif text-3xl text-white mb-4">Ready to Get Started?</h2>
        <p className="text-brand-muted mb-8">Apply for a trade account and your account manager will guide you through your first order.</p>
        <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
          Apply for Trade Account
        </Link>
      </section>
    </div>
  )
}
