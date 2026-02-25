'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

const CREDENTIALS: Record<string, { email: string; pass: string; redirect: string; label: string; icon: string; color: string }> = {
  admin:    { email: 'admin@sivohome.com',  pass: 'admin123',    redirect: '/admin',     label: 'Admin',    icon: '👑', color: '#c9a96e' },
  buyer:    { email: 'buyer@demo.co.uk',    pass: 'buyer123',    redirect: '/dashboard', label: 'Buyer',    icon: '🛒', color: '#4fc3f7' },
  supplier: { email: 'supplier@demo.co.uk', pass: 'supplier123', redirect: '/supplier' ,     label: 'Supplier', icon: '🏭', color: '#81c784' },
}

export default function AutoLogin({ role }: { role: string }) {
  const supabase = createClient()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const acc = CREDENTIALS[role]

  useEffect(() => {
    if (!acc) { setStatus('error'); setErrorMsg('Unknown role'); return }
    const run = async () => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: acc.email, password: acc.pass })
        if (error) throw error
        // Wait for session cookie to propagate, then hard redirect
        await new Promise(r => setTimeout(r, 800))
        window.location.href = acc.redirect
      } catch (err: any) {
        setStatus('error')
        setErrorMsg(err.message || 'Login failed')
      }
    }
    run()
  }, [])

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{acc?.icon || '⚡'}</div>
        {status === 'loading' ? (
          <>
            <div style={{ fontSize: 13, color: acc?.color, fontWeight: 600, marginBottom: 8 }}>Signing in as {acc?.label}...</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{acc?.email}</div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: acc?.color, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.7 }} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: '#fca5a5', marginBottom: 12 }}>⚠️ {errorMsg}</div>
            <a href="/auth?tab=login" style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'underline' }}>← Back to login</a>
          </>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(.8);opacity:.4} 50%{transform:scale(1.2);opacity:1} }`}</style>
    </div>
  )
}
