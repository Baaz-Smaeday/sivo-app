'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useBasket } from '@/lib/basket'

type Profile = {
  full_name: string | null
  role: string
  status: string
}

const NAV_LINKS = [
  { id: '/', label: 'Home' },
  { id: '/catalog', label: 'Collection' },
  { id: '/collections', label: 'Signature Collections' },
  { id: 'https://heyzine.com/flip-book/a486532728.html', label: '📖 Digital Catalogue', external: true },
  { id: '/material-guides', label: 'Material Guides' },
  { id: '/trade-viewing', label: 'Trade Viewing' },
  { id: '/about', label: 'Why SIVO' },
  { id: '/how-to-order', label: 'How to Order' },
  { id: '/trade-terms', label: 'Trade Terms' },
  { id: '/about', label: 'About' },
]

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { items, totalItems, setIsOpen: setBasketOpen } = useBasket()

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
        getUser()
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = () => { setDropdownOpen(false); setMobileOpen(false) }
    if (dropdownOpen || mobileOpen) {
      setTimeout(() => document.addEventListener('click', handleClick), 0)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [dropdownOpen, mobileOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  const displayName = profile?.full_name || 'Account'
  const roleLabel = profile?.role === 'admin' ? 'ADMIN' : profile?.status === 'approved' ? 'TRADE' : 'PENDING'
  const roleColor = profile?.role === 'admin' ? 'text-red-400' : profile?.status === 'approved' ? 'text-emerald-400' : 'text-yellow-400'

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] py-3.5 transition-all duration-300 ${
      scrolled ? 'border-b border-[rgba(201,169,110,.12)]' : 'border-b border-transparent'
    }`} style={{ background: 'rgba(11,11,14,.6)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[var(--gold)] rounded flex items-center justify-center">
            <span className="text-[var(--dark)] font-serif font-bold text-lg">S</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-sans font-bold text-sm tracking-[3px]">SIVO</div>
            <div className="text-[8px] tracking-[1.5px] text-[var(--muted)] uppercase">Premium UK Trade Furniture</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-5">
          {NAV_LINKS.map(link => (
            link.external ? (
              <a key={link.id} href={link.id} target="_blank" rel="noopener noreferrer"
                 className="nav-link" style={{ color: 'var(--gold)' }}>
                {link.label}
              </a>
            ) : (
              <Link key={link.id} href={link.id}
                    className={`nav-link ${pathname === link.id ? 'active' : ''}`}>
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quote Basket */}
          <button onClick={() => setBasketOpen(true)}
                  className="flex items-center gap-1.5 py-1.5 px-3 border border-[var(--border)] rounded transition-all hover:border-[var(--gold)] relative">
            <span className="text-[15px]">🛒</span>
            <span className="text-[9px] tracking-[1px] uppercase text-[var(--muted)] hidden sm:inline">Quote</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--gold)] text-[var(--dark)] text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : items.length}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <div className="flex items-center gap-2 py-1.5 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] cursor-pointer transition-all hover:border-[var(--gold)]"
                   onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen) }}>
                <div className="w-[26px] h-[26px] rounded-full bg-[var(--gold)] text-[var(--dark)] flex items-center justify-center text-[10px] font-semibold">
                  {initials}
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] tracking-[1px] text-white leading-tight">{displayName}</div>
                  <div className={`text-[8px] tracking-[1px] uppercase ${roleColor}`}>{roleLabel}</div>
                </div>
              </div>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[180px] bg-[var(--card)] border border-[var(--border)] rounded-[var(--r)] shadow-[0_12px_40px_rgba(0,0,0,.5)] z-[100] animate-fade-up"
                     onClick={(e) => e.stopPropagation()}>
                  {profile?.role === 'admin' && (
                    <>
                      <Link href="/admin" className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                            onClick={() => setDropdownOpen(false)}>
                        📊 Admin Dashboard
                      </Link>
                    </>
                  )}
                  <Link href="/dashboard" className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                        onClick={() => setDropdownOpen(false)}>
                    📋 My Dashboard
                  </Link>
                  <hr className="border-[var(--border)]" />
                  <button onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth?tab=login"
                  className="flex items-center gap-2 py-1.5 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] transition-all hover:border-[var(--gold)]">
              <div className="w-[26px] h-[26px] rounded-full bg-[var(--navy)] border border-[var(--gold)] flex items-center justify-center text-[10px] text-[var(--gold)]">👤</div>
              <div className="hidden sm:block">
                <div className="text-[10px] tracking-[1px] text-white">Trade Login</div>
                <div className="text-[8px] tracking-[1px] uppercase text-[var(--gold)]">Apply Now</div>
              </div>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button className="xl:hidden text-[var(--muted)] ml-1" onClick={(e) => { e.stopPropagation(); setMobileOpen(!mobileOpen) }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-[var(--card)] border-b border-[var(--border)] shadow-xl animate-fade-up"
             onClick={(e) => e.stopPropagation()}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              link.external ? (
                <a key={link.id} href={link.id} target="_blank" rel="noopener noreferrer"
                   className="block py-2.5 text-[11px] tracking-wider uppercase text-[var(--gold)]"
                   onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.id} href={link.id}
                      className={`block py-2.5 text-[11px] tracking-wider uppercase ${pathname === link.id ? 'text-[var(--gold)]' : 'text-[var(--muted)]'} hover:text-[var(--gold)] transition-colors`}
                      onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              )
            ))}
            <hr className="border-[var(--border)]" />
            {!user && (
              <div className="flex gap-3 pt-2">
                <Link href="/auth?tab=login" className="btn-outline btn-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/auth?tab=register" className="btn-gold btn-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Apply</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
