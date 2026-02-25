'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function DashboardClient({
  profile,
  quotes,
  viewings,
}: {
  profile: any
  quotes: any[]
  viewings: any[]
}) {
  const [tab, setTab] = useState<'orders' | 'viewings' | 'team'>('orders')
  const [companyLogo, setCompanyLogo] = useState<string>('')
  const [companyDisplayName, setCompanyDisplayName] = useState<string>('')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savedCount, setSavedCount] = useState(0)
  const [demoOrders, setDemoOrders] = useState<any[]>([])
  const [toast, setToast] = useState('')
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'purchaser' })
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const isApproved = profile?.status === 'approved' || profile?.role === 'admin'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const companyName = companyDisplayName || profile?.company?.name || 'Your Company'
  const initials = (profile?.full_name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    // Load company customisations from localStorage
    try {
      const logo = localStorage.getItem('sivo_company_logo') || ''
      const name = localStorage.getItem('sivo_company_name') || ''
      const saved = JSON.parse(localStorage.getItem('sivo_saved') || '[]')
      const demoOrd = JSON.parse(localStorage.getItem('sivo_demo_orders') || '[]')
      setCompanyLogo(logo)
      setCompanyDisplayName(name)
      setSavedCount(saved.length)
      setDemoOrders(demoOrd)
      setNameInput(name || profile?.company?.name || '')
    } catch {}

    // Check URL tab param
    const params = new URLSearchParams(window.location.search)
    const t = params.get('tab')
    if (t === 'viewings') setTab('viewings')
    if (t === 'team') setTab('team')
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { showToast('Logo must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      setCompanyLogo(base64)
      localStorage.setItem('sivo_company_logo', base64)
      showToast('✅ Company logo updated!')
    }
    reader.readAsDataURL(file)
  }

  const saveName = () => {
    setCompanyDisplayName(nameInput)
    localStorage.setItem('sivo_company_name', nameInput)
    setEditingName(false)
    showToast('✅ Company name updated!')
  }

  const removeLogo = () => {
    setCompanyLogo('')
    localStorage.removeItem('sivo_company_logo')
    showToast('Logo removed')
  }

  const statusTag = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      pending:   { bg: 'rgba(255,167,38,.15)',    color: '#ffa726' },
      new:       { bg: 'rgba(66,165,245,.15)',     color: '#42a5f5' },
      assigned:  { bg: 'rgba(255,167,38,.15)',     color: '#ffa726' },
      confirmed: { bg: 'rgba(201,169,110,.15)',    color: 'var(--gold)' },
      approved:  { bg: 'rgba(76,175,80,.15)',      color: '#66bb6a' },
      quoted:    { bg: 'rgba(201,169,110,.15)',    color: 'var(--gold)' },
      completed: { bg: 'rgba(76,175,80,.15)',      color: '#66bb6a' },
      rejected:  { bg: 'rgba(244,67,54,.15)',      color: '#ef5350' },
    }
    const s = map[status] || { bg: 'var(--surface)', color: 'var(--muted)' }
    return (
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 4,
        fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const,
        background: s.bg, color: s.color,
      }}>{status}</span>
    )
  }

  const stages = ['Order Placed', 'In Production', 'QC Inspection', 'Shipping', 'UK Delivery']
  const currentStage = (quotes.length + demoOrders.length) > 0 ? 1 : 0
  const allOrders = [...demoOrders.map(o => ({ ...o, _demo: true })), ...quotes]
  const hasActive = quotes.some((q: any) => ['confirmed', 'approved'].includes(q.status))

  const viewingProgress = (status: string) => ({ new: 25, assigned: 50, confirmed: 75, completed: 100 }[status] || 25)

  const tabs = [
    { id: 'orders' as const,   label: 'My Orders' },
    { id: 'viewings' as const, label: 'My Viewings' },
    { id: 'team' as const,     label: 'Company & Team' },
  ]

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 24,
    marginBottom: 16,
    ...extra,
  })

  return (
    <div style={{ paddingTop: 80 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          padding: '12px 20px', background: 'var(--card)',
          border: '1px solid rgba(201,169,110,.3)', borderRadius: 8,
          color: '#fff', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        }}>{toast}</div>
      )}

      <section style={{ padding: '40px 0 64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>

          {/* ═══ HERO GREETING ═══ */}
          <div style={{
            ...card(),
            background: 'linear-gradient(135deg, rgba(201,169,110,.08), rgba(201,169,110,.02))',
            border: '1px solid rgba(201,169,110,.2)',
            marginBottom: 24,
            padding: 28,
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' as const,
          }}>
            {/* Company logo / initials */}
            <div style={{ position: 'relative' as const, flexShrink: 0 }}>
              {companyLogo ? (
                <div style={{
                  width: 72, height: 72, borderRadius: 12, overflow: 'hidden',
                  border: '2px solid rgba(201,169,110,.3)',
                }}>
                  <img src={companyLogo} alt="Company logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{
                  width: 72, height: 72, borderRadius: 12,
                  background: 'var(--gold)', color: 'var(--dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 700, fontFamily: 'Georgia, serif',
                }}>{initials}</div>
              )}
              {isApproved && (
                <button
                  onClick={() => fileRef.current?.click()}
                  title="Upload company logo"
                  style={{
                    position: 'absolute' as const, bottom: -6, right: -6,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--gold)', color: 'var(--dark)',
                    border: 'none', cursor: 'pointer', fontSize: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✏️</button>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            </div>

            {/* Greeting text */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: 4 }}>
                Trade Portal
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#fff', marginBottom: 4 }}>
                {greeting}, <em style={{ color: 'var(--gold)' }}>{firstName}</em>
              </div>
              {/* Editable company name */}
              {editingName ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    style={{
                      background: 'var(--surface)', border: '1px solid var(--gold)',
                      borderRadius: 4, padding: '4px 10px', color: '#fff', fontSize: 13,
                    }}
                    autoFocus
                  />
                  <button onClick={saveName} style={{ background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Save</button>
                  <button onClick={() => setEditingName(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 10px', fontSize: 11, color: 'var(--muted)', cursor: 'pointer' }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{companyName}</span>
                  {isApproved && (
                    <button onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 10, cursor: 'pointer', opacity: .7 }}>✏️ Edit</button>
                  )}
                </div>
              )}
            </div>

            {/* Status badges + stats */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, alignItems: 'flex-end' as const }}>
              {isApproved ? (
                <span style={{
                  padding: '5px 12px', border: '1px solid rgba(76,175,80,.3)', borderRadius: 4,
                  fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const, color: '#66bb6a', fontWeight: 600,
                }}>✓ Approved Trade Account</span>
              ) : (
                <span style={{
                  padding: '5px 12px', border: '1px solid rgba(255,167,38,.3)', borderRadius: 4,
                  fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const, color: '#ffa726', fontWeight: 600,
                }}>⏳ Pending Approval</span>
              )}
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'Orders', value: allOrders.length },
                  { label: 'Saved', value: savedCount },
                  { label: 'Viewings', value: viewings.length },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' as const }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: 'var(--gold)' }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              {companyLogo && (
                <button onClick={removeLogo} style={{ background: 'none', border: 'none', fontSize: 9, color: 'var(--muted)', cursor: 'pointer' }}>Remove logo</button>
              )}
            </div>
          </div>

          {/* ═══ QUICK ACTIONS ═══ */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10, marginBottom: 24,
          }}>
            {[
              { icon: '📦', label: 'Browse Collection', href: '/catalog', color: 'var(--gold)' },
              { icon: '📅', label: 'Book a Viewing', href: '/trade-viewing', color: '#42a5f5' },
              { icon: '📋', label: 'Trade Terms', href: '/trade-terms', color: '#81c784' },
              { icon: '📖', label: 'Digital Catalogue', href: 'https://heyzine.com/flip-book/a486532728.html', color: '#ce93d8', external: true },
            ].map(a => (
              a.external ? (
                <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '16px 10px', background: 'var(--card)',
                  border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none',
                  transition: 'border-color .2s',
                }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, color: a.color, letterSpacing: .5, textAlign: 'center' as const }}>{a.label}</span>
                </a>
              ) : (
                <Link key={a.label} href={a.href} style={{
                  display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '16px 10px', background: 'var(--card)',
                  border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none',
                  transition: 'border-color .2s',
                }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, color: a.color, letterSpacing: .5, textAlign: 'center' as const }}>{a.label}</span>
                </Link>
              )
            ))}
          </div>

          {/* ═══ TABS ═══ */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
            {tabs.map(t => (
              <div key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 20px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' as const,
                cursor: 'pointer', borderBottom: `2px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`,
                color: tab === t.id ? 'var(--gold)' : 'var(--muted)', transition: 'all .2s',
              }}>{t.label}</div>
            ))}
          </div>

          {/* ═══ MY ORDERS TAB ═══ */}
          {tab === 'orders' && (
            <>
              {/* Account Manager */}
              <div style={{ ...card(), display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'var(--dark)', flexShrink: 0,
                }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Navi Singh</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Your dedicated SIVO account manager</div>
                  <div style={{ fontSize: 10, color: 'var(--gold)', marginTop: 3 }}>
                    ✉ trade@sivohome.com · 📞 +44 7346 325580
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, flexShrink: 0 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', border: '1px solid rgba(76,175,80,.2)', borderRadius: 4,
                    fontSize: 10, color: '#66bb6a', letterSpacing: .5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block' }} />
                    Reply within 24h
                  </div>
                  <Link href="/trade-viewing" style={{
                    padding: '6px 16px', border: '1px solid var(--gold)', borderRadius: 4,
                    fontSize: 10, letterSpacing: 1, color: 'var(--gold)', textDecoration: 'none',
                    textAlign: 'center' as const, textTransform: 'uppercase' as const,
                  }}>Book a Call</Link>
                </div>
              </div>

              {/* Shipment Tracker */}
              <div style={card()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 18 }}>🚢</span>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff' }}>Shipment Tracker</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' as const }}>
                  {/* Progress line behind */}
                  <div style={{
                    position: 'absolute' as const, top: 10, left: '10%', right: '10%', height: 2,
                    background: 'var(--border)', zIndex: 0,
                  }} />
                  <div style={{
                    position: 'absolute' as const, top: 10, left: '10%', height: 2,
                    width: `${(currentStage / (stages.length - 1)) * 80}%`,
                    background: 'var(--gold)', zIndex: 1, transition: 'width .5s ease',
                  }} />
                  {stages.map((s, i) => {
                    const done = i < currentStage
                    const active = i === currentStage
                    return (
                      <div key={s} style={{ flex: 1, textAlign: 'center' as const, zIndex: 2 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', margin: '0 auto 8px',
                          background: done ? 'var(--gold)' : active ? 'var(--gold)' : 'var(--surface)',
                          border: `2px solid ${done || active ? 'var(--gold)' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, color: done || active ? 'var(--dark)' : 'var(--muted)',
                          boxShadow: active ? '0 0 12px rgba(201,169,110,.5)' : 'none',
                        }}>
                          {done ? '✓' : active ? '●' : '○'}
                        </div>
                        <div style={{ fontSize: 9, color: done || active ? 'var(--gold)' : 'var(--muted)', lineHeight: 1.3 }}>{s}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 16, textAlign: 'center' as const }}>
                  {hasActive
                    ? '🕐 Estimated arrival: March 2026 · Container ref: SIVO-2026-03'
                    : 'No active shipments. Place an order to begin tracking.'}
                </div>
              </div>

              {/* Order History */}
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff', margin: '24px 0 12px' }}>
                Order History
              </div>
              {allOrders.length === 0 ? (
                <div style={{ ...card(), textAlign: 'center' as const, padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: .2 }}>📋</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>No orders yet.</div>
                  <Link href="/catalog" style={{
                    display: 'inline-block', padding: '10px 28px', background: 'var(--gold)',
                    color: 'var(--dark)', borderRadius: 4, fontSize: 11, fontWeight: 600,
                    letterSpacing: 1, textDecoration: 'none', textTransform: 'uppercase' as const,
                  }}>Browse Collection →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {allOrders.map((q: any) => (
                    <div key={q.id} style={card()}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff' }}>
                            {q.ref_id || `Quote #${q.id?.slice(0, 8)}`}
                            {q._demo && <span style={{ marginLeft: 8, fontSize: 8, padding: '1px 5px', background: 'rgba(66,165,245,.15)', color: '#42a5f5', borderRadius: 3, border: '1px solid rgba(66,165,245,.3)', verticalAlign: 'middle' }}>DEMO</span>}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 10 }}>
                            {new Date(q.created_at).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        {statusTag(q.status)}
                      </div>
                      {q.items?.map((item: any, idx: number) => {
                        // Demo items: { name, sku, qty, line_total }
                        // Real items: { product: { name, sku }, quantity, unit_price }
                        const name = item.name || item.product?.name || 'Product'
                        const sku = item.sku || item.product?.sku || '—'
                        const qty = item.qty || item.quantity || 0
                        const total = item.line_total != null ? item.line_total : (item.unit_price && item.quantity ? item.unit_price * item.quantity : 0)
                        return (
                        <div key={idx} style={{
                          display: 'flex', justifyContent: 'space-between',
                          padding: '6px 0', borderTop: '1px solid var(--border)',
                        }}>
                          <span style={{ fontSize: 12, color: '#fff' }}>
                            {name}{' '}
                            <span style={{ color: 'var(--muted)' }}>({sku})</span>
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--gold)' }}>
                            ×{qty} · £{total.toLocaleString()}
                          </span>
                        </div>
                        )
                      })}
                      <div style={{
                        display: 'flex', justifyContent: 'flex-end',
                        paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 4,
                      }}>
                        <b style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: 'var(--gold)' }}>
                          Total: £{(q.total_estimate || 0).toLocaleString()}
                        </b>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ MY VIEWINGS TAB ═══ */}
          {tab === 'viewings' && (
            <>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff', marginBottom: 16 }}>
                My Viewing Requests
              </div>
              {viewings.length === 0 ? (
                <div style={{ ...card(), textAlign: 'center' as const, padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: .2 }}>📅</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>No viewing requests yet.</div>
                  <Link href="/trade-viewing" style={{
                    display: 'inline-block', padding: '10px 28px', background: 'var(--gold)',
                    color: 'var(--dark)', borderRadius: 4, fontSize: 11, fontWeight: 600,
                    letterSpacing: 1, textDecoration: 'none', textTransform: 'uppercase' as const,
                  }}>Book a Viewing</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {viewings.map((v: any) => (
                    <div key={v.id} style={card()}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gold)' }}>{v.ref_id}</span>
                          <span style={{
                            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                            background: v.type === 'virtual' ? 'rgba(66,165,245,.15)' : 'rgba(201,169,110,.15)',
                            color: v.type === 'virtual' ? '#42a5f5' : 'var(--gold)',
                            textTransform: 'uppercase' as const, letterSpacing: .5,
                          }}>{v.type || 'virtual'}</span>
                        </div>
                        {statusTag(v.status)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                        Preferred date: <b style={{ color: '#fff' }}>{v.preferred_date || 'Flexible'}</b>
                        {' · '}{v.time_preference || 'Flexible'}
                        {v.postcode && <> · Postcode: {v.postcode}</>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface)' }}>
                          <div style={{
                            height: '100%', borderRadius: 2, background: 'var(--gold)',
                            width: `${viewingProgress(v.status)}%`, transition: 'width .4s',
                          }} />
                        </div>
                        <span style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' as const }}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ COMPANY & TEAM TAB ═══ */}
          {tab === 'team' && (
            <>
              {/* Company branding card */}
              <div style={card()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {companyLogo ? (
                      <img src={companyLogo} alt="logo" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} />
                    ) : (
                      <div style={{
                        width: 52, height: 52, borderRadius: 8, background: 'var(--gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: 'var(--dark)',
                      }}>{initials}</div>
                    )}
                    <div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#fff' }}>{companyName}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Trade Partner Since 2026</div>
                    </div>
                  </div>
                  {isApproved
                    ? <span style={{ padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(76,175,80,.15)', color: '#66bb6a' }}>✓ Approved</span>
                    : <span style={{ padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(255,167,38,.15)', color: '#ffa726' }}>⏳ Pending</span>
                  }
                </div>

                {/* Company details */}
                {profile?.company && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                    {[
                      { label: 'Business Type', value: profile.company.business_type },
                      { label: 'VAT Number',    value: profile.company.vat_number },
                      { label: 'Website',        value: profile.company.website },
                      { label: 'Annual Spend',   value: profile.company.annual_spend },
                    ].map(f => (
                      <div key={f.label} style={{ padding: '10px 14px', background: 'var(--surface)', borderRadius: 6 }}>
                        <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 }}>{f.label}</div>
                        <div style={{ color: '#fff', fontSize: 13 }}>{f.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Logo upload area */}
                {isApproved && (
                  <div style={{
                    padding: 16, border: '1px dashed rgba(201,169,110,.3)', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as const,
                  }}>
                    <div style={{ fontSize: 13, color: 'var(--muted)', flex: 1 }}>
                      <b style={{ color: '#fff' }}>Company Branding</b>
                      <div style={{ fontSize: 11, marginTop: 2 }}>Upload your logo to personalise your portal. PNG, JPG or SVG under 2MB.</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => fileRef.current?.click()} style={{
                        padding: '8px 16px', background: 'var(--gold)', color: 'var(--dark)',
                        border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        textTransform: 'uppercase' as const, letterSpacing: .5,
                      }}>
                        {companyLogo ? '🔄 Change Logo' : '⬆ Upload Logo'}
                      </button>
                      {companyLogo && (
                        <button onClick={removeLogo} style={{
                          padding: '8px 14px', background: 'none', color: 'var(--muted)',
                          border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                        }}>Remove</button>
                      )}
                      <button onClick={() => setEditingName(true)} style={{
                        padding: '8px 14px', background: 'none', color: 'var(--muted)',
                        border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                      }}>✏️ Edit Name</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Manager */}
              <div style={{ ...card(), display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'var(--dark)', flexShrink: 0,
                }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Navi Singh · Your Account Manager</div>
                  <div style={{ fontSize: 10, color: 'var(--gold)', marginTop: 4 }}>trade@sivohome.com · +44 7346 325580</div>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', border: '1px solid rgba(76,175,80,.2)', borderRadius: 4,
                  fontSize: 9, color: '#66bb6a', flexShrink: 0,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block' }} />
                  Reply within 24h
                </div>
              </div>

              {/* Team Table */}
              <div style={card()}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff', marginBottom: 16 }}>
                  Team Members
                </div>
                <div style={{ overflowX: 'auto' as const }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Role', 'Status'].map(h => (
                          <th key={h} style={{
                            padding: '8px 12px', textAlign: 'left' as const,
                            fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' as const,
                            color: 'var(--muted)', fontWeight: 600,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px', fontSize: 13, color: '#fff' }}>
                          {profile?.full_name || '—'} <span style={{ fontSize: 9, color: 'var(--gold)' }}>(you)</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--muted)' }}>
                          {profile?.email || '—'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                            background: 'rgba(201,169,110,.15)', color: 'var(--gold)',
                            textTransform: 'uppercase' as const,
                          }}>{profile?.role === 'admin' ? 'admin' : 'owner'}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {isApproved
                            ? <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(76,175,80,.15)', color: '#66bb6a' }}>Approved</span>
                            : <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(255,167,38,.15)', color: '#ffa726' }}>Pending</span>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Invite form */}
                {isApproved && (
                  <div style={{ marginTop: 20, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 }}>
                      + Invite Team Member
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                      <input
                        placeholder="Full name"
                        value={inviteForm.name}
                        onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))}
                        style={{ flex: 1, minWidth: 140, padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--txt)', fontSize: 12 }}
                      />
                      <input
                        placeholder="Email address"
                        value={inviteForm.email}
                        onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                        style={{ flex: 2, minWidth: 180, padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--txt)', fontSize: 12 }}
                      />
                      <select
                        value={inviteForm.role}
                        onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}
                        style={{ padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--txt)', fontSize: 12 }}
                      >
                        <option value="purchaser">Purchaser</option>
                        <option value="owner">Owner</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!inviteForm.name || !inviteForm.email) { showToast('Please fill in name and email'); return }
                          showToast(`✅ Invite sent to ${inviteForm.email}`)
                          setInviteForm({ name: '', email: '', role: 'purchaser' })
                        }}
                        style={{
                          padding: '8px 20px', background: 'var(--gold)', color: 'var(--dark)',
                          border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        }}>
                        Send Invite
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  )
}
