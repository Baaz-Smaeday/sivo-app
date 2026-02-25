'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type ViewingType = 'virtual' | 'visit' | null

function getDemoCookie(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/sivo-demo-role=([^;]+)/)
  return match ? match[1] : ''
}

const DEMO_PROFILE = {
  full_name: 'James Wilson',
  company: { name: 'Wilson Interiors Ltd' },
  email: 'buyer@demo.co.uk',
}

export default function TradeViewingPage() {
  const [modalType, setModalType] = useState<ViewingType>(null)
  const [step, setStep] = useState(1)
  const [refId, setRefId] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    preferredDate: '', timeWindow: 'Flexible', phone: '',
    postcode: '', projectName: '', notes: '',
  })

  const supabase = createClient()

  const openModal = async (type: ViewingType) => {
    // Allow demo users
    const demoRole = getDemoCookie()
    if (!demoRole) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth?tab=login'; return }
    }
    setModalType(type)
    setStep(1)
    setRefId('')
    setForm({ preferredDate: '', timeWindow: 'Flexible', phone: '', postcode: '', projectName: '', notes: '' })
  }

  const closeModal = () => { setModalType(null); setStep(1) }

  const submitRequest = async () => {
    if (!form.preferredDate) { alert('Please select a preferred date'); return }
    if (!form.phone) { alert('Please enter a phone number'); return }
    if (modalType === 'visit' && !form.postcode) { alert('Please enter your postcode for visit scheduling'); return }

    setLoading(true)
    try {
      const demoRole = getDemoCookie()

      if (demoRole) {
        // Demo mode — skip Supabase, just show confirmation
        await new Promise(r => setTimeout(r, 800))
        setRefId(`SIVO-VIEW-DEMO-${Date.now().toString().slice(-4)}`)
        setStep(2)
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth?tab=login'; return }

      const { data: profile } = await supabase
        .from('profiles').select('full_name, company:companies(name)')
        .eq('id', user.id).single()

      let newRef = 'SIVO-VIEW-000001'
      try {
        const { data } = await supabase.rpc('next_viewing_ref')
        if (data) newRef = data
      } catch {
        const { count } = await supabase.from('viewing_requests').select('*', { count: 'exact', head: true })
        newRef = `SIVO-VIEW-${String((count || 0) + 1).padStart(6, '0')}`
      }

      await supabase.from('viewing_requests').insert({
        ref_id: newRef,
        type: modalType,
        contact_name: (profile as any)?.full_name || '',
        email: user.email,
        phone: form.phone,
        company_name: (profile as any)?.company?.name || null,
        preferred_date: form.preferredDate || null,
        time_preference: form.timeWindow || 'Flexible',
        postcode: form.postcode || null,
        project_name: form.projectName || null,
        notes: form.notes || null,
        status: 'new',
      })

      setRefId(newRef)
      setStep(2)
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isVisit = modalType === 'visit'

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>Appointment Only</span>
            <h1 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', fontWeight: 400, margin: '0 0 12px' }}>Trade Viewing & Appointments</h1>
            <div style={{ width: 60, height: 2, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 10, maxWidth: 540, margin: '10px auto 0' }}>
              Personal product viewings for trade accounts. See the finish, assess the quality, and plan your collection — before you commit to a production order.
            </p>
          </div>

          {/* Two Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginTop: 32 }}>
            {/* Virtual Viewing */}
            <div className="card card-glow shimmer" style={{ padding: 32 }}>
              <div style={{ marginBottom: 16 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
              <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 22, color: '#fff', marginBottom: 8 }}>Virtual Viewing</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
                Book a 30-minute video call with your account manager. We&apos;ll walk through finish samples, collection options, and shipment scheduling — live on camera.
              </div>
              <div style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
                {['Live finish sample presentation', 'Collection planning assistance', 'Shipment timeline review', 'MOQ & pricing discussion'].map(t => (
                  <div key={t} style={{ fontSize: 11, color: 'var(--txt, #e0e0e0)' }}>✓ {t}</div>
                ))}
              </div>
              <button onClick={() => openModal('virtual')} style={{
                width: '100%', padding: '12px 20px', background: 'var(--gold)', color: 'var(--dark)',
                border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Request Virtual Viewing</button>
            </div>

            {/* In-Person Store Visit */}
            <div className="card card-glow shimmer" style={{ padding: 32, position: 'relative' }}>
              <div style={{ marginBottom: 16 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 22, color: '#fff', marginBottom: 8 }}>In-Person Store Visit</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
                We visit you. SIVO brings hero product samples and finish swatches directly to your store or showroom — anywhere in mainland UK. Personal, unhurried, and on your terms.
              </div>
              <div style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
                {['Hero product samples brought to your store', 'Full finish swatch kit', 'Collection catalogue & pricing pack', 'Mainland UK coverage'].map(t => (
                  <div key={t} style={{ fontSize: 11, color: 'var(--txt, #e0e0e0)' }}>✓ {t}</div>
                ))}
              </div>
              <button onClick={() => openModal('visit')} style={{
                width: '100%', padding: '12px 20px', background: 'var(--gold)', color: 'var(--dark)',
                border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Request Store Visit</button>
              <div style={{
                marginTop: 12, display: 'flex', justifyContent: 'center',
                padding: '4px 12px', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                color: 'var(--muted)', border: '1px solid rgba(201,169,110,.2)', borderRadius: 4,
                width: 'fit-content', margin: '12px auto 0',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block', marginRight: 6, marginTop: 3 }}></span>
                Most Popular
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="card card-glow" style={{ padding: 32, marginTop: 32, background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)' }}>
            <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 20, color: '#fff', marginBottom: 20, textAlign: 'center' }}>How It Works</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
              {[
                { n: 1, t: 'Request Received', d: "Submit your preferred date and time. We'll take it from there.", active: true },
                { n: 2, t: 'Options Sent Within 24h', d: 'Your account manager confirms timing and prepares your session.', active: false },
                { n: 3, t: 'Viewing Confirmed', d: 'Samples prepared, agenda set, and your dedicated viewing takes place.', active: false },
              ].map(s => (
                <div key={s.n}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', margin: '0 auto 10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 14,
                    background: s.active ? 'var(--gold)' : 'var(--surface, #1a1a2e)',
                    color: s.active ? 'var(--dark)' : 'var(--gold)',
                    border: s.active ? 'none' : '1px solid var(--border)',
                  }}>{s.n}</div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What We Bring */}
          <div className="card card-glow shimmer" style={{ padding: 32, marginTop: 16 }}>
            <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 20, color: '#fff', marginBottom: 16 }}>What We Bring</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { icon: '📦', t: 'Hero Product Samples', d: 'Core items from each collection, kept in the UK for immediate viewing.' },
                { icon: '🎨', t: 'Finish Swatches', d: 'Wood finishes, metal coatings, and upholstery options to assess in person.' },
                { icon: '📋', t: 'Collection Planning', d: 'Work with your account manager to build a range that suits your retail space.' },
                { icon: '🚢', t: 'Shipment Scheduling', d: 'Map out container windows and delivery timelines specific to your order.' },
              ].map(item => (
                <div key={item.t} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 4 }}>{item.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>{item.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Accounts Only */}
          <div style={{
            padding: 24, marginTop: 16, borderRadius: 8,
            background: 'rgba(201,169,110,.03)', border: '1px solid rgba(201,169,110,.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 10px', border: '1px solid rgba(201,169,110,.2)', borderRadius: 4,
                fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)',
              }}>Trade Accounts Only</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Trade viewings are available to SIVO trade account holders. Not yet registered?</span>
              <Link href="/auth?tab=register" style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'underline' }}>
                Apply for a trade account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {modalType && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 6000,
          background: 'rgba(0,0,0,.88)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            maxWidth: 480, width: '100%', padding: 32,
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
            maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 22, color: '#fff', margin: 0 }}>
                {step === 1 ? (isVisit ? 'Request In-Person Store Visit' : 'Request Virtual Viewing') : 'Request Confirmed'}
              </h2>
              <span onClick={closeModal} style={{ cursor: 'pointer', fontSize: 18, color: 'var(--muted)' }}>✕</span>
            </div>

            {step === 1 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: isVisit ? 'rgba(201,169,110,.12)' : 'rgba(66,165,245,.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isVisit ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#42a5f5" strokeWidth="2"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>
                      {isVisit ? 'We come to you' : '30-minute video call'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {isVisit ? 'Mainland UK coverage · Samples & swatch kit' : 'Live product walkthrough · Collection planning'}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Preferred Date *</label>
                  <input type="date" value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Time Window</label>
                    <select value={form.timeWindow}
                      onChange={(e) => setForm({ ...form, timeWindow: e.target.value })}
                      style={inputStyle}>
                      <option value="Flexible">Flexible</option>
                      <option value="Morning (9am-12pm)">Morning (9am–12pm)</option>
                      <option value="Afternoon (12pm-5pm)">Afternoon (12pm–5pm)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input value={form.phone} placeholder="07xxx xxx xxx"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={inputStyle} />
                  </div>
                </div>

                {isVisit && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Store / Showroom Postcode *</label>
                    <input value={form.postcode} placeholder="e.g. M1 1AA"
                      onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                      style={inputStyle} />
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Project Name <span style={{ color: 'var(--muted)', fontWeight: 300 }}>(optional)</span></label>
                  <input value={form.projectName} placeholder="e.g. Hotel refit, New store launch"
                    onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                    style={inputStyle} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Collections / Finishes of Interest <span style={{ color: 'var(--muted)', fontWeight: 300 }}>(optional)</span></label>
                  <textarea value={form.notes} rows={3}
                    placeholder="Tell us which collections, materials, or finishes you'd like to see..."
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' as const }} />
                </div>

                <button onClick={submitRequest} disabled={loading} style={{
                  width: '100%', padding: '14px 20px', background: 'var(--gold)', color: 'var(--dark)',
                  border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#66bb6a',
                  color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>✓</div>
                <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: 24, color: '#fff', marginBottom: 6 }}>Request Confirmed</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: 'var(--gold)', marginBottom: 16 }}>{refId}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 380, margin: '0 auto 20px' }}>
                  {isVisit
                    ? <>Your store visit request has been received. Your account manager will confirm route and timings within <b style={{ color: '#fff' }}>24 hours</b> (mainland UK).</>
                    : <>Your virtual viewing request has been received. Your account manager will email 2–3 time options within <b style={{ color: '#fff' }}>24 hours</b> (Mon–Fri).</>
                  }
                </div>

                <div style={{ padding: 16, marginBottom: 16, textAlign: 'left', background: 'rgba(201,169,110,.04)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>What Happens Next</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {[
                      { n: 1, title: 'Confirmation email', desc: isVisit ? 'within 24 hours with visit date and time' : 'within 24 hours with 2–3 time options', active: true },
                      { n: 2, title: isVisit ? 'Samples prepared' : 'Calendar invite sent', desc: isVisit ? 'hero products and swatch kit packed for your visit' : 'video link and agenda shared ahead of call', active: false },
                      { n: 3, title: 'Viewing confirmed', desc: isVisit ? 'your dedicated account manager visits your store' : 'live walkthrough of products, finishes, and collection planning', active: false },
                    ].map(s => (
                      <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 600,
                          background: s.active ? 'var(--gold)' : 'var(--surface, #1a1a2e)',
                          color: s.active ? 'var(--dark)' : 'var(--muted)',
                          border: s.active ? 'none' : '1px solid var(--border)',
                        }}>{s.n}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                          <b style={{ color: '#fff' }}>{s.title}</b> — {s.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
                  Your account manager: <b style={{ color: 'var(--gold)' }}>Navi Singh</b> · trade@sivohome.com · +44 7346 325580
                </div>
                <button onClick={closeModal} style={{
                  padding: '10px 28px', background: 'var(--gold)', color: 'var(--dark)',
                  border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
  color: 'var(--gold)', fontWeight: 600, marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 8,
  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(201,169,110,.2)',
  color: '#fff', fontSize: 13, outline: 'none',
}
