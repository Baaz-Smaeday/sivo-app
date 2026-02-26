'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function QuickContact() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Hide on auth and admin
  if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) return null

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 490 }}>
      {/* Popup card */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 56, right: 0,
          background: 'rgba(14,14,24,.97)',
          border: '1px solid rgba(201,169,110,.3)',
          borderRadius: 12,
          padding: 20,
          width: 240,
          boxShadow: '0 8px 40px rgba(0,0,0,.6)',
          backdropFilter: 'blur(20px)',
          animation: 'floatUp .25s ease',
        }}>
          <style>{`@keyframes floatUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
          <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 12 }}>Get in Touch</div>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 2 }}>Navi Singh</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', marginBottom: 14 }}>Your dedicated account manager</div>

          {[
            { icon: '📧', label: 'Email', value: 'trade@sivohome.com', href: 'mailto:trade@sivohome.com' },
            { icon: '📞', label: 'Call', value: '+44 7346 325580', href: 'tel:+447346325580' },
            { icon: '💬', label: 'WhatsApp', value: 'Chat now', href: 'https://wa.me/447346325580?text=Hi Navi, I am interested in SIVO trade furniture.' },
          ].map(c => (
            <a key={c.label} href={c.href} target={c.label === 'WhatsApp' ? '_blank' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6, marginBottom: 6,
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.06)',
                textDecoration: 'none', color: '#fff',
                fontSize: 12, transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}
            >
              <span style={{ fontSize: 14 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: '#fff' }}>{c.value}</div>
              </div>
            </a>
          ))}

          <div style={{ marginTop: 10, fontSize: 9, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
            ● Reply within 24h on business days
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: open ? 'rgba(201,169,110,.2)' : 'linear-gradient(135deg, #c9a96e, #b8965a)',
          border: open ? '1px solid rgba(201,169,110,.5)' : 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? 'none' : '0 4px 20px rgba(201,169,110,.4)',
          transition: 'all .25s',
          fontSize: 18,
          color: open ? '#c9a96e' : '#0a0a12',
        }}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
