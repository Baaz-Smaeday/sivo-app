import Link from 'next/link'

export default function OrderConfirmationPage() {
  const steps = [
    { num: 1, title: 'Proforma Invoice', desc: "We'll send your proforma invoice within 1 working day for internal approval.", active: true },
    { num: 2, title: '50% Deposit', desc: 'Confirm your order with deposit payment to commence production.', active: false },
    { num: 3, title: 'Production (8–10 weeks)', desc: 'Your order enters production with dual-stage QC.', active: false },
    { num: 4, title: 'UK Delivery', desc: 'Consolidated shipment with full compliance documentation.', active: false },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>

          {/* Success Icon */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: '#66bb6a',
              color: '#fff', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>✓</div>
            <h1 style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 400,
            }}>Order Confirmed</h1>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>
              Your quote has been submitted successfully
            </div>
          </div>

          {/* What Happens Next */}
          <div className="card card-glow shimmer" style={{
            padding: 24, marginBottom: 16,
            background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: 18, color: '#fff', marginBottom: 12,
            }}>What Happens Next</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {steps.map((s) => (
                <div key={s.num} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 13,
                    background: s.active ? 'var(--gold)' : 'var(--surface, #1a1a2e)',
                    color: s.active ? 'var(--dark)' : 'var(--muted)',
                    border: s.active ? 'none' : '1px solid var(--border)',
                  }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                    <b style={{ color: '#fff' }}>{s.title}</b> — {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link href="/dashboard" style={{
              flex: 1, textAlign: 'center', padding: '12px 20px',
              background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4,
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none',
            }}>View My Orders</Link>
            <Link href="/catalog" style={{
              flex: 1, textAlign: 'center', padding: '12px 20px',
              border: '1px solid var(--border)', borderRadius: 4,
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              color: 'var(--muted)', textDecoration: 'none',
            }}>Continue Shopping</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
