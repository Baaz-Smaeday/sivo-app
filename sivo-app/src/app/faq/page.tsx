export default function FAQPage() {
  const faqs = [
    { q: 'Who can open a trade account?', a: 'SIVO supplies to UK-based retailers, interior designers, hospitality buyers, and contract furnishers. We require a valid UK business address and VAT number (if applicable) for account approval.' },
    { q: 'What are the minimum order quantities?', a: 'Each product has a per-SKU MOQ, typically 5–20 units. You can mix SKUs across different collections in a single order as long as each SKU meets its individual minimum.' },
    { q: 'Can I mix products from different collections in one order?', a: 'Yes. Our consolidated container system is designed for mixed SKU orders. You can combine dining tables, coffee tables, storage, and more into a single shipment.' },
    { q: 'What are the payment terms?', a: '50% deposit on order confirmation to begin production. 50% balance before dispatch. Payment by bank transfer. Proforma invoices issued at each stage.' },
    { q: 'How long does production and delivery take?', a: 'Standard production is 8–10 weeks. Shipping to UK adds 4–6 weeks. Total door-to-door is typically 12–16 weeks from deposit. We provide updates throughout.' },
    { q: 'Do you hold stock in the UK?', a: 'Currently all orders are produced to order. We are evaluating UK stockholding for bestselling lines. Subscribe for updates on availability.' },
    { q: 'What compliance documentation do you provide?', a: 'BS EN test reports, REACH declarations, FSC certificates, phytosanitary certificates, material declarations, and care sheets. All provided with your shipment.' },
    { q: 'Can I request samples before ordering?', a: 'Yes. We offer a sample service for approved trade accounts. Sample costs are credited against your first production order. Contact us for details.' },
    { q: 'Do you offer bespoke or custom manufacturing?', a: 'Yes. Custom sizes, finishes, and materials are available on qualifying orders. Discuss your requirements with your account manager.' },
    { q: 'What happens if items arrive damaged?', a: 'Report damage with photos within 48 hours of delivery. We review all claims promptly and work with freight partners to resolve issues.' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Common Questions</span>
            <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px' }}>Frequently Asked Questions</h1>
            <div style={{ width: 60, height: 2, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} className="card card-glow shimmer" style={{ padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 16, color: '#fff', marginBottom: 6 }}>{f.q}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
