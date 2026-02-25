'use client'

import { useState } from 'react'
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

  const isApproved = profile?.status === 'approved' || profile?.role === 'admin'
  const companyName = profile?.company?.name || 'Your Company'

  const statusTag = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'rgba(255,167,38,.15)', text: '#ffa726' },
      new: { bg: 'rgba(66,165,245,.15)', text: '#42a5f5' },
      assigned: { bg: 'rgba(255,167,38,.15)', text: '#ffa726' },
      confirmed: { bg: 'rgba(201,169,110,.15)', text: 'var(--gold)' },
      approved: { bg: 'rgba(76,175,80,.15)', text: '#66bb6a' },
      quoted: { bg: 'rgba(201,169,110,.15)', text: 'var(--gold)' },
      completed: { bg: 'rgba(76,175,80,.15)', text: '#66bb6a' },
      rejected: { bg: 'rgba(244,67,54,.15)', text: '#ef5350' },
    }
    const s = map[status] || { bg: 'var(--surface)', text: 'var(--muted)' }
    return (
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 4,
        fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const,
        background: s.bg, color: s.text,
      }}>{status}</span>
    )
  }

  const stages = ['Order Placed', 'In Production', 'QC Inspection', 'Shipping', 'UK Delivery']
  const currentStage = quotes.length > 0 ? 1 : 0
  const hasActiveShipments = quotes.some((q: any) => q.status === 'confirmed' || q.status === 'approved')

  const viewingProgress = (status: string) => {
    const map: Record<string, number> = { new: 25, assigned: 50, confirmed: 75, completed: 100 }
    return map[status] || 25
  }

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'orders', label: 'My Orders' },
    { id: 'viewings', label: 'My Viewings' },
    { id: 'team', label: 'Company & Team' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

          {/* Section Header */}
          <div style={{ marginBottom: 32 }}>
            <span style={{
              display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const,
              color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8,
            }}>Trade Portal</span>
            <h1 style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 42,
              color: '#fff', fontWeight: 400, margin: 0,
            }}>My Account</h1>
            <div style={{ width: 40, height: 2, background: 'var(--gold)', margin: '12px 0 0' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' as const }}>
              {isApproved ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', border: '1px solid rgba(76,175,80,.3)',
                  borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const,
                  color: '#66bb6a', fontWeight: 600,
                }}>Approved Trade Account</span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', border: '1px solid rgba(255,167,38,.3)',
                  borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const,
                  color: '#ffa726', fontWeight: 600,
                }}>Pending Approval</span>
              )}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', border: '1px solid rgba(201,169,110,.2)',
                borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const,
                color: 'var(--muted)', fontWeight: 600,
              }}>Trade Partner Since 2026</span>
            </div>
          </div>

          {/* Tabs */}
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
              <div className="card card-glow shimmer" style={{
                padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16,
                borderRadius: 8,
                boxShadow: '0 0 30px rgba(201,169,110,.05)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 600, color: 'var(--dark)', flexShrink: 0,
                }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Navi Singh</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Your dedicated SIVO account manager</div>
                  <div style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>✉ trade@sivohome.com</div>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', border: '1px solid rgba(201,169,110,.2)',
                    borderRadius: 4, fontSize: 9, color: 'var(--muted)',
                    letterSpacing: .5, textTransform: 'uppercase' as const,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block' }} />
                    Reply within 24h
                  </div>
                  <br />
                  <Link href="/trade-viewing" style={{
                    display: 'inline-block', marginTop: 6,
                    padding: '6px 16px', border: '1px solid var(--gold)',
                    borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const,
                    color: 'var(--gold)', textDecoration: 'none',
                  }}>Book a Call</Link>
                </div>
              </div>

              {/* Shipment Tracker */}
              <div className="card card-glow shimmer" style={{
                padding: 24, marginBottom: 16,
                borderRadius: 8,
                boxShadow: '0 0 30px rgba(201,169,110,.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>🚢</span>
                  <div style={{
                    fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                    fontSize: 18, color: '#fff',
                  }}>Shipment Tracker</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {stages.map((s, i) => {
                    const done = i <= currentStage
                    const active = i === currentStage
                    return (
                      <div key={s} style={{ flex: 1, textAlign: 'center' as const }}>
                        <div style={{
                          height: 4, borderRadius: 2, position: 'relative' as const,
                          background: done ? 'var(--gold)' : 'var(--surface, #1a1a2e)',
                          marginBottom: 6,
                        }}>
                          {active && (
                            <div style={{
                              position: 'absolute' as const, right: 0, top: -3,
                              width: 10, height: 10, borderRadius: '50%',
                              background: 'var(--gold)',
                              boxShadow: '0 0 10px rgba(201,169,110,.5)',
                            }} />
                          )}
                        </div>
                        <div style={{
                          fontSize: 9, letterSpacing: .5,
                          color: done ? 'var(--gold)' : 'var(--muted)',
                        }}>{s}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 10 }}>
                  {hasActiveShipments
                    ? 'Estimated arrival: March 2026 · Container ref: SIVO-2026-03'
                    : 'No active shipments. Place an order to begin tracking.'}
                </div>
              </div>

              {/* Order History */}
              <div style={{
                fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                fontSize: 20, color: '#fff', margin: '24px 0 12px',
              }}>Order History</div>

              {quotes.length === 0 ? (
                <div className="card card-glow shimmer" style={{
                  padding: 32, textAlign: 'center' as const,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: .3 }}>📋</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    No orders yet.{' '}
                    <Link href="/catalog" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                      Browse collection →
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                  {quotes.map((q: any) => (
                    <div key={q.id} className="card card-glow shimmer" style={{
                      padding: 20,
                      borderRadius: 8,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
                      }}>
                        <div>
                          <b style={{
                            color: '#fff',
                            fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                            fontSize: 18,
                          }}>{q.ref_id || `Quote #${q.id.slice(0, 8)}`}</b>
                          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 10 }}>
                            {new Date(q.created_at).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        {statusTag(q.status)}
                      </div>
                      {q.items?.map((item: any, idx: number) => (
                        <div key={idx} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 0', borderTop: '1px solid var(--border)',
                        }}>
                          <span style={{ fontSize: 12, color: '#fff' }}>
                            {item.product?.name || 'Product'}{' '}
                            <span style={{ color: 'var(--muted)' }}>({item.product?.sku || '—'})</span>
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--gold)' }}>
                            ×{item.quantity} · £{(item.unit_price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div style={{
                        display: 'flex', justifyContent: 'flex-end',
                        paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 4,
                      }}>
                        <b style={{
                          color: 'var(--gold)',
                          fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                          fontSize: 18,
                        }}>Total: £{(q.total_estimate || 0).toLocaleString()}</b>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {[
                  { href: '/catalog', label: 'Browse Collection' },
                  { href: '/trade-viewing', label: 'Book a Viewing' },
                  { href: '/trade-viewing', label: 'Request Samples' },
                ].map(btn => (
                  <Link key={btn.label} href={btn.href} style={{
                    flex: 1, textAlign: 'center' as const, padding: '10px 16px',
                    border: '1px solid var(--border)', borderRadius: 4,
                    fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' as const,
                    color: 'var(--muted)', textDecoration: 'none',
                  }}>{btn.label}</Link>
                ))}
              </div>
            </>
          )}

          {/* ═══ MY VIEWINGS TAB ═══ */}
          {tab === 'viewings' && (
            <>
              <div style={{
                fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                fontSize: 20, color: '#fff', marginBottom: 16,
              }}>My Viewing Requests</div>

              {viewings.length === 0 ? (
                <div className="card card-glow shimmer" style={{
                  padding: 32, textAlign: 'center' as const,
                  borderRadius: 8,
                }}>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>No viewing requests yet.</div>
                  <Link href="/trade-viewing" style={{
                    display: 'inline-block', padding: '10px 24px',
                    background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4,
                    fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const,
                    textDecoration: 'none',
                  }}>Book a Viewing</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {viewings.map((v: any) => (
                    <div key={v.id} className="card card-glow shimmer" style={{
                      padding: 20,
                      borderRadius: 8,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{
                            fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: 'var(--gold)',
                          }}>{v.ref_id}</span>
                          <span style={{
                            display: 'inline-block', marginLeft: 8,
                            padding: '2px 8px', borderRadius: 4,
                            fontSize: 10, fontWeight: 600, letterSpacing: .5, textTransform: 'uppercase' as const,
                            background: v.type === 'virtual' ? 'rgba(66,165,245,.15)' : 'rgba(201,169,110,.15)',
                            color: v.type === 'virtual' ? '#42a5f5' : 'var(--gold)',
                          }}>{v.type || 'virtual'}</span>
                        </div>
                        {statusTag(v.status)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.7 }}>
                        Preferred date: <b style={{ color: '#fff' }}>{v.preferred_date || 'Flexible'}</b>
                        {' · '}{v.time_preference || 'Flexible'}
                        {v.postcode && <> · Postcode: {v.postcode}</>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface, #1a1a2e)' }}>
                          <div style={{
                            height: '100%', borderRadius: 2, background: 'var(--gold)',
                            width: `${viewingProgress(v.status)}%`, transition: 'width .3s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: 9, color: 'var(--muted)' }}>{v.status}</span>
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
              <div className="card card-glow shimmer" style={{
                padding: 24, marginBottom: 16,
                borderRadius: 8,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                    fontSize: 20, color: '#fff',
                  }}>{companyName}</div>
                  {isApproved
                    ? <span style={{
                        padding: '3px 10px', borderRadius: 4,
                        fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const,
                        background: 'rgba(76,175,80,.15)', color: '#66bb6a',
                      }}>Approved</span>
                    : <span style={{
                        padding: '3px 10px', borderRadius: 4,
                        fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const,
                        background: 'rgba(255,167,38,.15)', color: '#ffa726',
                      }}>Pending Approval</span>
                  }
                </div>
                {profile?.company && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12,
                  }}>
                    {[
                      { label: 'Business Type', value: profile.company.business_type },
                      { label: 'VAT Number', value: profile.company.vat_number },
                      { label: 'Website', value: profile.company.website },
                      { label: 'Est. Annual Spend', value: profile.company.annual_spend },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{f.label}</div>
                        <div style={{ color: '#fff', fontSize: 13, marginTop: 2 }}>{f.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Manager */}
              <div className="card card-glow shimmer" style={{
                padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16,
                borderRadius: 8,
                boxShadow: '0 0 30px rgba(201,169,110,.05)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 600, color: 'var(--dark)', flexShrink: 0,
                }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Navi Singh</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Your dedicated SIVO account manager</div>
                  <div style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>trade@sivohome.com · +44 7346 325580</div>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', border: '1px solid rgba(201,169,110,.2)',
                  borderRadius: 4, fontSize: 9, color: 'var(--muted)',
                  letterSpacing: .5, textTransform: 'uppercase' as const, flexShrink: 0,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block' }} />
                  Reply within 24h
                </div>
              </div>

              {/* Team Table */}
              <div className="card card-glow shimmer" style={{
                padding: 24, marginBottom: 16,
                borderRadius: 8,
              }}>
                <div style={{
                  fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
                  fontSize: 18, color: '#fff', marginBottom: 16,
                }}>Team Members <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>(1)</span></div>
                <div style={{ overflowX: 'auto' as const }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Role', 'Status'].map(h => (
                          <th key={h} style={{
                            padding: '8px 12px', textAlign: 'left' as const,
                            fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const,
                            color: 'var(--muted)', fontWeight: 600,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: '#fff' }}>
                          {profile?.full_name || '—'} <span style={{ fontSize: 9, color: 'var(--gold)' }}>(you)</span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--muted)' }}>
                          {profile?.email || '—'}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 4,
                            fontSize: 10, fontWeight: 600, letterSpacing: .5, textTransform: 'uppercase' as const,
                            background: 'rgba(201,169,110,.15)', color: 'var(--gold)',
                          }}>{profile?.role === 'admin' ? 'admin' : 'owner'}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {isApproved
                            ? <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(76,175,80,.15)', color: '#66bb6a' }}>Approved</span>
                            : <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(255,167,38,.15)', color: '#ffa726' }}>Pending</span>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  )
}
