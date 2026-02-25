'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBasket } from '@/lib/basket'
import { createClient } from '@/lib/supabase-browser'

function getDemoCookie(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/sivo-demo-role=([^;]+)/)
  return match ? match[1] : ''
}

export default function QuotePage() {
  const { items, removeItem, updateQty, totalPrice, clearBasket } = useBasket()
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const demoRole = getDemoCookie()

      if (demoRole) {
        // Demo mode — save to localStorage so admin can see it
        await new Promise(r => setTimeout(r, 900))
        const demoRef = `SIVO-QR-DEMO-${Date.now().toString().slice(-4)}`
        const demoOrder = {
          id: `demo-${Date.now()}`,
          ref_id: demoRef,
          status: 'pending',
          created_at: new Date().toISOString(),
          total_estimate: totalPrice,
          notes: notes || null,
          profile: { full_name: 'James Wilson', email: 'buyer@demo.co.uk' },
          company: { name: 'Wilson Interiors Ltd' },
          items: items.map(i => ({
            name: i.name, sku: i.sku, qty: i.qty,
            unit_price: i.price, line_total: i.price * i.qty, image: i.image,
          })),
        }
        try {
          const existing = JSON.parse(localStorage.getItem('sivo_demo_orders') || '[]')
          localStorage.setItem('sivo_demo_orders', JSON.stringify([demoOrder, ...existing]))
        } catch {}
        setSubmitted(demoRef)
        clearBasket()
        setSubmitting(false)
        return
      }

      // Real auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth?tab=login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('id, company_id, status, role').eq('id', user.id).single()

      if (!profile) { setError('Profile not found.'); setSubmitting(false); return }

      if (profile.status !== 'approved' && profile.role !== 'admin') {
        setError('Your trade account must be approved before submitting quotes.')
        setSubmitting(false)
        return
      }

      const { data: refData } = await supabase.rpc('next_quote_ref')
      const refId = refData || `SIVO-QR-${Date.now()}`

      const { data: quote, error: quoteErr } = await supabase
        .from('quote_requests')
        .insert({ ref_id: refId, profile_id: profile.id, company_id: profile.company_id, status: 'pending', notes: notes || null, total_estimate: totalPrice })
        .select('id, ref_id').single()

      if (quoteErr) { setError('Failed to create quote: ' + quoteErr.message); setSubmitting(false); return }

      const { error: itemsErr } = await supabase.from('quote_items').insert(
        items.map(item => ({ quote_id: quote.id, product_id: item.productId, quantity: item.qty, unit_price: item.price, line_total: item.price * item.qty }))
      )

      if (itemsErr) { setError('Failed to save items: ' + itemsErr.message); setSubmitting(false); return }

      setSubmitted(quote.ref_id)
      clearBasket()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div style={{ paddingTop: 80, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#66bb6a',
            color: '#fff', fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 0 32px rgba(102,187,106,.3)',
          }}>✓</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#fff', marginBottom: 6 }}>Quote Submitted!</div>
          <div style={{ padding: '12px 20px', background: 'var(--card)', border: '1px solid rgba(201,169,110,.3)', borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: 4 }}>Reference Number</div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--gold)', fontWeight: 700 }}>{submitted}</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>
            We&apos;ll review your quote request and respond within <b style={{ color: '#fff' }}>1–2 working days</b> with a formal quotation including shipping costs and payment terms.
          </p>
          <div style={{ padding: 18, marginBottom: 20, textAlign: 'left' as const, background: 'rgba(201,169,110,.04)', border: '1px solid rgba(201,169,110,.15)', borderRadius: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: 12 }}>What Happens Next</div>
            {[
              { n: 1, t: 'Quote reviewed',         d: 'Our team checks availability and current lead times', done: true },
              { n: 2, t: 'Formal quotation sent',  d: 'Within 1–2 working days with shipping & payment terms', done: false },
              { n: 3, t: '50% deposit to confirm', d: 'Production begins once deposit is received', done: false },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600,
                  background: s.done ? 'var(--gold)' : 'var(--surface)',
                  color: s.done ? 'var(--dark)' : 'var(--muted)',
                  border: s.done ? 'none' : '1px solid var(--border)',
                }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                  <b style={{ color: '#fff' }}>{s.t}</b> — {s.d}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 24 }}>
            Questions? Contact <b style={{ color: 'var(--gold)' }}>Navi Singh</b> · trade@sivohome.com · +44 7346 325580
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/dashboard" style={{ padding: '10px 24px', background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', textTransform: 'uppercase' as const }}>View My Orders</Link>
            <Link href="/catalog" style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, letterSpacing: 1, color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase' as const }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[80px]">
      <section className="section">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="sub-label">Trade Order</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white mt-2">Review Quote Basket</h1>
            <div className="gold-line mt-2" />
          </div>
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="font-serif text-2xl text-white mb-2">Your basket is empty</h2>
              <p className="text-sm text-[var(--muted)] mb-6">Add products from our collection to build your quote.</p>
              <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">Browse Collection</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.productId} className="card card-glow shimmer p-4 flex gap-4">
                    <div className="w-20 h-20 rounded bg-[var(--surface)] overflow-hidden shrink-0">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🪑</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-white font-medium">{item.name}</h3>
                      <div className="text-[10px] text-[var(--muted)]">{item.sku} · {item.materials} · MOQ: {item.moq}</div>
                      <div className="text-sm text-[var(--gold)] mt-1">£{item.price.toLocaleString()} per unit</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-7 h-7 border border-[var(--border)] rounded text-xs hover:border-[var(--gold)]">−</button>
                        <input type="number" value={item.qty} onChange={(e) => updateQty(item.productId, parseInt(e.target.value) || item.moq)} className="w-14 h-7 bg-[var(--surface)] border border-[var(--border)] rounded text-center text-white text-xs" />
                        <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-7 h-7 border border-[var(--border)] rounded text-xs hover:border-[var(--gold)]">+</button>
                      </div>
                      <div className="font-serif text-lg text-[var(--gold)]">£{(item.price * item.qty).toLocaleString()}</div>
                      <button onClick={() => removeItem(item.productId)} className="text-[10px] text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="card card-glow shimmer p-6 sticky top-[100px]">
                  <h3 className="font-serif text-lg text-white mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    {items.map(item => (
                      <div key={item.productId} className="flex justify-between text-xs">
                        <span className="text-[var(--muted)] truncate mr-2">{item.name} × {item.qty}</span>
                        <span className="text-white shrink-0">£{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-[var(--border)] mb-4" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--muted)]">Subtotal</span>
                    <span className="font-serif text-2xl text-[var(--gold)]">£{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-[var(--muted)] mb-4">Shipping calculated in formal quote · 50% deposit to confirm</div>
                  <div className="mb-4">
                    <label className="input-label">Notes (Optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requirements, delivery preferences, custom finishes..." rows={3} className="input-field text-xs" />
                  </div>
                  {error && <div className="text-xs text-red-400 mb-3 p-2 bg-red-400/10 rounded">{error}</div>}
                  <button onClick={handleSubmit} disabled={submitting} className="btn-gold w-full text-sm tracking-wider uppercase disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Quote Request'}
                  </button>
                  <div className="text-[10px] text-[var(--muted)] text-center mt-3">We&apos;ll respond within 1–2 working days</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
