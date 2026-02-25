import Link from 'next/link'

export default function TradeTermsPage() {
  return (
    <div className="pt-[80px]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-[10px] font-semibold tracking-[3px] uppercase text-brand-gold mb-4">Trade Terms</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-white mb-6">Clear, Fair Terms</h1>
        <p className="text-brand-muted text-base leading-relaxed max-w-2xl mx-auto">
          We believe in transparent business relationships. Here are our standard trade terms for all approved partners.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-6">
          {[
            {
              title: 'Pricing & Payment',
              items: [
                'All prices quoted are trade/wholesale prices in GBP (£)',
                'Prices are ex-works (EXW) India unless stated otherwise',
                '50% deposit required to confirm order',
                'Remaining 50% due before shipping',
                'Payment via bank transfer (BACS) to our UK account',
                'All invoices issued by SIVO Home Ltd (UK registered)',
              ],
            },
            {
              title: 'Minimum Orders',
              items: [
                'Minimum order quantities (MOQs) apply per product — shown on each product page',
                'First orders: we may flex MOQs to help you test our range',
                'Mixed containers: combine different products to fill a container',
                'Typical container holds £8,000–£15,000 of trade value',
              ],
            },
            {
              title: 'Lead Times & Shipping',
              items: [
                'Standard lead time: 8–10 weeks from order confirmation',
                'UK stock items: 1–2 weeks delivery',
                'Shipping via consolidated 20ft or 40ft container',
                'Full logistics management: factory to your UK address',
                'Customs clearance documentation provided',
                'Import duty and UK VAT payable by buyer on arrival',
              ],
            },
            {
              title: 'Quality & Compliance',
              items: [
                'Quality inspection at factory before shipping',
                'UK fire safety documentation provided on request',
                'HMRC-compliant invoicing on all orders',
                'FSC certification where applicable',
                'Photos of your order sent before dispatch',
              ],
            },
            {
              title: 'Returns & Issues',
              items: [
                'Damage in transit: report within 48 hours of delivery with photos',
                'Manufacturing defects: replacement or credit at our discretion',
                'Custom orders are non-returnable',
                'Stock items: returns accepted within 14 days, restocking fee may apply',
              ],
            },
            {
              title: 'Account Requirements',
              items: [
                'Trade accounts available to UK-registered businesses only',
                'Retailers, interior designers, hospitality operators, and contractors welcome',
                'VAT registration preferred but not required',
                'Applications reviewed within 1–2 working days',
                'SIVO reserves the right to decline applications',
              ],
            },
          ].map(section => (
            <div key={section.title} className="card p-6">
              <h3 className="font-serif text-xl text-white mb-4">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm text-brand-muted leading-relaxed">
                    <span className="text-brand-gold flex-shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-brand-surface border-y border-brand-border py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="font-serif text-3xl text-white mb-4">Questions About Our Terms?</h2>
          <p className="text-brand-muted mb-6">Get in touch with our trade team. We&apos;re happy to discuss any aspect of our terms.</p>
          <div className="text-sm text-brand-muted space-y-1 mb-8">
            <p>Email: <span className="text-brand-gold">trade@sivohome.com</span></p>
            <p>Account Manager: <span className="text-brand-gold">Navi Singh</span></p>
          </div>
          <Link href="/auth?tab=register" className="btn-gold text-sm tracking-wider uppercase">
            Apply for Trade Account
          </Link>
        </div>
      </section>
    </div>
  )
}
