'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

type Profile = {
  full_name: string | null
  role: string
  status: string
}

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role, status')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  const roleLabel = profile?.role === 'admin' ? 'ADMIN' : profile?.status === 'approved' ? 'TRADE' : 'PENDING'
  const roleColor = profile?.role === 'admin' ? 'text-red-400' : profile?.status === 'approved' ? 'text-green-400' : 'text-yellow-400'

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-gold rounded flex items-center justify-center">
            <span className="text-brand-bg font-serif font-bold text-lg">S</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-sans font-bold text-sm tracking-[3px]">SIVO</div>
            <div className="text-[8px] tracking-[1.5px] text-brand-muted uppercase">Premium UK Trade Furniture</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/catalog" className="text-xs tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors">
            Collection
          </Link>
          <Link href="/about" className="text-xs tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors">
            Why SIVO
          </Link>
          <Link href="/how-to-order" className="text-xs tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors">
            How to Order
          </Link>
          <Link href="/trade-terms" className="text-xs tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors">
            Trade Terms
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-xs tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors hidden sm:block">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-xs tracking-wider uppercase text-brand-muted hover:text-brand-gold transition-colors hidden sm:block">
                Dashboard
              </Link>
              <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-full py-1.5 px-3 cursor-pointer"
                   onClick={() => setMenuOpen(!menuOpen)}>
                <div className="w-7 h-7 rounded-full bg-brand-gold flex items-center justify-center text-brand-bg text-xs font-bold">
                  {initials}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs text-white font-medium leading-tight">{profile?.full_name || 'Account'}</div>
                  <div className={`text-[9px] font-bold tracking-wider ${roleColor}`}>{roleLabel}</div>
                </div>
              </div>
              {menuOpen && (
                <div className="absolute top-14 right-4 bg-brand-card border border-brand-border rounded-lg shadow-xl py-2 min-w-[180px]">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-brand-text hover:bg-brand-surface" onClick={() => setMenuOpen(false)}>
                    My Dashboard
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-brand-text hover:bg-brand-surface" onClick={() => setMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <hr className="border-brand-border my-1" />
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-brand-surface">
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/auth?tab=login" className="btn-outline text-xs py-2 px-4">
                Login
              </Link>
              <Link href="/auth?tab=register" className="btn-gold text-xs py-2 px-4">
                Apply for Trade
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="lg:hidden text-brand-muted" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
