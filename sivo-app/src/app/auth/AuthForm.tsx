'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const BUSINESS_TYPES = ['Retailer', 'Interior Designer', 'Hospitality', 'Contractor', 'Online Retailer', 'Other']
const SPEND_RANGES = ['Under £5k', '£5k–£15k', '£15k–£50k', '£50k+']

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [tab, setTab] = useState<'login' | 'register'>(
    (searchParams.get('tab') as 'login' | 'register') || 'login'
  )
  const [loading, setLoading] = useState(false)
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check role and redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    }
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
        data: {
          full_name: regName,
        },
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

      // 4. Also write to trade_applications for admin review
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Tabs */}
        <div className="flex border border-brand-border rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => { setTab('login'); setError(''); setSuccess('') }}
            className={`flex-1 py-3 text-xs font-semibold tracking-[1.5px] uppercase transition-colors ${
              tab === 'login'
                ? 'bg-brand-surface text-brand-gold'
                : 'bg-brand-bg text-brand-muted hover:text-brand-text'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); setSuccess('') }}
            className={`flex-1 py-3 text-xs font-semibold tracking-[1.5px] uppercase transition-colors ${
              tab === 'register'
                ? 'bg-brand-surface text-brand-gold'
                : 'bg-brand-bg text-brand-muted hover:text-brand-text'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
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
            <div>
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
            <button type="submit" disabled={loading} className="btn-gold w-full text-sm tracking-wider uppercase">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && !success && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-brand-surface border border-brand-border rounded p-4 text-xs text-brand-muted leading-relaxed mb-2">
              Trade accounts are for UK-based retailers, interior designers, and hospitality buyers. Applications are reviewed within 1–2 working days.
            </div>

            <div>
              <label className="input-label">Full Name *</label>
              <input type="text" className="input-field" placeholder="Your full name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
            </div>

            <div>
              <label className="input-label">Company Name *</label>
              <input type="text" className="input-field" placeholder="Company name" value={regCompany} onChange={(e) => setRegCompany(e.target.value)} required />
            </div>

            <div>
              <label className="input-label">Business Type *</label>
              <select className="select-field" value={regBusinessType} onChange={(e) => setRegBusinessType(e.target.value)} required>
                <option value="">Select business type...</option>
                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">VAT Number</label>
                <input type="text" className="input-field" placeholder="GB 123 4567 89" value={regVat} onChange={(e) => setRegVat(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Website</label>
                <input type="text" className="input-field" placeholder="www.yoursite.co.uk" value={regWebsite} onChange={(e) => setRegWebsite(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="input-label">Estimated Annual Spend</label>
              <select className="select-field" value={regSpend} onChange={(e) => setRegSpend(e.target.value)}>
                <option value="">Select range...</option>
                {SPEND_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="input-label">Business Email *</label>
              <input type="email" className="input-field" placeholder="your@company.co.uk" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
            </div>

            <div>
              <label className="input-label">Password *</label>
              <input type="password" className="input-field" placeholder="Create password (min 6 chars)" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full text-sm tracking-wider uppercase">
              {loading ? 'Submitting...' : 'Apply for Trade Account'}
            </button>

            <p className="text-center text-[11px] text-brand-muted">
              ✓ Your account will be reviewed and approved within 1–2 working days
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
