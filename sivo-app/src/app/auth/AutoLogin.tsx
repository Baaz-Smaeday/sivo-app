'use client'

import { useEffect, useState } from 'react'

const ROLES: Record<string, { label: string; icon: string; color: string }> = {
  admin:    { label: 'Admin',    icon: '👑', color: '#c9a96e' },
  buyer:    { label: 'Buyer',    icon: '🛒', color: '#4fc3f7' },
  supplier: { label: 'Supplier', icon: '🏭', color: '#81c784' },
}

export default function AutoLogin({ role }: { role: string }) {
  const [error, setError] = useState('')
  const acc = ROLES[role]

  useEffect(() => {
    if (!acc) { setError('Unknown role'); return }
    // Redirect to server-side login handler
    window.location.href = `/api/demo-login?role=${role}`
  }, [])

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{acc?.icon || '⚡'}</div>
        {!error ? (
          <>
            <div style={{ fontSize: 13, color: acc?.color, fontWeight: 600, marginBottom: 8 }}>
              Signing in as {acc?.label}...
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: acc?.color,
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: '#fca5a5', marginBottom: 12 }}>⚠️ {error}</div>
            <a href="/auth?tab=login" style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'underline' }}>
              ← Back to login
            </a>
          </>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(.8);opacity:.4} 50%{transform:scale(1.2);opacity:1} }`}</style>
    </div>
  )
}
