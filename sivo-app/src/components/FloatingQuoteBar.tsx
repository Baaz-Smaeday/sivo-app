'use client'

import { useBasket } from '@/lib/basket'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FloatingQuoteBar() {
  const { items, totalItems, totalPrice, setIsOpen } = useBasket()
  const pathname = usePathname()
  const router   = useRouter()
  const [dismissed, setDismissed] = useState(false)

  // Don't show on quote page, auth pages, admin, or if dismissed or empty
  const hide = !items.length || dismissed ||
    pathname === '/quote' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/admin') ||
    pathname === '/'

  if (hide) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      background: 'rgba(14,14,24,.96)',
      border: '1px solid rgba(201,169,110,.4)',
      borderRadius: 50,
      boxShadow: '0 8px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(201,169,110,.1)',
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      animation: 'floatIn .35s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>

      {/* Item previews */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 6px 8px 14px', gap: 6 }}>
        {/* Stacked mini images */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {items.slice(0, 3).map((item, i) => (
            <div key={item.productId} style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '2px solid rgba(14,14,24,1)',
              background: 'var(--surface)',
              overflow: 'hidden',
              marginLeft: i > 0 ? -8 : 0,
              flexShrink: 0,
            }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🪑</div>
              }
            </div>
          ))}
          {items.length > 3 && (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '2px solid rgba(14,14,24,1)',
              background: 'rgba(201,169,110,.15)',
              marginLeft: -8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: '#c9a96e', fontWeight: 700,
            }}>+{items.length - 3}</div>
          )}
        </div>

        {/* Summary */}
        <div style={{ marginLeft: 6 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>
            {totalItems} {totalItems === 1 ? 'unit' : 'units'} · {items.length} {items.length === 1 ? 'product' : 'products'}
          </div>
          <div style={{ fontSize: 13, color: '#c9a96e', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
            £{totalPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push('/quote')}
        style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #c9a96e, #b8965a)',
          border: 'none',
          cursor: 'pointer',
          color: '#0a0a12',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'opacity .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Review Quote
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          width: 36, height: '100%', minHeight: 48,
          background: 'none', border: 'none',
          cursor: 'pointer', color: 'rgba(255,255,255,.3)',
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color .2s',
          paddingRight: 4,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.3)')}
      >
        ✕
      </button>
    </div>
  )
}
