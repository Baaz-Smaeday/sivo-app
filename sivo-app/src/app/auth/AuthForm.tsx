'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const BUSINESS_TYPES = ['Retailer', 'Interior Designer', 'Hospitality', 'Contractor', 'Online Retailer', 'Other']
const SPEND_RANGES = ['Under £5k', '£5k–£15k', '£15k–£50k', '£50k+']

const DEMO_ACCOUNTS = [
  { label: 'Admin', icon: '👑', sub: 'Navi Singh', company: 'SIVO HQ', desc: 'Full platform control', email: 'admin@sivohome.com', pass: 'admin123', role: 'admin', color: '#c9a96e', bg: 'rgba(201,169,110,.08)', border: 'rgba(201,169,110,.3)' },
  { label: 'Buyer', icon: '🛒', sub: 'James Wilson', company: 'Wilson Interiors', desc: 'Trade buyer dashboard', email: 'buyer@demo.co.uk', pass: 'buyer123', role: 'buyer', color: '#4fc3f7', bg: 'rgba(79,195,247,.08)', border: 'rgba(79,195,247,.3)' },
  { label: 'Supplier', icon: '🏭', sub: 'Raj Patel', company: 'GHP Manufacturing', desc: 'Production partner view', email: 'supplier@demo.co.uk', pass: 'supplier123', role: 'supplier', color: '#81c784', bg: 'rgba(129,199,132,.08)', border: 'rgba(129,199,132,.3)' },
]

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [tab, setTab] = useState<'login' | 'register'>((searchParams.get('tab') as 'login' | 'register') || 'login')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
      if (error) throw error
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        router.push(profile?.role === 'admin' || profile?.role === 'supplier' ? '/admin' : '/dashboard')
        router.refresh()
      }
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
      router.push(role === 'admin' || role === 'supplier' ? '/admin' : '/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(`Demo login failed: ${err.message}`)
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
    const { data: companyData, error: companyError } = await supabase.from('companies').insert({ name: regCompany, vat_number: regVat || null, website: regWebsite || null, business_type: regBusinessType, annual_spend: regSpend || null, status: 'pending' }).select().single()
    if (companyError) { setError('Failed to create company record.'); setLoading(false); return }
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: regEmail, password: regPassword, options: { data: { full_name: regName } } })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (authData.user) {
      await supabase.from('profiles').update({ company_id: companyData.id, full_name: regName }).eq('id', authData.user.id)
      await supabase.from('trade_applications').insert({ company_id: companyData.id, full_name: regName, email: regEmail, vat_number: regVat || null, website: regWebsite || null, business_type: regBusinessType, annual_spend: regSpend || null, company_name: regCompany, status: 'pending' })
      await supabase.from('audit_log').insert({ action: 'TRADE_APP_SUBMIT', actor: regEmail, target_type: 'trade_application', details: { name: regName, company: regCompany, businessType: regBusinessType } })
    }
    setSuccess('Application submitted! Your trade account will be reviewed within 1–2 working days.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        <div style={{ marginBottom: 28, padding: '20px 20px 16px', background: 'linear-gradient(135deg, rgba(201,169,110,.05), transparent)', border: '1px solid rgba(201,169,110,.2)', borderRadius: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', textAlign: 'center', marginBottom: 16 }}>⚡ Quick Demo Login</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => handleDemoLogin(acc.email, acc.pass, acc.role)} disabled={demoLoading !== null}
                style={{ background: demoLoading === acc.email ? acc.bg : 'transparent', border: `1px solid ${demoLoading === acc.email ? acc.color : 'var(--border)'}`, borderRadius: 10, padding: '14px 8px', cursor: demoLoading !== null ? 'wait' : 'pointer', transition: 'all .2s', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                onMouseEnter={e => { if (!demoLoading) { (e.currentTarget as HTMLButtonElement).style.background = acc.bg; (e.currentTarget as HTMLButtonElement).style.borderColor = acc.color } }}
                onMouseLeave={e => { if (demoLoading !== acc.email) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' } }}
              >
                <div style={{ fontSize: 26, lineHeight: 1 }}>{demoLoading === acc.email ? '⏳' : acc.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: acc.color }}>{demoLoading === acc.email ? 'Signing in...' : acc.label}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', lineHeight: 1.4 }}>{acc.sub}<br />{acc.company}</div>
                <div style={{ fontSize: 8, color: acc.color, opacity: .7, marginTop: 2 }}>{acc.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
            <span style={{ color: '#c9a96e' }}>Admin</span> admin@sivohome.com / admin123 &nbsp;·&nbsp;
            <span style={{ color: '#4fc3f7' }}>Buyer</span> buyer@demo.co.uk / buyer123 &nbsp;·&nbsp;
            <span style={{ color: '#81c784' }}>Supplier</span> supplier@demo.co.uk / supplier123
          </div>
        </div>

      </div>
    </div>
  )
}

      </div>
    </div>
  )
}
