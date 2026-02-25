'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBasket } from '@/lib/basket'
import { createClient } from '@/lib/supabase-browser'

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
      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?tab=login')
        return
      }

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, company_id, status')
        .eq('id', user.id)
        .single()

      if (!profile) {
        setError('Profile not found. Please contact support.')
        setSubmitting(false)
        return
      }

      if (profile.status !== 'approved' && profile.status !== 'admin') {
        // Check if admin role
        const { data: p2 } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (p2?.role !== 'admin') {
          setError('Your trade account must be approved before submitting quotes.')
          setSubmitting(false)
          return
        }
      }

      // Generate ref ID
      const { data: refData } = await supabase.rpc('next_quote_ref')
      const refId = refData || `SIVO-QR-${Date.now()}`

      // Create quote request
      const { data: quote, error: quoteErr } = await supabase
        .from('quote_requests')
        .insert({
          ref_id: refId,
          profile_id: profile.id,
          company_id: profile.company_id,
          status: 'pending',
          notes: notes || null,
          total_estimate: totalPrice,
        })
        .select('id, ref_id')
        .single()

      if (quoteErr) {
        setError('Failed to create quote: ' + quoteErr.message)
        setSubmitting(false)
        return
      }

      // Create quote items
      const quoteItems = items.map(item => ({
        quote_id: quote.id,
        product_id: item.productId,
        quantity: item.qty,
        unit_price: item.price,
        line_total: item.price * item.qty,
      }))

      const { error: itemsErr } = await supabase
        .from('quote_items')
        .insert(quoteItems)

      if (itemsErr) {
        setError('Failed to save quote items: ' + itemsErr.message)
        setSubmitting(false)
        return
      }

      // Success
      setSubmitted(quote.ref_id)
      clearBasket()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }

    setSubmitting(false)
  }

  // Success screen
  if (submitted) {
    return (
      <div className="pt-[80px] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="font-serif text-3xl text-white mb-3">Quote Submitted!</h1>
          <div className="card card-glow shimmer p-4 mb-6">
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--muted)] mb-1">
              Reference Number
            </div>
            <div className="font-mono text-xl text-[var(--gold)] font-bold">{submitted}</div>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            We&apos;ll review your quote request and respond within 1–2 working days with a formal quotation including shipping costs and payment terms.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="btn-gold text-sm tracking-wider uppercase">
              View My Quotes
            </Link>
            <Link href="/catalog" className="btn-outline text-sm tracking-wider uppercase">
              Continue Shopping
            </Link>
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
              <Link href="/catalog" className="btn-gold text-sm tracking-wider uppercase">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              {/* Items */}
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.productId} className="card card-glow shimmer p-4 flex gap-4">
                    <div className="w-20 h-20 rounded bg-[var(--surface)] overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🪑</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-white font-medium">{item.name}</h3>
                      <div className="text-[10px] text-[var(--muted)]">
                        {item.sku} · {item.materials} · MOQ: {item.moq}
                      </div>
                      <div className="text-sm text-[var(--gold)] mt-1">
                        £{item.price.toLocaleString()} per unit
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.productId, item.qty - 1)}
                                className="w-7 h-7 border border-[var(--border)] rounded text-xs hover:border-[var(--gold)]">−</button>
                        <input type="number" value={item.qty}
                               onChange={(e) => updateQty(item.productId, parseInt(e.target.value) || item.moq)}
                               className="w-14 h-7 bg-[var(--surface)] border border-[var(--border)] rounded text-center text-white text-xs" />
                        <button onClick={() => updateQty(item.productId, item.qty + 1)}
                                className="w-7 h-7 border border-[var(--border)] rounded text-xs hover:border-[var(--gold)]">+</button>
                      </div>
                      <div className="font-serif text-lg text-[var(--gold)]">
                        £{(item.price * item.qty).toLocaleString()}
                      </div>
                      <button onClick={() => removeItem(item.productId)}
                              className="text-[10px] text-red-400 hover:text-red-300">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar */}
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
                  <div className="text-[10px] text-[var(--muted)] mb-4">
                    Shipping calculated in formal quote · 50% deposit to confirm
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="input-label">Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Special requirements, delivery preferences, custom finishes..."
                      rows={3}
                      className="input-field text-xs"
                    />
                  </div>

                  {error && (
                    <div className="text-xs text-red-400 mb-3 p-2 bg-red-400/10 rounded">{error}</div>
                  )}

                  <button onClick={handleSubmit}
                          disabled={submitting}
                          className="btn-gold w-full text-sm tracking-wider uppercase disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Quote Request'}
                  </button>

                  <div className="text-[10px] text-[var(--muted)] text-center mt-3">
                    We&apos;ll respond within 1–2 working days
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
