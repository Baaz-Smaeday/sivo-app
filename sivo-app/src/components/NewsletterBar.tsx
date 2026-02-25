'use client'

import { useState } from 'react'

export default function NewsletterBar() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section style={{
      padding: '32px 0',
      background: 'linear-gradient(135deg, rgba(201,169,110,.06), rgba(13,27,42,.8))',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)',
              fontSize: 20, color: '#fff',
            }}>Stay in the loop</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              New collections, container dates, and trade events. No spam.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flex: 1, maxWidth: 400 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.co.uk"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 8,
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(201,169,110,.2)',
                color: '#fff', fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                background: submitted ? '#66bb6a' : 'var(--gold)',
                color: 'var(--dark)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                transition: 'all .2s', whiteSpace: 'nowrap',
              }}
            >
              {submitted ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
