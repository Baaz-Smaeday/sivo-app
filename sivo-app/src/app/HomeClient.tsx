'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useBasket } from '@/lib/basket'

type Profile = {
  full_name: string | null
  role: string
  status: string
  company_id: string | null
}

type Company = {
  name: string
}

function getDemoCookie(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/sivo-demo-role=([^;]+)/)
  return match ? match[1] : ''
}

const DEMO_PROFILES: Record<string, any> = {
  buyer: { full_name: 'James Wilson', role: 'buyer', status: 'approved', company_id: null },
  admin: { full_name: 'Navi Singh',   role: 'admin', status: 'approved', company_id: null },
}
const DEMO_COMPANIES: Record<string, Company> = {
  buyer: { name: 'Wilson Interiors Ltd' },
  admin: { name: 'SIVO HQ' },
}

export default function HomeClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [savedCount, setSavedCount] = useState(0)
  const [companyLogo, setCompanyLogo] = useState('')
  const [companyDisplayName, setCompanyDisplayName] = useState('')
  const supabase = createClient()
  const { items } = useBasket()

  useEffect(() => {
    // Read saved count + branding from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('sivo_saved') || '[]')
      setSavedCount(saved.length)
      setCompanyLogo(localStorage.getItem('sivo_company_logo') || '')
      setCompanyDisplayName(localStorage.getItem('sivo_company_name') || '')
    } catch {}

    const demoRole = getDemoCookie()
    if (demoRole === 'buyer' || demoRole === 'admin') {
      setProfile(DEMO_PROFILES[demoRole])
      setCompany(DEMO_COMPANIES[demoRole])
      return
    }

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('full_name, role, status, company_id').eq('id', user.id).single()
      if (p) {
        setProfile(p)
        if (p.company_id) {
          const { data: c } = await supabase.from('companies').select('name').eq('id', p.company_id).single()
          if (c) setCompany(c)
        }
      }
    }
    load()
  }, [])

  if (!profile) return null
  const isBuyer = profile.role === 'buyer'
  const isAdmin = profile.role === 'admin'
  if (!isBuyer && !isAdmin) return null

  const firstName = profile.full_name?.split(' ')[0] || 'there'
  const isApproved = profile.status === 'approved' || isAdmin
  const displayCompany = companyDisplayName || company?.name || 'Your Company'
  const initials = (profile.full_name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <section style={{
      padding: '20px 0',
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(135deg, rgba(201,169,110,.04), transparent)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

        {/* ── ROW 1: Greeting + company + shipment bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Logo or initials */}
            {companyLogo ? (
              <img src={companyLogo} alt="logo" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(201,169,110,.3)' }} />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: 8, background: 'var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: 'var(--dark)',
              }}>{initials}</div>
            )}
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#fff', lineHeight: 1.2 }}>
                {greeting}, <em style={{ color: 'var(--gold)' }}>{firstName}</em>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                {displayCompany}
                {' · '}
                {isApproved ? (
                  <span style={{ color: '#66bb6a', fontSize: 10 }}>✓ Approved Trade Account</span>
                ) : (
                  <span style={{ color: '#ffa726', fontSize: 10 }}>⏳ Pending Approval</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              fontSize: 12, padding: '8px 16px', borderRadius: 50,
              background: 'rgba(255,167,38,.06)', border: '1px solid rgba(255,167,38,.15)', color: 'var(--gold)',
            }}>
              🚢 Next shipment closes in{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>12</span>d{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>8</span>h
            </div>
            <Link href="/catalog" style={{
              fontSize: 11, padding: '8px 18px', letterSpacing: '.5px',
              textTransform: 'uppercase' as const, textDecoration: 'none',
              background: 'var(--gold)', color: 'var(--dark)', borderRadius: 4, fontWeight: 600,
            }}>Browse Collection</Link>
          </div>
        </div>

        {/* ── ROW 2: Quick action cards ── */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <Link href="/dashboard" className="card card-glow" style={{ flex: 1, minWidth: 130, padding: 16, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📋</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>My Orders</div>
          </Link>
          <Link href="/quote" className="card card-glow" style={{ flex: 1, minWidth: 130, padding: 16, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🛒</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Quote Basket ({items.length})</div>
          </Link>
          <Link href="/catalog" className="card card-glow" style={{ flex: 1, minWidth: 130, padding: 16, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>❤️</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Saved ({savedCount})</div>
          </Link>
          <Link href="/trade-viewing" className="card card-glow" style={{ flex: 1, minWidth: 130, padding: 16, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📅</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Book Viewing</div>
          </Link>
          <Link href="/sample-service" className="card card-glow" style={{ flex: 1, minWidth: 130, padding: 16, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📦</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Request Samples</div>
          </Link>
          <Link href="/dashboard?tab=team" className="card card-glow" style={{ flex: 1, minWidth: 130, padding: 16, textAlign: 'center', textDecoration: 'none' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🤝</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Account Manager</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Reply within 24h</div>
          </Link>
        </div>

      </div>
    </section>
  )
}
