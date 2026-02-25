'use client'

import Link from 'next/link'

export default function BuyerPortalGreeting({ profile, quoteCount, savedCount }: {
  profile: any
  quoteCount: number
  savedCount?: number
}) {
  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const companyName = profile?.company?.name || profile?.company_name || 'Your Company'
  const isApproved = profile?.status === 'approved' || profile?.role === 'admin'

  const quickCards = [
    { icon: '📋', label: 'My Orders', href: '/dashboard?tab=orders', desc: 'Track & manage' },
    { icon: '🛒', label: `Quote Basket (${quoteCount})`, href: '/catalog', desc: 'Build your order' },
    { icon: '❤️', label: `Saved (${savedCount ?? 0})`, href: '/catalog', desc: 'Your shortlist' },
    { icon: '📅', label: 'Book Viewing', href: '/trade-viewing', desc: 'Showroom & factory' },
    { icon: '📦', label: 'Request Samples', href: '/sample-service', desc: 'UK-held samples' },
    { icon: '🤝', label: 'Account Manager', href: '/dashboard?tab=team', desc: 'Reply within 24h' },
  ]

  return (
    <section style={{
      padding: '20px 0',
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(135deg, rgba(201,169,110,.03), transparent)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* Top row: greeting + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: 26, color: '#fff' }}>
              Welcome back, <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{firstName}</em>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{companyName}</span>
              <span style={{ color: 'var(--border)' }}>·</span>
              {isApproved ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
                  background: 'rgba(201,169,110,.06)', border: '1px solid rgba(201,169,110,.2)',
                  borderRadius: 50, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                  Approved Trade Account
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
                  background: 'rgba(255,167,38,.06)', border: '1px solid rgba(255,167,38,.2)',
                  borderRadius: 50, fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#ffa726',
                }}>
                  ⏳ Pending Approval
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Container shipment countdown */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              background: 'rgba(255,167,38,.06)', border: '1px solid rgba(255,167,38,.15)',
              borderRadius: 6, fontSize: 11, color: '#ffa726',
            }}>
              🚢 Next shipment closes in&nbsp;<strong style={{ color: '#fff' }}>12d</strong>&nbsp;<strong style={{ color: '#fff' }}>8h</strong>
            </div>
            <Link href="/catalog" style={{
              padding: '9px 20px', background: 'var(--gold)', color: 'var(--dark)',
              borderRadius: 4, fontSize: 11, fontWeight: 600, textDecoration: 'none',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              View Trade Basket
            </Link>
          </div>
        </div>

        {/* Quick action cards */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {quickCards.map(card => (
            <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                flex: '1', minWidth: 130,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all .25s',
                position: 'relative',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(201,169,110,.4)'
                  el.style.transform = 'translateY(-3px)'
                  el.style.boxShadow = '0 8px 24px rgba(0,0,0,.3), 0 0 16px rgba(201,169,110,.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--border)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{card.icon}</div>
                <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 500, letterSpacing: '0.3px' }}>{card.label}</div>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.3px' }}>{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
