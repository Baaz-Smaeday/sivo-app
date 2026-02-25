'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const BUSINESS_TYPES = ['Retailer', 'Interior Designer', 'Hospitality', 'Contractor', 'Online Retailer', 'Other']
const SPEND_RANGES = ['Under £5k', '£5k–£15k', '£15k–£50k', '£50k+']

// ─── DEMO ACCOUNTS (matches HTML file) ───
const DEMO_ACCOUNTS = [
  { label: '👑 Admin', sub: 'Navi Singh · SIVO', email: 'admin@sivohome.com', pass: 'admin123', role: 'admin', color: 'var(--gold)' },
  { label: '🛒 Buyer', sub: 'James Wilson · Wilson Interiors', email: 'buyer@demo.co.uk', pass: 'buyer123', role: 'buyer', color: '#4fc3f7' },
  { label: '🏭 Supplier', sub: 'Raj Patel · GHP Manufacturing', email: 'supplier@demo.co.uk', pass: 'supplier123', role: 'supplier', color: '#81c784' },
]

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [tab, setTab] = useState<'login' | 'register'>(
    (searchParams.get('tab') as 'login' | 'register') || 'login'
  )
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regCompany, setRegCompany] = useState('')
  const [regBusinessType, setRegBusinessType] = useState('')
  const [regVat, setRegVat] = useState('')
  const [regWebsite, setRegWebsite] = useState('')
  const [regSpend, setRegSpend] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  useEffect(() => {
    const t = searchParams.get('tab')
    if (t === 'login' || t === 'register') setTab(t)
  }, [searchParams])

  const doLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'supplier') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await doLogin(loginEmail, loginPassword)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  const handleDemoLogin = async (email: string, pass: string, role: string) => {
    setDemoLoading(email)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (error) throw error

      // Redirect based on known demo role — middleware will validate against DB
      if (role === 'admin' || role === 'supplier') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (err: any) {
      setError(`Demo login failed for ${email}. Make sure the account exists in Supabase Auth.`)
    }
    setDemoLoading(null)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!regName || !regCompany || !regBusinessType || !regEmail || !regPassword) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }

    // 1. Create company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: regCompany,
        vat_number: regVat || null,
        website: regWebsite || null,
        business_type: regBusinessType,
        annual_spend: regSpend || null,
        status: 'pending',
      })
      .select()
      .single()

    if (companyError) {
      setError('Failed to create company record.')
      setLoading(false)
      return
    }

    // 2. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: { full_name: regName },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 3. Link profile to company
    if (authData.user) {
      await supabase
        .from('profiles')
        .update({
          company_id: companyData.id,
          full_name: regName,
        })
        .eq('id', authData.user.id)

      // 4. Trade application for admin review
      await supabase.from('trade_applications').insert({
        company_id: companyData.id,
        full_name: regName,
        email: regEmail,
        vat_number: regVat || null,
        website: regWebsite || null,
        business_type: regBusinessType,
        annual_spend: regSpend || null,
        company_name: regCompany,
        status: 'pending',
      })

      // 5. Audit log
      await supabase.from('audit_log').insert({
        action: 'TRADE_APP_SUBMIT',
        actor: regEmail,
        target_type: 'trade_application',
        details: { name: regName, company: regCompany, businessType: regBusinessType },
      })
    }

    setSuccess('Application submitted! Your trade account will be reviewed within 1–2 working days.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* ─── DEMO LOGIN BUTTONS ─── */}
        <div className="card" style={{
          padding: 20, marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)',
          borderColor: 'rgba(201,169,110,.15)',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12, textAlign: 'center' }}>
            ⚡ Quick Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => handleDemoLogin(acc.email, acc.pass, acc.role)}
                disabled={demoLoading !== null}
                className="card card-glow"
                style={{
                  padding: '14px 8px',
                  textAlign: 'center',
                  cursor: demoLoading ? 'wait' : 'pointer',
                  background: demoLoading === acc.email ? 'rgba(201,169,110,.08)' : 'transparent',
                  border: 'none',
                  transition: 'all .2s',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>
                  {demoLoading === acc.email ? '⏳' : acc.label.split(' ')[0]}
                </div>
                <div style={{ fontSize: 11, color: acc.color, fontWeight: 600 }}>
                  {demoLoading === acc.email ? 'Signing in...' : acc.label.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{acc.sub}</div>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
            Admin: admin@sivohome.com / admin123 · Buyer: buyer@demo.co.uk / buyer123 · Supplier: supplier@demo.co.uk / supplier123
          </div>
        </div>

        {/* ─── DIVIDER ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>or sign in manually</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* ─── TABS ─── */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
          <button
            onClick={() => { setTab('login'); setError(''); setSuccess('') }}
            style={{
              flex: 1, padding: '12px 0', fontSize: 11, fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              background: tab === 'login' ? 'var(--surface)' : 'transparent',
              color: tab === 'login' ? 'var(--gold)' : 'var(--muted)',
              border: 'none', cursor: 'pointer', transition: 'all .2s',
            }}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); setSuccess('') }}
            style={{
              flex: 1, padding: '12px 0', fontSize: 11, fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              background: tab === 'register' ? 'var(--surface)' : 'transparent',
              color: tab === 'register' ? 'var(--gold)' : 'var(--muted)',
              border: 'none', cursor: 'pointer', transition: 'all .2s',
            }}
          >
            Apply for Trade Account
          </button>
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{
            marginBottom: 16, padding: 12,
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
            borderRadius: 8, color: '#fca5a5', fontSize: 13,
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            marginBottom: 16, padding: 12,
            background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)',
            borderRadius: 8, color: '#86efac', fontSize: 13,
          }}>
            {success}
          </div>
        )}

        {/* ─── LOGIN FORM ─── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@company.co.uk"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold" style={{
              width: '100%', fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ─── REGISTER FORM ─── */}
        {tab === 'register' && !success && (
          <form onSubmit={handleRegister}>
            <div className="card" style={{
              padding: 14, marginBottom: 16,
              background: 'var(--surface)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6,
            }}>
              Trade accounts are for UK-based retailers, interior designers, and hospitality buyers. Applications are reviewed within 1–2 working days.
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Full Name *</label>
              <input type="text" className="input-field" placeholder="Your full name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Company Name *</label>
              <input type="text" className="input-field" placeholder="Company name" value={regCompany} onChange={(e) => setRegCompany(e.target.value)} required />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Business Type *</label>
              <select className="select-field" value={regBusinessType} onChange={(e) => setRegBusinessType(e.target.value)} required>
                <option value="">Select business type...</option>
                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="input-label">VAT Number</label>
                <input type="text" className="input-field" placeholder="GB 123 4567 89" value={regVat} onChange={(e) => setRegVat(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Website</label>
                <input type="text" className="input-field" placeholder="www.yoursite.co.uk" value={regWebsite} onChange={(e) => setRegWebsite(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Estimated Annual Spend</label>
              <select className="select-field" value={regSpend} onChange={(e) => setRegSpend(e.target.value)}>
                <option value="">Select range...</option>
                {SPEND_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Business Email *</label>
              <input type="email" className="input-field" placeholder="your@company.co.uk" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Password *</label>
              <input type="password" className="input-field" placeholder="Create password (min 6 chars)" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{
              width: '100%', fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              {loading ? 'Submitting...' : 'Apply for Trade Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
              ✓ Your account will be reviewed and approved within 1–2 working days
            </p>
          </form>
        )}

        {/* ─── SETUP INSTRUCTIONS (collapsible) ─── */}
        <details style={{ marginTop: 32 }}>
          <summary style={{ fontSize: 10, color: 'var(--muted)', cursor: 'pointer', letterSpacing: 1 }}>
            ⚙️ FIRST TIME SETUP — Create demo accounts
          </summary>
          <div className="card" style={{ marginTop: 8, padding: 16, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 8 }}><strong style={{ color: '#fff' }}>Step 1:</strong> Register 3 accounts via the form above:</p>
            <div style={{ fontFamily: 'monospace', fontSize: 10, padding: 8, background: 'rgba(0,0,0,.3)', borderRadius: 6, marginBottom: 12 }}>
              admin@sivohome.com / admin123<br />
              buyer@demo.co.uk / buyer123<br />
              supplier@demo.co.uk / supplier123
            </div>
            <p style={{ marginBottom: 8 }}><strong style={{ color: '#fff' }}>Step 2:</strong> In Supabase → Table Editor → profiles:</p>
            <div style={{ fontFamily: 'monospace', fontSize: 10, padding: 8, background: 'rgba(0,0,0,.3)', borderRadius: 6 }}>
              admin@sivohome.com → role: admin, status: approved<br />
              buyer@demo.co.uk → role: buyer, status: approved<br />
              supplier@demo.co.uk → role: supplier, status: approved
            </div>
          </div>
        </details>

      </div>
    </div>
  )
}
