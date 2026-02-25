'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type Profile = {
  full_name: string | null
  role: string
  status: string
  company_id: string | null
}

type Company = {
  name: string
}

export default function HomeClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase
        .from('profiles')
        .select('full_name, role, status, company_id')
        .eq('id', user.id)
        .single()

      if (p) {
        setProfile(p)
        if (p.company_id) {
          const { data: c } = await supabase
            .from('companies')
            .select('name')
            .eq('id', p.company_id)
            .single()
          if (c) setCompany(c)
        }
      }
    }
    load()
  }, [])

  if (!profile) return null

  const firstName = profile.full_name?.split(' ')[0] || 'there'
  const isApproved = profile.status === 'approved'
  const isAdmin = profile.role === 'admin'

  return (
    <section className="py-5 border-b border-[var(--border)]" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Top row: greeting + shipping countdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-serif text-2xl text-white">
              Welcome back, <em className="text-[var(--gold)]">{firstName}</em>
            </div>
            <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 mt-1">
              {company?.name || 'Your Company'} ·{' '}
              {isApproved || isAdmin ? (
                <span className="sivo-seal-badge">Approved Trade Account</span>
              ) : (
                <span className="sivo-seal-badge" style={{ borderColor: 'rgba(255,167,38,.3)', color: '#ffa726' }}>
                  Pending Approval
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="text-xs px-4 py-2 rounded-full" style={{
              background: 'rgba(201,169,110,.08)',
              border: '1px solid rgba(201,169,110,.2)',
              color: 'var(--gold)'
            }}>
              🚢 Next shipment closes in{' '}
              <span className="font-mono font-semibold">12</span>d{' '}
              <span className="font-mono font-semibold">8</span>h
            </div>
            <Link href="/dashboard" className="btn-gold btn-sm text-xs tracking-wider uppercase">
              View Trade Basket
            </Link>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {[
            { icon: '📋', label: 'My Orders', href: '/dashboard' },
            { icon: '🛒', label: 'Quote Basket', href: '/dashboard' },
            { icon: '❤️', label: 'Saved', href: '/catalog' },
            { icon: '📅', label: 'Book Viewing', href: '/trade-viewing' },
            { icon: '📦', label: 'Request Samples', href: '/trade-viewing' },
            { icon: '🤝', label: 'Account Manager', href: null },
          ].map(item => (
            item.href ? (
              <Link key={item.label} href={item.href}
                    className="card card-glow shimmer card-glow p-4 flex-1 min-w-[140px] text-center cursor-pointer">
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[11px] text-[var(--gold)]">{item.label}</div>
              </Link>
            ) : (
              <div key={item.label} className="card card-glow shimmer card-glow p-4 flex-1 min-w-[140px] text-center">
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-[11px] text-[var(--gold)]">{item.label}</div>
                <div className="text-[9px] text-[var(--muted)]">Reply within 24h</div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  )
}
