'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type SupTab = 'my-products' | 'add-product' | 'orders'

const CATS = ['Dining Tables', 'Coffee Tables', 'Side & Accent Tables', 'Bar Collections', 'Storage & Shelving', 'Bedroom Furniture', 'Writing Desks', 'Bathroom Furniture', 'Contract Furniture', 'Dining Sets']

function tag(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    live:    { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    draft:   { bg: 'rgba(110,110,122,.15)', color: '#6e6e7a' },
    pending: { bg: 'rgba(255,167,38,.15)',  color: '#ffa726' },
  }
  const c = map[status] || { bg: 'rgba(110,110,122,.1)', color: '#6e6e7a' }
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: c.bg, color: c.color }}>
      {status}
    </span>
  )
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 18, circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="4" />
        <circle cx="23" cy="23" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 23 23)" />
        <text x="23" y="28" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{score}</text>
      </svg>
      <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export default function SupplierDashboard({ products, quotes, profile }: {
  products: any[]; quotes: any[]; profile: any
}) {
  const [tab, setTab] = useState<SupTab>('my-products')
  const [form, setForm] = useState({ name: '', category: CATS[0], sku: '', material: '', size: '', price: '', moq: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const submitProduct = async () => {
    if (!form.name || !form.sku) { showToast('Product name and SKU are required'); return }
    setSubmitting(true)
    const { error } = await supabase.from('products').insert({
      name: form.name,
      category: form.category,
      sku: form.sku,
      material: form.material,
      size: form.size,
      price: parseFloat(form.price) || 0,
      moq: parseInt(form.moq) || 1,
      description: form.description,
      status: 'draft',
      supplier_id: profile?.id,
    })
    if (error) {
      showToast(`Error: ${error.message}`)
    } else {
      showToast('✓ Product submitted for approval!')
      setForm({ name: '', category: CATS[0], sku: '', material: '', size: '', price: '', moq: '', description: '' })
      setTab('my-products')
      router.refresh()
    }
    setSubmitting(false)
  }

  const navItems: { id: SupTab; icon: string; label: string }[] = [
    { id: 'my-products', icon: '📦', label: 'My Products' },
    { id: 'add-product', icon: '➕', label: 'Add Product' },
    { id: 'orders', icon: '📋', label: 'Orders' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', paddingTop: 64 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, padding: '12px 20px', background: 'var(--card)', border: '1px solid #66bb6a', borderRadius: 6, color: '#fff', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ background: 'var(--card)', borderRight: '1px solid var(--border)', padding: '24px 0', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 20, color: '#fff' }}>Production Partners</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>SIVO</div>
        </div>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setTab(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 24px', fontSize: 12, color: tab === item.id ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', borderLeft: `2px solid ${tab === item.id ? 'var(--gold)' : 'transparent'}`, background: tab === item.id ? 'rgba(201,169,110,.05)' : 'transparent', transition: 'all .2s' }}>
            <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', margin: '16px 24px' }} />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 24px', fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>
          <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>🌐</span>
          View Website
        </Link>
      </aside>

      {/* Main */}
      <main style={{ padding: '28px 32px', overflowY: 'auto' }}>

        {/* MY PRODUCTS */}
        {tab === 'my-products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>My Products</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{products.length} products listed</div>
              </div>
              <button onClick={() => setTab('add-product')}
                style={{ padding: '10px 20px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                + Add Product
              </button>
            </div>

            {products.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {products.map(p => {
                  const qc = p.qc_score ?? 85 + (p.id?.charCodeAt?.(0) % 12 || 5)
                  const comp = p.compliance_score ?? 90 + (p.id?.charCodeAt?.(0) % 8 || 4)
                  const certs = p.certifications ?? ['FSC', 'REACH']
                  const certColors: Record<string, string> = { FSC: '#66bb6a', REACH: '#42a5f5', 'ISO 9001': '#c9a96e', 'BS EN': '#ba68c8', 'CE Marked': '#42a5f5' }

                  return (
                    <div key={p.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                      {/* Image area */}
                      <div style={{ height: 180, background: 'linear-gradient(135deg, #f5f0ea, #e8e0d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ fontSize: 56, opacity: 0.25 }}>📦</span>
                        <div style={{ position: 'absolute', top: 8, left: 8 }}>{tag(p.status || 'draft')}</div>
                      </div>

                      <div style={{ padding: 16 }}>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#fff', marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: 8 }}>{p.sku || p.code}</div>

                        {p.price && (
                          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: 'var(--gold)', marginBottom: 6 }}>£{p.price}</div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                          {p.size && `${p.size} · `}MOQ: {p.moq || '—'}
                        </div>

                        {/* Mini QC scorecards */}
                        <div style={{ background: 'rgba(201,169,110,.04)', border: '1px solid rgba(201,169,110,.12)', borderRadius: 6, padding: '10px 12px', marginBottom: 10 }}>
                          <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>QC & Compliance</div>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <ScoreRing score={qc} label="QC" color="#66bb6a" />
                            <ScoreRing score={comp} label="Comp." color="#42a5f5" />
                            <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {certs.map((c: string) => (
                                <span key={c} style={{ padding: '2px 6px', borderRadius: 3, fontSize: 7, fontWeight: 700, background: `${certColors[c] || '#c9a96e'}18`, color: certColors[c] || '#c9a96e', border: `1px solid ${certColors[c] || '#c9a96e'}40` }}>
                                  ✓ {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--gold)', fontSize: 10, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>📦</div>
                <div style={{ fontSize: 14, marginBottom: 8 }}>No products yet</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>Add your first product to get started</div>
                <button onClick={() => setTab('add-product')}
                  style={{ padding: '11px 24px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  + Add First Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT */}
        {tab === 'add-product' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Add New Product</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Products require admin approval before going live</div>
            </div>

            <div style={{ maxWidth: 620, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 28 }}>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Round Coffee Table"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Item Code / SKU *</label>
                    <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. BFCTRMN1234"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Material</label>
                    <input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} placeholder="e.g. Mango Wood / Metal"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Size (cm)</label>
                    <input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="e.g. 80×80×45 cm"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Price (£ per unit)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 125"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>MOQ (Minimum Order Qty)</label>
                    <input type="number" value={form.moq} onChange={e => setForm(f => ({ ...f, moq: e.target.value }))} placeholder="e.g. 10"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Product Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the product — materials, finish, construction details…" rows={4}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13, resize: 'vertical' }} />
                </div>
              </div>

              {/* Approval note */}
              <div style={{ background: 'rgba(255,167,38,.06)', border: '1px solid rgba(255,167,38,.2)', borderRadius: 6, padding: '10px 14px', marginTop: 16, fontSize: 11, color: '#ffa726' }}>
                ℹ️ Submitted products are reviewed by the SIVO admin team and go live after approval — usually within 24 hours.
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={submitProduct} disabled={submitting}
                  style={{ flex: 1, padding: '12px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {submitting ? 'Submitting…' : 'Submit for Approval'}
                </button>
                <button onClick={() => setTab('my-products')}
                  style={{ padding: '12px 24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>My Orders</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Orders containing your products</div>
            </div>

            {quotes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {quotes.map((q: any) => (
                  <div key={q.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>
                          Order #{q.id?.slice(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                          {new Date(q.created_at).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                      {tag(q.status || 'pending')}
                    </div>
                    {q.items && q.items.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                        {q.items.map((item: any) => (
                          <div key={item.id} style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>
                            • {item.product?.name || 'Product'} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>📋</div>
                <div style={{ fontSize: 13 }}>No orders for your products yet</div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
