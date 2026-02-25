'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type DashTab = 'orders' | 'viewings' | 'team'

const STAGES = ['Order Placed', 'In Production', 'QC Inspection', 'Shipping', 'UK Delivery']
const ACCOUNT_MANAGER = { name: 'Navi Singh', title: 'Your dedicated SIVO account manager', email: 'trade@sivohome.com', phone: '+44 7346 325580' }

function tag(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    pending:   { bg: 'rgba(255,167,38,.15)',  color: '#ffa726' },
    approved:  { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    new:       { bg: 'rgba(66,165,245,.15)',  color: '#42a5f5' },
    assigned:  { bg: 'rgba(156,39,176,.15)',  color: '#ba68c8' },
    confirmed: { bg: 'rgba(201,169,110,.15)', color: '#c9a96e' },
    completed: { bg: 'rgba(76,175,80,.15)',   color: '#66bb6a' },
    quoted:    { bg: 'rgba(201,169,110,.15)', color: '#c9a96e' },
    rejected:  { bg: 'rgba(244,67,54,.15)',   color: '#ef5350' },
  }
  const c = map[status] || { bg: 'rgba(110,110,122,.1)', color: '#6e6e7a' }
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: c.bg, color: c.color }}>
      {status}
    </span>
  )
}

export default function DashboardClient({
  profile, quotes, viewings,
}: {
  profile: any; quotes: any[]; viewings: any[]
}) {
  const [activeTab, setActiveTab] = useState<DashTab>('orders')
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePass, setInvitePass] = useState('')
  const [inviteRole, setInviteRole] = useState('purchaser')
  const [inviting, setInviting] = useState(false)
  const [toast, setToast] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const isApproved = profile?.status === 'approved' || profile?.role === 'admin'
  const company = profile?.company
  const companyName = company?.name || 'Your Company'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const activeOrder = quotes.find(q => q.status === 'confirmed' || q.status === 'approved')
  const currentStage = activeOrder ? 2 : 0

  const handleInvite = async () => {
    if (!inviteName || !inviteEmail || !invitePass) { showToast('Please fill all fields'); return }
    setInviting(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email: inviteEmail, password: invitePass, options: { data: { full_name: inviteName } } })
      if (error) throw error
      if (data.user && company?.id) {
        await supabase.from('profiles').update({ company_id: company.id, full_name: inviteName, status: 'approved' }).eq('id', data.user.id)
      }
      showToast(`✓ ${inviteName} invited successfully`)
      setInviteName(''); setInviteEmail(''); setInvitePass('')
    } catch (err: any) {
      showToast(`Error: ${err.message}`)
    }
    setInviting(false)
  }

  const tabs: { id: DashTab; label: string }[] = [
    { id: 'orders', label: 'My Orders' },
    { id: 'viewings', label: 'My Viewings' },
    { id: 'team', label: 'Company & Team' },
  ]

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, padding: '12px 20px', background: 'var(--card)', border: '1px solid #66bb6a', borderRadius: 6, color: '#fff', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,.5)' }}>
          {toast}
        </div>
      )}

      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Trade Portal</span>
            <h1 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 42, color: '#fff', fontWeight: 400, margin: 0 }}>My Account</h1>
            <div style={{ width: 40, height: 2, background: 'var(--gold)', margin: '12px 0 0' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {isApproved ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid rgba(76,175,80,.3)', borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#66bb6a', fontWeight: 600 }}>
                  ✓ Approved Trade Account
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px solid rgba(255,167,38,.3)', borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#ffa726', fontWeight: 600 }}>
                  ⏳ Pending Approval
                </span>
              )}
              <span style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>
                Trade Partner Since {new Date().getFullYear()}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ padding: '10px 20px', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? 'var(--gold)' : 'transparent'}`, color: activeTab === t.id ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', transition: 'all .2s' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── ORDERS TAB ──────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div>
              {/* Account Manager */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: 'var(--dark)', flexShrink: 0 }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{ACCOUNT_MANAGER.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{ACCOUNT_MANAGER.title}</div>
                  <div style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>{ACCOUNT_MANAGER.email} · {ACCOUNT_MANAGER.phone}</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(76,175,80,.08)', border: '1px solid rgba(76,175,80,.2)', borderRadius: 50, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#66bb6a' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    Reply within 24h
                  </span>
                  <a href="mailto:trade@sivohome.com" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, fontSize: 10, color: 'var(--txt)', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Book a Call
                  </a>
                </div>
              </div>

              {/* Shipment Tracker */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 16 }}>🚢</span>
                  <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 18, color: '#fff' }}>Shipment Tracker</div>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0 }}>
                  {STAGES.map((stage, i) => (
                    <div key={stage} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {i > 0 && (
                        <div style={{ position: 'absolute', left: '-50%', right: '50%', top: 10, height: 3, background: i <= currentStage ? 'linear-gradient(90deg, var(--gold), var(--gold-l))' : 'var(--surface)', zIndex: 0 }} />
                      )}
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < currentStage ? 'var(--gold)' : i === currentStage ? 'var(--gold)' : 'var(--surface)', border: `2px solid ${i <= currentStage ? 'var(--gold)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                        {i < currentStage && <span style={{ fontSize: 10, color: 'var(--dark)' }}>✓</span>}
                        {i === currentStage && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dark)', display: 'block' }} />}
                      </div>
                      <div style={{ fontSize: 9, color: i <= currentStage ? 'var(--gold)' : 'var(--muted)', marginTop: 6, textAlign: 'center', letterSpacing: '0.5px' }}>{stage}</div>
                    </div>
                  ))}
                </div>
                {quotes.length === 0 && (
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16, textAlign: 'center' }}>No active shipments. Place an order to begin tracking.</div>
                )}
              </div>

              {/* Order History */}
              <div style={{ marginBottom: 8 }}>
                <h3 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 22, color: '#fff', fontWeight: 400, marginBottom: 16 }}>Order History</h3>
                {quotes.length > 0 ? (
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--surface)' }}>
                          {['Ref', 'Date', 'Items', 'Status'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'left' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((q: any) => (
                          <tr key={q.id} style={{ borderTop: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>#{q.id?.slice(0, 8).toUpperCase()}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--txt)' }}>{new Date(q.created_at).toLocaleDateString('en-GB')}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--txt)' }}>{q.items?.length || 0} products</td>
                            <td style={{ padding: '12px 16px' }}>{tag(q.status || 'pending')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '60px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>📋</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>No orders yet</div>
                    <Link href="/catalog" style={{ padding: '10px 24px', background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4, fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Browse Collection →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── VIEWINGS TAB ────────────────────────────────── */}
          {activeTab === 'viewings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 22, color: '#fff', fontWeight: 400, margin: 0 }}>My Viewing Requests</h3>
                <Link href="/trade-viewing" style={{ padding: '9px 18px', background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4, fontSize: 10, fontWeight: 600, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  + Book Viewing
                </Link>
              </div>
              {viewings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {viewings.map((v: any) => {
                    const progress = { new: 25, assigned: 50, confirmed: 75, completed: 100 }[v.status as string] || 25
                    return (
                      <div key={v.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#fff', marginBottom: 4 }}>
                              {v.type === 'visit' ? '🏭 Factory Visit' : '📍 Showroom Visit'}
                              {v.project_name && <span style={{ fontSize: 11, color: 'var(--gold)', marginLeft: 8 }}>— {v.project_name}</span>}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                              {v.preferred_date && `${new Date(v.preferred_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
                              {v.time_window && ` · ${v.time_window}`}
                            </div>
                          </div>
                          {tag(v.status || 'new')}
                        </div>
                        <div style={{ height: 4, background: 'var(--surface)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold), #e8d5a8)', borderRadius: 2, transition: 'width 1s ease' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                          {['Requested', 'Assigned', 'Confirmed', 'Completed'].map((s, i) => (
                            <span key={s} style={{ fontSize: 8, color: progress >= (i + 1) * 25 ? 'var(--gold)' : 'var(--muted)', letterSpacing: '0.5px' }}>{s}</span>
                          ))}
                        </div>
                        {v.notes && (
                          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>"{v.notes}"</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '60px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>📅</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>No viewings booked yet</div>
                  <Link href="/trade-viewing" style={{ padding: '10px 24px', background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4, fontSize: 11, fontWeight: 600, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Book a Viewing →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── TEAM TAB ─────────────────────────────────────── */}
          {activeTab === 'team' && (
            <div>
              {/* Company card */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#fff' }}>{companyName}</div>
                  {isApproved ? (
                    <span style={{ padding: '4px 12px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(76,175,80,.15)', color: '#66bb6a' }}>APPROVED</span>
                  ) : (
                    <span style={{ padding: '4px 12px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(255,167,38,.15)', color: '#ffa726' }}>PENDING</span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'Business Type', value: company?.business_type || '—' },
                    { label: 'VAT Number', value: company?.vat_number || '—' },
                    { label: 'Website', value: company?.website || '—' },
                    { label: 'Est. Annual Spend', value: company?.annual_spend || '—' },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{f.label}</div>
                      <div style={{ color: '#fff', fontSize: 13, marginTop: 2 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Manager */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: 'var(--dark)', flexShrink: 0 }}>NS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{ACCOUNT_MANAGER.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{ACCOUNT_MANAGER.title}</div>
                  <div style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>{ACCOUNT_MANAGER.email} · {ACCOUNT_MANAGER.phone}</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(76,175,80,.08)', border: '1px solid rgba(76,175,80,.2)', borderRadius: 50, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#66bb6a' }}>
                  ● Reply within 24h
                </span>
              </div>

              {/* Team Members */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 16 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff', marginBottom: 16 }}>
                  Team Members <span style={{ fontSize: 12, color: 'var(--muted)' }}>(1)</span>
                </div>
                <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface)' }}>
                        {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#fff' }}>
                          {profile?.full_name} <span style={{ fontSize: 9, color: 'var(--gold)' }}>(you)</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{profile?.email}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(201,169,110,.15)', color: 'var(--gold)' }}>Owner</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(76,175,80,.15)', color: '#66bb6a' }}>Approved</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invite */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 24 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff', marginBottom: 16 }}>Invite Team Member</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Full Name *</label>
                    <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Team member name"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Email *</label>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="name@company.co.uk"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Password *</label>
                    <input type="password" value={invitePass} onChange={e => setInvitePass(e.target.value)} placeholder="Set password"
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 5 }}>Role</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--txt)', fontSize: 12 }}>
                      <option value="purchaser">Purchaser — Can order</option>
                      <option value="owner">Owner — Full access</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleInvite} disabled={inviting}
                  style={{ padding: '11px 24px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {inviting ? 'Sending…' : 'Send Invite'}
                </button>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>
                  Invited users inherit your company's approval status and can log in immediately.
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
