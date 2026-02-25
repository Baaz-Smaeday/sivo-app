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
  const [savedCount] = useState(0)
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

  const isBuyer = profile.role === 'buyer'
  const isAdmin = profile.role === 'admin'
  if (!isBuyer && !isAdmin) return null

  const firstName = profile.full_name?.split(' ')[0] || 'there'
  const isApproved = profile.status === 'approved'

  return (
    <section style={{
      padding: '20px 0',
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

        {/* ── ROW 1: Welcome greeting + Shipment countdown ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Left: Welcome + company */}
          <div>
            <div style={{ fontFamily: 'var(--f1, Georgia, serif)', fontSize: 24, color: '#fff' }}>
              Welcome back, <em style={{ color: 'var(--gold)' }}>{firstName}</em>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {company?.name || 'Your Company'} &middot;{' '}
              {isApproved || isAdmin ? (
                <span className="sivo-seal-badge">Approved Trade Account</span>
              ) : (
                <span className="sivo-seal-badge" style={{ borderColor: 'rgba(255,167,38,.3)', color: '#ffa726' }}>
                  Pending Approval
                </span>
              )}
            </div>
          </div>

          {/* Right: Countdown + basket button */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              fontSize: 12,
              padding: '8px 16px',
              borderRadius: 50,
              background: 'rgba(255,167,38,.06)',
              border: '1px solid rgba(255,167,38,.15)',
              color: 'var(--gold)',
            }}>
              🚢 Next shipment closes in{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>12</span>d{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>8</span>h
            </div>
            <Link href="/quote" className="btn-gold" style={{
              fontSize: 11,
              padding: '8px 18px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase' as const,
              textDecoration: 'none',
            }}>
              View Trade Basket
            </Link>
          </div>
        </div>

        {/* ── ROW 2: Quick action cards (6 cards) ── */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 14,
          flexWrap: 'wrap',
        }}>
          {/* My Orders */}
          <Link href="/dashboard" className="card card-glow" style={{
            flex: 1, minWidth: 140, padding: 16, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>📋</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>My Orders</div>
          </Link>

          {/* Quote Basket */}
          <Link href="/quote" className="card card-glow" style={{
            flex: 1, minWidth: 140, padding: 16, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>🛒</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Quote Basket ({items.length})</div>
          </Link>

          {/* Saved */}
          <Link href="/catalog" className="card card-glow" style={{
            flex: 1, minWidth: 140, padding: 16, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>❤️</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Saved ({savedCount})</div>
          </Link>

          {/* Book Viewing */}
          <Link href="/trade-viewing" className="card card-glow" style={{
            flex: 1, minWidth: 140, padding: 16, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>📅</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Book Viewing</div>
          </Link>

          {/* Request Samples */}
          <Link href="/sample-service" className="card card-glow" style={{
            flex: 1, minWidth: 140, padding: 16, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>📦</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Request Samples</div>
          </Link>

          {/* Account Manager (no link) */}
          <div className="card card-glow" style={{
            flex: 1, minWidth: 140, padding: 16, textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>🤝</div>
            <div style={{ fontSize: 11, color: 'var(--gold)' }}>Account Manager</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>Reply within 24h</div>
          </div>
        </div>

      </div>
    </section>
  )
}
