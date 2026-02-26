'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'products' | 'partners' | 'orders' | 'viewings' | 'approvals' | 'buyers' | 'staff'

const SUPPLIERS = [
  { id: 'raj-wood', name: 'Rajasthan Wood Artisans', loc: 'Jodhpur, Rajasthan', flag: '🇮🇳', spec: 'Acacia & mango wood furniture, recycled wood', rating: 4.9, certs: ['FSC', 'ISO 9001', 'REACH'], tier: 'signature', products: 14, qc: 94, compliance: 97 },
  { id: 'marble-mak', name: 'Makrana Marble Works', loc: 'Makrana, Rajasthan', flag: '🇮🇳', spec: 'Marble dining tables, marble accessories', rating: 4.8, certs: ['ISO 9001', 'CE Marked', 'REACH'], tier: 'preferred', products: 2, qc: 91, compliance: 95 },
  { id: 'metal-ind', name: 'Gujarat Iron & Metal Craft', loc: 'Ahmedabad, Gujarat', flag: '🇮🇳', spec: 'Metal bases, industrial frames, cast iron', rating: 4.7, certs: ['ISO 9001', 'BS EN'], tier: 'standard', products: 1, qc: 88, compliance: 92 },
  { id: 'mango-craft', name: 'Mango Wood Collective', loc: 'Jodhpur, Rajasthan', flag: '🇮🇳', spec: 'Mango wood collections, bedroom, bar furniture', rating: 4.8, certs: ['FSC', 'GOTS', 'ISO 14001'], tier: 'signature', products: 13, qc: 92, compliance: 96 },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
const S = (style: Record<string, any>) => style as React.CSSProperties

const tag = (status: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    pending:   { bg: 'rgba(255,167,38,.15)',  color: '#ffa726' },
    approved:  { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    rejected:  { bg: 'rgba(244,67,54,.15)',   color: '#ef5350' },
    new:       { bg: 'rgba(66,165,245,.15)',  color: '#42a5f5' },
    assigned:  { bg: 'rgba(156,39,176,.15)',  color: '#ba68c8' },
    confirmed: { bg: 'rgba(201,169,110,.15)', color: '#c9a96e' },
    completed: { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    shipped:   { bg: 'rgba(66,165,245,.15)',  color: '#42a5f5' },
    delivered: { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    live:      { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    draft:     { bg: 'rgba(110,110,122,.15)', color: '#6e6e7a' },
    archived:  { bg: 'rgba(244,67,54,.1)',    color: '#ef5350' },
  }
  const c = map[status] || { bg: 'rgba(110,110,122,.1)', color: '#6e6e7a' }
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: c.bg, color: c.color }}>
      {status}
    </span>
  )
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 20, c = 2 * Math.PI * r
  const fill = (score / 100) * c
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
          transform="rotate(-90 26 26)" />
        <text x="26" y="31" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{score}</text>
      </svg>
      <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function QCScorecard({ product }: { product: any }) {
  const qcScore = product.qc_score ?? Math.floor(82 + Math.random() * 16)
  const compScore = product.compliance_score ?? Math.floor(88 + Math.random() * 10)
  const certs = product.certifications ?? ['FSC', 'REACH']
  const certColors: Record<string, string> = { FSC: '#66bb6a', REACH: '#42a5f5', 'ISO 9001': '#c9a96e', 'BS EN': '#ba68c8', 'CE Marked': '#42a5f5', GOTS: '#66bb6a', 'ISO 14001': '#4db6ac' }

  return (
    <div style={{ background: 'rgba(201,169,110,.04)', border: '1px solid rgba(201,169,110,.15)', borderRadius: 8, padding: '12px 16px' }}>
      <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>QC & Compliance</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10 }}>
        <ScoreRing score={qcScore} label="QC" color="#66bb6a" />
        <ScoreRing score={compScore} label="Compliance" color="#42a5f5" />
        <div style={{ flex: 1 }}>
          {[
            { l: 'Material Check', v: qcScore > 90 ? 'Passed' : 'Passed', c: '#66bb6a' },
            { l: 'Dimensional QC', v: qcScore > 85 ? 'Passed' : 'Review', c: qcScore > 85 ? '#66bb6a' : '#ffa726' },
            { l: 'UK Standards', v: compScore > 90 ? 'Compliant' : 'Conditional', c: compScore > 90 ? '#42a5f5' : '#ffa726' },
          ].map(row => (
            <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 10 }}>
              <span style={{ color: 'var(--muted)' }}>{row.l}</span>
              <span style={{ color: row.c, fontWeight: 600 }}>{row.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {certs.map((c: string) => (
          <span key={c} style={{ padding: '2px 7px', borderRadius: 3, fontSize: 8, fontWeight: 700, letterSpacing: '0.5px', background: `${certColors[c] || '#c9a96e'}18`, color: certColors[c] || '#c9a96e', border: `1px solid ${certColors[c] || '#c9a96e'}40` }}>
            ✓ {c}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminClient({
  applications, profiles, viewings, quotes, auditLog,
}: {
  applications: any[]; profiles: any[]; viewings: any[]; quotes: any[]; auditLog: any[]
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const [products, setProducts] = useState<any[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [productCat, setProductCat] = useState('All')
  const [productStatus, setProductStatus] = useState('All')
  const [editProduct, setEditProduct] = useState<any>(null)
  const [addingProduct, setAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', material: '', price: '', moq: '', description: '', status: 'draft' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  // ── DEMO ORDERS (added) ──
  const [demoOrders, setDemoOrders] = useState<any[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null)
  // ── STAFF MANAGEMENT ──
  const [staffMembers, setStaffMembers] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('sivo_staff') || '[]') } catch { return [] }
  })
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [editingStaff, setEditingStaff] = useState<number | null>(null)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', department: 'Sales', permissions: [] as string[] })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadProducts()
    // Load demo orders from buyer demo session (added)
    try {
      const orders = JSON.parse(localStorage.getItem('sivo_demo_orders') || '[]')
      setDemoOrders(orders)
    } catch {}
  }, [])

  // Merge demo + real quotes (added)
  const allQuotes = [
    ...demoOrders.map(o => ({ ...o, _demo: true })),
    ...quotes,
  ]

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const approveApp = async (appId: string, email: string) => {
    await supabase.from('trade_applications').update({ status: 'approved' }).eq('id', appId)
    const p = profiles.find(x => x.email === email)
    if (p) await supabase.from('profiles').update({ status: 'approved' }).eq('id', p.id)
    await supabase.from('audit_log').insert({ action: 'APPROVE_BUYER', actor: 'admin', target_type: 'trade_application', target_id: appId, details: { email } })
    showToast('✓ Buyer approved')
    router.refresh()
  }

  const rejectApp = async (appId: string) => {
    await supabase.from('trade_applications').update({ status: 'rejected' }).eq('id', appId)
    showToast('Application rejected')
    router.refresh()
  }

  const updateViewingStatus = async (id: string, status: string) => {
    await supabase.from('viewing_requests').update({ status }).eq('id', id)
    showToast('Viewing updated')
    router.refresh()
  }

  // Update demo order status in localStorage (added)
  const updateDemoOrderStatus = (orderId: string, newStatus: string) => {
    setDemoOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      localStorage.setItem('sivo_demo_orders', JSON.stringify(updated))
      return updated
    })
    showToast('Order status updated')
  }

  const saveProduct = async () => {
    setSaving(true)
    const data = { name: newProduct.name, sku: newProduct.sku, category: newProduct.category, material: newProduct.material, price: parseFloat(newProduct.price) || 0, moq: parseInt(newProduct.moq) || 1, description: newProduct.description, status: newProduct.status }
    if (editProduct) {
      await supabase.from('products').update(data).eq('id', editProduct.id)
      showToast('Product updated')
    } else {
      await supabase.from('products').insert(data)
      showToast('Product added')
    }
    setEditProduct(null); setAddingProduct(false); setNewProduct({ name: '', sku: '', category: '', material: '', price: '', moq: '', description: '', status: 'draft' })
    loadProducts(); setSaving(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    showToast('Product deleted'); loadProducts()
  }

  const openEdit = (p: any) => {
    setEditProduct(p)
    setNewProduct({ name: p.name, sku: p.sku || '', category: p.category || '', material: p.material || '', price: String(p.price || ''), moq: String(p.moq || ''), description: p.description || '', status: p.status || 'draft' })
    setAddingProduct(true)
  }

  // Sidebar nav
  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'partners', icon: '🏭', label: 'Partners' },
    { id: 'orders', icon: '📋', label: 'Orders' },
    { id: 'viewings', icon: '📅', label: 'Viewings' },
    { id: 'approvals', icon: '✅', label: 'Approvals' },
    { id: 'buyers', icon: '👥', label: 'Trade Buyers' },
    { id: 'staff', icon: '🏢', label: 'Staff & Access' },
  ]

  const buyers = profiles.filter(p => p.role === 'buyer')
  // Inject demo buyer so admin always sees at least one buyer in demo
  const demoBuyer = {
    id: 'demo-buyer-1', full_name: 'James Wilson', email: 'buyer@demo.co.uk',
    role: 'buyer', status: 'approved', created_at: new Date().toISOString(),
    company: { name: 'Wilson Interiors Ltd' }, business_type: 'Interior Designer', _demo: true,
  }
  const allBuyers = [...buyers, ...(buyers.find(b => b.email === 'buyer@demo.co.uk') ? [] : [demoBuyer])]

  // ── EXPORT HELPERS ──────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [
      ['Ref', 'Buyer', 'Company', 'Total', 'Status', 'Date'],
      ...allQuotes.map(q => [
        q.ref_id || q.id,
        q.profile?.full_name || 'James Wilson',
        q.company?.name || 'Wilson Interiors Ltd',
        `£${(q.total_estimate || 0).toLocaleString()}`,
        q.status || 'pending',
        new Date(q.created_at).toLocaleDateString('en-GB'),
      ]),
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `SIVO-orders-${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
    showToast('CSV exported')
  }

  const exportPDF = () => {
    const w = window.open('', '_blank')!
    const rows = allQuotes.map(q => `
      <tr>
        <td>${q.ref_id || q.id}</td>
        <td>${q.profile?.full_name || 'James Wilson'}</td>
        <td>${q.company?.name || 'Wilson Interiors Ltd'}</td>
        <td>£${(q.total_estimate || 0).toLocaleString()}</td>
        <td style="text-transform:uppercase;font-size:10px;font-weight:600">${q.status || 'pending'}</td>
        <td>${new Date(q.created_at).toLocaleDateString('en-GB')}</td>
      </tr>`).join('')
    w.document.write(`
      <html><head><title>SIVO Orders Export</title>
      <style>body{font-family:Georgia,serif;padding:40px;color:#1a1a1a}
      h1{font-size:24px;margin-bottom:4px}
      .sub{font-size:12px;color:#666;margin-bottom:32px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#1a1a1a;color:#c9a96e;padding:10px 12px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase}
      td{padding:10px 12px;border-bottom:1px solid #eee}
      tr:nth-child(even) td{background:#fafafa}
      .footer{margin-top:40px;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:12px}
      </style></head><body>
      <h1>SIVO — Quote Requests Export</h1>
      <div class="sub">Generated ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })} · ${allQuotes.length} orders</div>
      <table><thead><tr>
        <th>Reference</th><th>Buyer</th><th>Company</th><th>Total</th><th>Status</th><th>Date</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <div class="footer">SIVO Premium UK Trade Furniture · trade@sivohome.com · +44 7346 325580</div>
      </body></html>`)
    w.document.close(); w.print()
    showToast('PDF ready to print/save')
  }
  const pendingQuotes = allQuotes.filter(q => q.status === 'pending').length // (added)
  const filteredProducts = products.filter(p => {
    const matchSearch = !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.sku?.toLowerCase().includes(productSearch.toLowerCase())
    const matchCat = productCat === 'All' || p.category === productCat
    const matchStatus = productStatus === 'All' || p.status === productStatus
    return matchSearch && matchCat && matchStatus
  })
  const cats = ['All', ...Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', paddingTop: 64 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, padding: '12px 20px', background: 'var(--card)', border: '1px solid #66bb6a', borderRadius: 6, color: '#fff', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ background: 'var(--card)', borderRight: '1px solid var(--border)', padding: '24px 0', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 20, color: '#fff' }}>Admin Panel</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>SIVO</div>
        </div>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setTab(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 24px', fontSize: 12, color: tab === item.id ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', borderLeft: `2px solid ${tab === item.id ? 'var(--gold)' : 'transparent'}`, background: tab === item.id ? 'rgba(201,169,110,.05)' : 'transparent', transition: 'all .2s' }}>
            <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
            {item.id === 'approvals' && pendingApps.length > 0 && (
              <span style={{ marginLeft: 'auto', background: '#ffa726', color: '#000', fontSize: 9, fontWeight: 700, borderRadius: 10, padding: '1px 6px' }}>{pendingApps.length}</span>
            )}
            {/* Badge for pending orders (added) */}
            {item.id === 'orders' && pendingQuotes > 0 && (
              <span style={{ marginLeft: 'auto', background: '#42a5f5', color: '#000', fontSize: 9, fontWeight: 700, borderRadius: 10, padding: '1px 6px' }}>{pendingQuotes}</span>
            )}
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

        {/* ── OVERVIEW ─────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Dashboard Overview</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Welcome back, Navi Singh</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { n: products.length || 30, l: 'Total Products', c: '#c9a96e', ch: '+5 this week', click: 'products' },
                { n: SUPPLIERS.length, l: 'Production Partners', c: '#66bb6a', ch: 'All verified', click: 'partners' },
                { n: viewings.filter(v => v.status === 'new').length, l: 'New Viewings', c: '#42a5f5', ch: 'Schedule now', click: 'viewings' },
                { n: pendingApps.length, l: 'Pending Approvals', c: '#ffa726', ch: 'Review now', click: 'approvals' },
                { n: allQuotes.length, l: 'Total Quotes', c: '#42a5f5', ch: `Active: ${pendingQuotes}`, click: 'orders' }, // (updated to allQuotes)
                { n: `£0`, l: 'Total Revenue', c: '#ffa726', ch: 'This month', click: 'orders' },
              ].map(s => (
                <div key={s.l} onClick={() => setTab(s.click as Tab)} style={{ padding: 20, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', transition: 'all .2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,.4)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
                  <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 32, color: s.c }}>{s.n}</div>
                  <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2 }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: s.c, marginTop: 6 }}>{s.ch}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 18, color: '#fff', marginBottom: 14 }}>Recent Quotes</div>
                {allQuotes.length ? allQuotes.slice(0, 5).map((q: any) => ( // (updated to allQuotes)
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                    <div>
                      <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {q.profile?.full_name || 'Unknown'}
                        {q._demo && <span style={{ fontSize: 8, padding: '1px 5px', background: 'rgba(66,165,245,.15)', color: '#42a5f5', borderRadius: 3, border: '1px solid rgba(66,165,245,.3)' }}>DEMO</span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{q.company?.name || ''} · {new Date(q.created_at).toLocaleDateString('en-GB')} · £{(q.total_estimate || 0).toLocaleString()}</div>
                    </div>
                    {tag(q.status || 'pending')}
                  </div>
                )) : <div style={{ fontSize: 12, color: 'var(--muted)' }}>No quotes yet</div>}
              </div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 18, color: '#fff', marginBottom: 14 }}>Partner QC Summary</div>
                {SUPPLIERS.map(s => (
                  <div key={s.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--txt)' }}>{s.name.split(' ').slice(0, 2).join(' ')}</span>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>QC: <span style={{ color: '#66bb6a', fontWeight: 600 }}>{s.qc}</span></span>
                    </div>
                    <div style={{ height: 4, background: 'var(--surface)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${s.qc}%`, background: 'linear-gradient(90deg, #66bb6a, #a5d6a7)', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ─────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Product Management</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{filteredProducts.length} of {products.length} products</div>
              </div>
              <button onClick={() => { setEditProduct(null); setNewProduct({ name: '', sku: '', category: '', material: '', price: '', moq: '', description: '', status: 'draft' }); setAddingProduct(true) }}
                style={{ padding: '10px 20px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                + Add Product
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search name, SKU…"
                style={{ flex: 1, minWidth: 200, padding: '9px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }} />
              <select value={productCat} onChange={e => setProductCat(e.target.value)}
                style={{ padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={productStatus} onChange={e => setProductStatus(e.target.value)}
                style={{ padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }}>
                {['All', 'live', 'draft', 'archived'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Product table */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface)' }}>
                    {['Product', 'SKU', 'Category', 'Material', 'Price', 'MOQ', 'QC', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => {
                    const qc = p.qc_score ?? 85 + (p.id % 12)
                    const comp = p.compliance_score ?? 90 + (p.id % 8)
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: '#fff' }}>{p.name}</td>
                        <td style={{ padding: '10px 14px', fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{p.sku || '—'}</td>
                        <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--txt)' }}>{p.category || '—'}</td>
                        <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--txt)' }}>{p.material || '—'}</td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--gold)', fontFamily: 'var(--font-serif, Georgia, serif)' }}>£{p.price}</td>
                        <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--txt)' }}>{p.moq || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <div title={`QC: ${qc}/100`} style={{ width: 32, height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${qc}%`, height: '100%', background: qc >= 90 ? '#66bb6a' : qc >= 80 ? '#ffa726' : '#ef5350', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 9, color: qc >= 90 ? '#66bb6a' : '#ffa726' }}>{qc}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>{tag(p.status || 'draft')}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEdit(p)} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--gold)', fontSize: 10, cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => deleteProduct(p.id)} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid rgba(244,67,54,.3)', borderRadius: 4, color: '#ef5350', fontSize: 10, cursor: 'pointer' }}>Del</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No products found</div>
              )}
            </div>
          </div>
        )}

        {/* ── PARTNERS ─────────────────────────────────────────────── */}
        {tab === 'partners' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Production Partners</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{SUPPLIERS.length} partners in network</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {SUPPLIERS.map(s => {
                const tierColors: Record<string, string> = { signature: 'var(--gold)', preferred: '#42a5f5', standard: 'var(--muted)' }
                const tierBg: Record<string, string> = { signature: 'rgba(201,169,110,.1)', preferred: 'rgba(66,165,245,.08)', standard: 'rgba(110,110,122,.06)' }
                const tierLabel: Record<string, string> = { signature: 'Signature Partner', preferred: 'Preferred Partner', standard: 'Standard Partner' }
                return (
                  <div key={s.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, transition: 'all .3s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--navy)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 14, color: 'var(--gold)' }}>
                          {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, color: '#fff' }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.flag} {s.loc}</div>
                        </div>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(76,175,80,.15)', color: '#66bb6a' }}>Approved</span>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 50, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', background: tierBg[s.tier], border: `1px solid ${tierColors[s.tier]}`, color: tierColors[s.tier] }}>
                        {tierLabel[s.tier]}
                      </span>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>{s.spec}</div>
                    {/* QC scorecard inline */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <ScoreRing score={s.qc} label="QC" color="#66bb6a" />
                      <ScoreRing score={s.compliance} label="Compliance" color="#42a5f5" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {s.certs.map(c => (
                            <span key={c} style={{ padding: '2px 6px', borderRadius: 3, fontSize: 8, fontWeight: 700, background: 'rgba(76,175,80,.1)', color: '#66bb6a', border: '1px solid rgba(76,175,80,.2)' }}>✓ {c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
                      <span>{s.products} products · ⭐ {s.rating}</span>
                      <span>Since {2005 + SUPPLIERS.indexOf(s)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ORDERS ─────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Quote Requests</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{allQuotes.length} total · {pendingQuotes} pending</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(66,165,245,.1)', border: '1px solid rgba(66,165,245,.3)', borderRadius: 6, color: '#42a5f5', fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px' }}>
                  <span>⬇</span> CSV
                </button>
                <button onClick={exportPDF} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(201,169,110,.1)', border: '1px solid rgba(201,169,110,.3)', borderRadius: 6, color: '#c9a96e', fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px' }}>
                  <span>📄</span> PDF
                </button>
              </div>
            </div>
            {allQuotes.length > 0 ? ( // (updated to allQuotes)
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allQuotes.map((q: any) => (
                  <div key={q.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                    {/* Clickable header row */}
                    <div onClick={() => setExpandedOrder(expandedOrder === q.id ? null : q.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#fff', fontFamily: 'monospace' }}>{q.ref_id || q.id?.slice(0, 8)}</span>
                          {q._demo && <span style={{ fontSize: 8, padding: '1px 6px', background: 'rgba(66,165,245,.15)', color: '#42a5f5', border: '1px solid rgba(66,165,245,.3)', borderRadius: 3, letterSpacing: '1px' }}>DEMO</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                          {q.profile?.full_name || '—'} · {q.company?.name || '—'} · £{(q.total_estimate || 0).toLocaleString()} · {new Date(q.created_at).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {tag(q.status || 'pending')}
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>{expandedOrder === q.id ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {/* Expanded detail */}
                    {expandedOrder === q.id && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'rgba(0,0,0,.2)' }}>
                        {q.items && q.items.length > 0 && (
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: 8 }}>Order Items</div>
                            {q.items.map((item: any, i: number) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                                {item.image && <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' as const, opacity: .8 }} />}
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 12, color: '#fff' }}>{item.name}</div>
                                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{item.sku}</div>
                                </div>
                                <div style={{ textAlign: 'right' as const }}>
                                  <div style={{ fontSize: 11, color: '#fff' }}>×{item.qty}</div>
                                  <div style={{ fontSize: 11, color: 'var(--gold)' }}>£{(item.line_total || 0).toLocaleString()}</div>
                                </div>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Total: £{(q.total_estimate || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                        {q.notes && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}><b style={{ color: '#fff' }}>Notes:</b> {q.notes}</div>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>Update status:</span>
                          <div style={{ position: 'relative' as const }}>
                            <button
                              onClick={() => setStatusMenuOpen(statusMenuOpen === q.id ? null : q.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: '#fff', fontSize: 11 }}
                            >
                              {tag(q.status || 'pending')}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                            </button>
                            {statusMenuOpen === q.id && (
                              <div style={{ position: 'absolute' as const, bottom: '110%', left: 0, zIndex: 100, background: '#1a1a2e', border: '1px solid rgba(201,169,110,.25)', borderRadius: 8, overflow: 'hidden', minWidth: 160, boxShadow: '0 -8px 32px rgba(0,0,0,.6)' }}>
                                {['pending', 'quoted', 'confirmed', 'rejected', 'completed'].map(s => (
                                  <button key={s} onClick={async () => {
                                    setStatusMenuOpen(null)
                                    if (q._demo) {
                                      updateDemoOrderStatus(q.id, s)
                                    } else {
                                      await supabase.from('quote_requests').update({ status: s }).eq('id', q.id)
                                      router.refresh()
                                    }
                                  }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: q.status === s ? 'rgba(201,169,110,.08)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background .15s' }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = q.status === s ? 'rgba(201,169,110,.08)' : 'transparent')}>
                                    {tag(s)}
                                    {q.status === s && <span style={{ color: 'var(--gold)', fontSize: 10 }}>✓</span>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
                <div style={{ fontSize: 13 }}>No orders yet</div>
              </div>
            )}
          </div>
        )}

        {/* ── VIEWINGS ─────────────────────────────────────────────── */}
        {tab === 'viewings' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Trade Viewing Requests</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{viewings.length} total · {viewings.filter(v => v.status === 'new').length} new</div>
            </div>
            {viewings.length > 0 ? (
              <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface)' }}>
                      {['Type', 'Company', 'Contact', 'Preferred Date', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewings.map((v: any) => (
                      <tr key={v.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: v.type === 'visit' ? 'rgba(201,169,110,.15)' : 'rgba(66,165,245,.15)', color: v.type === 'visit' ? 'var(--gold)' : '#42a5f5' }}>
                            {v.type || 'visit'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12, color: '#fff' }}>{v.company_name || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontSize: 12, color: '#fff' }}>{v.full_name || v.contact_name || '—'}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>{v.email}</div>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--txt)' }}>{v.preferred_date ? new Date(v.preferred_date).toLocaleDateString('en-GB') : '—'}</td>
                        <td style={{ padding: '10px 14px' }}>{tag(v.status || 'new')}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <select value={v.status || 'new'} onChange={e => updateViewingStatus(v.id, e.target.value)}
                            style={{ padding: '4px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--txt)', fontSize: 10 }}>
                            {['new', 'assigned', 'confirmed', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📅</div>
                <div style={{ fontSize: 13 }}>No viewing requests yet</div>
              </div>
            )}
          </div>
        )}

        {/* ── APPROVALS ────────────────────────────────────────────── */}
        {tab === 'approvals' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Trade Account Approvals</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{pendingApps.length} pending applications</div>
            </div>
            {pendingApps.length > 0 && (
              <div style={{ background: 'var(--card)', border: '1px solid rgba(255,167,38,.3)', borderRadius: 8, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: '#ffa726', marginBottom: 12 }}>Pending Approval</div>
                {pendingApps.map((a: any) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{a.full_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.company_name}{a.business_type ? ` · ${a.business_type}` : ''}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{a.email}{a.vat_number ? ` · VAT: ${a.vat_number}` : ''}</div>
                      {a.annual_spend && <div style={{ fontSize: 10, color: 'var(--gold)' }}>Est. spend: {a.annual_spend}</div>}
                      <div style={{ fontSize: 9, color: 'var(--muted)' }}>Applied: {new Date(a.created_at).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => approveApp(a.id, a.email)}
                        style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => rejectApp(a.id)}
                        style={{ padding: '8px 16px', background: 'transparent', color: '#ef5350', border: '1px solid rgba(244,67,54,.3)', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {pendingApps.length === 0 && (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>✅</div>
                <div style={{ fontSize: 13 }}>No pending applications</div>
              </div>
            )}
            {/* Recent decisions */}
            {applications.filter(a => a.status !== 'pending').length > 0 && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Recent Decisions</div>
                {applications.filter(a => a.status !== 'pending').slice(0, 10).map((a: any) => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                    <div>
                      <span style={{ color: '#fff' }}>{a.full_name}</span>
                      <span style={{ color: 'var(--muted)' }}> — {a.company_name}</span>
                    </div>
                    {tag(a.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BUYERS ───────────────────────────────────────────────── */}
        {tab === 'buyers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>UK Trade Buyers</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{allBuyers.length} registered buyers</div>
              </div>
              <button onClick={() => {
                const rows = [['Name','Company','Email','Business Type','Status','Joined'], ...allBuyers.map((b:any) => [b.full_name||'—', b.company?.name||'—', b.email||'—', b.business_type||'Retailer', b.status||'pending', new Date(b.created_at).toLocaleDateString('en-GB')])]
                const csv = rows.map(r => r.map((c:string) => `"${c}"`).join(',')).join('\n')
                const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}))
                a.download = `SIVO-buyers-${new Date().toISOString().slice(0,10)}.csv`; a.click()
                showToast('Buyers exported')
              }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(66,165,245,.1)', border: '1px solid rgba(66,165,245,.3)', borderRadius: 6, color: '#42a5f5', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                ⬇ Export CSV
              </button>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface)' }}>
                    {['Name', 'Company', 'Email', 'Business Type', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allBuyers.map((b: any) => (
                    <tr key={b.id} style={{ borderTop: '1px solid var(--border)', transition: 'background .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.025)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(201,169,110,.15)', border: '1px solid rgba(201,169,110,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#c9a96e', flexShrink: 0 }}>
                            {(b.full_name || 'U').split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2)}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{b.full_name || '—'}</div>
                            {b._demo && <span style={{ fontSize: 8, padding: '1px 5px', background: 'rgba(66,165,245,.15)', color: '#42a5f5', borderRadius: 3, border: '1px solid rgba(66,165,245,.3)' }}>DEMO</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--txt)' }}>{b.company?.name || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{b.email || '—'}</td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--txt)' }}>{b.business_type || 'Interior Designer'}</td>
                      <td style={{ padding: '12px 14px' }}>{tag(b.status || 'pending')}</td>
                      <td style={{ padding: '12px 14px', fontSize: 10, color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString('en-GB')}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {b.status !== 'approved' && !b._demo && (
                            <button onClick={async () => { await supabase.from('profiles').update({ status: 'approved' }).eq('id', b.id); showToast('Buyer approved'); router.refresh() }}
                              style={{ padding: '4px 10px', background: 'rgba(76,175,80,.15)', color: '#66bb6a', border: '1px solid rgba(76,175,80,.3)', borderRadius: 4, fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
                              Approve
                            </button>
                          )}
                          <button onClick={() => { navigator.clipboard.writeText(b.email || ''); showToast('Email copied') }}
                            style={{ padding: '4px 10px', background: 'rgba(255,255,255,.04)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>
                            Copy Email
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STAFF & ACCESS ─────────────────────────────────────────── */}
        {tab === 'staff' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 28, color: '#fff' }}>Staff & Access Control</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Manage team members and their platform permissions</div>
              </div>
              <button onClick={() => setShowAddStaff(true)}
                style={{ padding: '10px 20px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>
                + Add Staff Member
              </button>
            </div>

            {/* Department permission matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                {
                  dept: 'Sales', color: '#42a5f5', icon: '💼',
                  can: ['View all orders & quotes', 'Update order status', 'View buyer profiles', 'Export quote reports', 'View revenue data'],
                  cannot: ['Edit products', 'Manage partners', 'Add staff', 'Approve trade accounts'],
                },
                {
                  dept: 'Operations', color: '#66bb6a', icon: '⚙️',
                  can: ['Manage viewings & scheduling', 'Update order status', 'View shipment data', 'Add/edit products', 'Manage QC records'],
                  cannot: ['View financial data', 'Add staff', 'Approve accounts', 'Access buyer contacts'],
                },
                {
                  dept: 'Accounts', color: '#c9a96e', icon: '📊',
                  can: ['View all revenue & totals', 'Export financial reports', 'View order history', 'View buyer spend data'],
                  cannot: ['Edit products', 'Update order status', 'Manage staff', 'Contact buyers directly'],
                },
                {
                  dept: 'Catalogue', color: '#ba68c8', icon: '📦',
                  can: ['Add & edit products', 'Manage categories', 'Upload product images', 'Update QC scores', 'Manage partner listings'],
                  cannot: ['View financial data', 'Access buyer info', 'Manage staff', 'Approve trade accounts'],
                },
                {
                  dept: 'Full Access', color: '#ef5350', icon: '👑',
                  can: ['Everything above', 'Approve/reject trade accounts', 'Manage staff & permissions', 'View all data & reports', 'Platform configuration'],
                  cannot: ['Create other Full Access accounts'],
                },
              ].map(d => (
                <div key={d.dept} style={{ background: 'var(--card)', border: `1px solid ${d.color}30`, borderRadius: 10, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{d.icon}</span>
                    <span style={{ fontWeight: 600, color: d.color, fontSize: 14 }}>{d.dept}</span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {d.can.map(c => (
                      <div key={c} style={{ fontSize: 10, color: '#66bb6a', padding: '2px 0', display: 'flex', gap: 6 }}>
                        <span>✓</span><span style={{ color: 'rgba(255,255,255,.6)' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {d.cannot.map(c => (
                      <div key={c} style={{ fontSize: 10, padding: '2px 0', display: 'flex', gap: 6 }}>
                        <span style={{ color: '#ef5350' }}>✕</span><span style={{ color: 'rgba(255,255,255,.3)' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Current staff list */}
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff', marginBottom: 14 }}>Current Team</div>
            {/* Built-in admin */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {[
                { name: 'Navi Singh', email: 'admin@sivohome.com', dept: 'Full Access', color: '#ef5350', initials: 'NS', status: 'Owner' },
                ...staffMembers,
              ].map((s: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.color ? `${s.color}22` : 'rgba(201,169,110,.15)', border: `1px solid ${s.color || '#c9a96e'}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: s.color || '#c9a96e', flexShrink: 0 }}>
                    {s.initials || s.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{s.email}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                    <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, background: `${s.color || '#c9a96e'}18`, color: s.color || '#c9a96e', border: `1px solid ${s.color || '#c9a96e'}30` }}>{s.dept}</div>
                    {s.status && <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3 }}>{s.status}</div>}
                  </div>
                  {i > 0 && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => {
                        setEditingStaff(i - 1)
                        setNewStaff({ name: s.name, email: s.email, department: s.dept, permissions: [] })
                        setShowAddStaff(true)
                      }} style={{ background: 'rgba(201,169,110,.1)', border: '1px solid rgba(201,169,110,.2)', cursor: 'pointer', color: '#c9a96e', fontSize: 10, padding: '4px 10px', borderRadius: 4, fontWeight: 600 }}>
                        Edit
                      </button>
                      <button onClick={() => {
                        const updated = staffMembers.filter((_: any, idx: number) => idx !== i - 1)
                        setStaffMembers(updated)
                        localStorage.setItem('sivo_staff', JSON.stringify(updated))
                        showToast('Staff member removed')
                      }} style={{ background: 'none', border: '1px solid rgba(239,83,80,.2)', cursor: 'pointer', color: 'rgba(239,83,80,.6)', fontSize: 10, padding: '4px 10px', borderRadius: 4, transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef5350'; e.currentTarget.style.borderColor = 'rgba(239,83,80,.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,83,80,.6)'; e.currentTarget.style.borderColor = 'rgba(239,83,80,.2)' }}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {staffMembers.length === 0 && (
                <div style={{ padding: '20px', fontSize: 12, color: 'var(--muted)', textAlign: 'center' as const }}>No additional staff added yet. Click "+ Add Staff Member" to invite team members.</div>
              )}
            </div>

            {/* Add Staff Modal */}
            {showAddStaff && (
              <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: 20 }}>
                <div style={{ width: '100%', maxWidth: 480, background: 'var(--card)', border: '1px solid rgba(201,169,110,.2)', borderRadius: 10, padding: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#fff' }}>{editingStaff !== null ? 'Edit Staff Member' : 'Add Staff Member'}</div>
                    <button onClick={() => { setShowAddStaff(false); setEditingStaff(null); setNewStaff({ name:'', email:'', department:'Sales', permissions:[] }) }} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {[
                      { label: 'Full Name', key: 'name', placeholder: 'e.g. Sarah Johnson' },
                      { label: 'Email Address', key: 'email', placeholder: 'sarah@sivohome.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--gold)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                        <input value={(newStaff as any)[f.key]} onChange={e => setNewStaff(s => ({ ...s, [f.key]: e.target.value }))} placeholder={f.placeholder}
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase' as const, color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Department & Access Level</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                          { dept: 'Sales', color: '#42a5f5' },
                          { dept: 'Operations', color: '#66bb6a' },
                          { dept: 'Accounts', color: '#c9a96e' },
                          { dept: 'Catalogue', color: '#ba68c8' },
                          { dept: 'Full Access', color: '#ef5350' },
                        ].map(d => (
                          <button key={d.dept} onClick={() => setNewStaff(s => ({ ...s, department: d.dept }))}
                            style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${newStaff.department === d.dept ? d.color : 'var(--border)'}`, background: newStaff.department === d.dept ? `${d.color}18` : 'transparent', color: newStaff.department === d.dept ? d.color : 'var(--muted)', fontSize: 11, cursor: 'pointer', fontWeight: newStaff.department === d.dept ? 600 : 400, transition: 'all .15s' }}>
                            {d.dept}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={() => {
                      if (!newStaff.name || !newStaff.email) { showToast('Name and email required'); return }
                      const deptColors: Record<string, string> = { Sales: '#42a5f5', Operations: '#66bb6a', Accounts: '#c9a96e', Catalogue: '#ba68c8', 'Full Access': '#ef5350' }
                      const member = { name: newStaff.name, email: newStaff.email, dept: newStaff.department, color: deptColors[newStaff.department], status: editingStaff !== null ? staffMembers[editingStaff]?.status : 'Invited' }
                      let updated
                      if (editingStaff !== null) {
                        updated = staffMembers.map((s: any, idx: number) => idx === editingStaff ? member : s)
                        showToast(`${member.name} updated`)
                      } else {
                        updated = [...staffMembers, member]
                        showToast(`${member.name} added as ${member.dept}`)
                      }
                      setStaffMembers(updated)
                      localStorage.setItem('sivo_staff', JSON.stringify(updated))
                      setNewStaff({ name: '', email: '', department: 'Sales', permissions: [] })
                      setEditingStaff(null)
                      setShowAddStaff(false)
                    }} style={{ flex: 1, padding: '12px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
                      {editingStaff !== null ? 'Save Changes' : 'Add Staff Member'}
                    </button>
                    <button onClick={() => { setShowAddStaff(false); setEditingStaff(null) }} style={{ padding: '12px 20px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ── PRODUCT EDIT MODAL ─────────────────────────────────────── */}
      {addingProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 3000, padding: 20, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 620, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 36, marginTop: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff' }}>{editProduct ? 'Edit Product' : 'Add Product'}</div>
              <button onClick={() => setAddingProduct(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Round Coffee Table' },
                { label: 'SKU / Code', key: 'sku', placeholder: 'e.g. BFCTRMN1234' },
                { label: 'Category', key: 'category', placeholder: 'e.g. Coffee Tables' },
                { label: 'Material', key: 'material', placeholder: 'e.g. Mango Wood / Metal' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input value={(newProduct as any)[f.key]} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Price (£)</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 125"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>MOQ</label>
                  <input type="number" value={newProduct.moq} onChange={e => setNewProduct(p => ({ ...p, moq: e.target.value }))} placeholder="e.g. 10"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Description</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} placeholder="Product description…" rows={3}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Status</label>
                <select value={newProduct.status} onChange={e => setNewProduct(p => ({ ...p, status: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 13 }}>
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            {/* QC Scorecard preview for edit */}
            {editProduct && (
              <div style={{ marginTop: 16 }}>
                <QCScorecard product={editProduct} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={saveProduct} disabled={saving}
                style={{ flex: 1, padding: '12px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {saving ? 'Saving…' : editProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button onClick={() => setAddingProduct(false)}
                style={{ padding: '12px 24px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
