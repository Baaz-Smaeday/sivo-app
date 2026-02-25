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

export default function HomeClient() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const supabase = createClient()
  const { items } = useBasket()

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

  const actions = [
    { icon: '📋', label: 'My Orders', href: '/dashboard' },
    { icon: '🛒', label: `Quote Basket (${items.length})`, href: '/quote' },
    { icon: '❤️', label: 'Saved (0)', href: '/catalog' },
    { icon: '📅', label: 'Book Viewing', href: '/trade-viewing' },
    { icon: '📦', label: 'Request Samples', href: '/sample-service' },
    { icon: '🤝', label: 'Account Manager', href: null, sub: 'Reply within 24h' },
  ]

  return (
    <section style={{
      padding: '16px 0',
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px' }}>
        {/* Quick action cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 10,
          overflowX: 'auto',
        }}>
          {actions.map(item => (
            item.href ? (
              <Link key={item.label} href={item.href} className="card card-glow shimmer"
                style={{
                  padding: '16px 12px', textAlign: 'center', textDecoration: 'none',
                  display: 'block', minWidth: 130,
                }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: 'var(--txt, #e0e0e0)', fontWeight: 500 }}>{item.label}</div>
              </Link>
            ) : (
              <div key={item.label} className="card card-glow shimmer"
                style={{ padding: '16px 12px', textAlign: 'center', minWidth: 130 }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: 'var(--txt, #e0e0e0)', fontWeight: 500 }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{item.sub}</div>}
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  )
}
