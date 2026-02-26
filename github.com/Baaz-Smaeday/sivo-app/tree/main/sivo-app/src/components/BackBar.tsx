'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const BREADCRUMB_MAP: Record<string, { label: string; parent?: string }> = {
  '/catalog':       { label: 'Collection' },
  '/quote':         { label: 'Quote Basket',    parent: '/catalog' },
  '/dashboard':     { label: 'My Account' },
  '/trade-viewing': { label: 'Trade Viewing' },
  '/how-to-order':  { label: 'How to Order' },
  '/trade-terms':   { label: 'Trade Terms' },
  '/material-guides': { label: 'Material Guides' },
  '/why-sivo':      { label: 'Why SIVO' },
  '/about':         { label: 'About' },
  '/collections':   { label: 'Signature Collections' },
}

interface BackBarProps {
  /** Override the auto-detected label for the current page */
  currentLabel?: string
  /** Override the back destination */
  backHref?: string
  /** Extra crumbs between Home and current — e.g. [{ label:'Collection', href:'/catalog' }] */
  crumbs?: { label: string; href: string }[]
}

export default function BackBar({ currentLabel, backHref, crumbs }: BackBarProps) {
  const router   = useRouter()
  const pathname = usePathname()

  const pageInfo = BREADCRUMB_MAP[pathname] || null
  const label    = currentLabel || pageInfo?.label || ''

  // Build full crumb trail
  const trail: { label: string; href?: string }[] = [{ label: 'Home', href: '/' }]

  if (crumbs) {
    crumbs.forEach(c => trail.push(c))
  } else if (pageInfo?.parent) {
    const parent = BREADCRUMB_MAP[pageInfo.parent]
    if (parent) trail.push({ label: parent.label, href: pageInfo.parent })
  }

  if (label) trail.push({ label })

  const handleBack = () => {
    if (backHref) { router.push(backHref); return }
    if (trail.length >= 2 && trail[trail.length - 2]?.href) {
      router.push(trail[trail.length - 2].href!)
    } else {
      router.back()
    }
  }

  return (
    <div style={{
      position: 'sticky',
      top: 64,
      zIndex: 40,
      background: 'rgba(10,10,18,.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(201,169,110,.12)',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 42,
      }}>
        {/* Back button */}
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(201,169,110,.7)',
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 4,
            transition: 'all .2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,169,110,.7)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.1)' }} />

        {/* Breadcrumb trail */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
          {trail.map((crumb, i) => {
            const isLast = i === trail.length - 1
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                {i > 0 && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 1L6 4L2 7" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
                {isLast ? (
                  <span style={{
                    fontSize: 11,
                    color: '#fff',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 200,
                  }}>{crumb.label}</span>
                ) : (
                  <Link href={crumb.href!} style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,.4)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,169,110,.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}>
                    {crumb.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
