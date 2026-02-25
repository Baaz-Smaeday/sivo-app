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

type DemoUser = {
  name: string
  role: string
  status: string
  redirect: string
}

const DEMO_USERS: Record<string, DemoUser> = {
  admin:    { name: 'Navi Singh',   role: 'admin',    status: 'approved', redirect: '/admin' },
  buyer:    { name: 'James Wilson', role: 'buyer',    status: 'approved', redirect: '/dashboard' },
  supplier: { name: 'Raj Patel',    role: 'supplier', status: 'approved', redirect: '/supplier' },
}

const NAV_LINKS = [
  { id: '/', label: 'Home' },
  { id: '/catalog', label: 'Collection' },
  { id: '/collections', label: 'Signature Collections' },
  { id: 'https://heyzine.com/flip-book/a486532728.html', label: '📖 Digital Catalogue', external: true },
  { id: '/material-guides', label: 'Material Guides' },
  { id: '/trade-viewing', label: 'Trade Viewing' },
  { id: '/why-sivo', label: 'Why SIVO' },
  { id: '/how-to-order', label: 'How to Order' },
  { id: '/trade-terms', label: 'Trade Terms' },
  { id: '/about', label: 'About' },
]

const DEMO_LOGINS = [
  { role: 'admin',    icon: '👑', label: 'Admin',    sub: 'Navi Singh · SIVO',              color: '#c9a96e', href: '/api/demo-login?role=admin' },
  { role: 'buyer',    icon: '🛒', label: 'Buyer',    sub: 'James Wilson · Wilson Interiors', color: '#4fc3f7', href: '/api/demo-login?role=buyer' },
  { role: 'supplier', icon: '🏭', label: 'Supplier', sub: 'Raj Patel · GHP Mfg',            color: '#81c784', href: '/api/demo-login?role=supplier' },
]

function getDemoCookie(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/sivo-demo-role=([^;]+)/)
  return match ? match[1] : ''
}

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [demoRole, setDemoRole] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { items, totalItems, setIsOpen: setBasketOpen } = useBasket()

  useEffect(() => {
    const role = getDemoCookie()
    if (role) setDemoRole(role)

    const fetchProfile = async (userId: string, retries = 4): Promise<void> => {
      const { data } = await supabase.from('profiles').select('full_name, role, status').eq('id', userId).single()
      if (data) { setProfile(data) } else if (retries > 0) {
        await new Promise(r => setTimeout(r, 500))
        return fetchProfile(userId, retries - 1)
      }
    }

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { setUser(user); await fetchProfile(user.id) }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user.id) }
      else { setUser(null); setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = () => { setDropdownOpen(false); setLoginDropdownOpen(false); setMobileOpen(false) }
    if (dropdownOpen || loginDropdownOpen || mobileOpen) {
      setTimeout(() => document.addEventListener('click', handleClick), 0)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [dropdownOpen, loginDropdownOpen, mobileOpen])

  const handleSignOut = async () => {
    document.cookie = 'sivo-demo-role=; max-age=0; path=/'
    setDemoRole('')
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setDropdownOpen(false)
    window.location.href = '/'
  }

  const demo = demoRole ? DEMO_USERS[demoRole] : null
  const isLoggedIn = !!(user || demo)
  const displayRole = demo?.role || profile?.role || ''
  const displayName = demo?.name || profile?.full_name || 'Account'
  const displayStatus = demo?.status || profile?.status || ''
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const roleLabel = displayRole === 'admin' ? 'ADMIN' : displayRole === 'supplier' ? 'SUPPLIER' : displayStatus === 'approved' ? 'TRADE' : 'PENDING'
  const roleColor = displayRole === 'admin' ? 'text-[#c9a96e]' : displayRole === 'supplier' ? 'text-emerald-400' : displayStatus === 'approved' ? 'text-emerald-400' : 'text-yellow-400'

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
              <a key={link.id} href={link.id} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: 'var(--gold)' }}>
                {link.label}
              </a>
            ) : (
              <Link key={link.id} href={link.id} className={`nav-link ${pathname === link.id ? 'active' : ''}`}>
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

          {isLoggedIn ? (
            /* ── LOGGED IN ── */
            <div className="relative">
              <div
                className="flex items-center gap-2 py-1.5 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] cursor-pointer transition-all hover:border-[var(--gold)]"
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
                <div
                  className="absolute top-full right-0 mt-2 min-w-[180px] bg-[var(--card)] border border-[var(--border)] rounded-[var(--r)] shadow-[0_12px_40px_rgba(0,0,0,.5)] z-[100] animate-fade-up"
                  onClick={(e) => e.stopPropagation()}>

                  {/* Admin only sees Admin Dashboard */}
                  {displayRole === 'admin' && (
                    <Link href="/admin"
                      className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                      onClick={() => setDropdownOpen(false)}>
                      📊 Admin Dashboard
                    </Link>
                  )}

                  {/* Supplier only sees Supplier Dashboard */}
                  {displayRole === 'supplier' && (
                    <Link href="/supplier"
                      className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                      onClick={() => setDropdownOpen(false)}>
                      🏭 Supplier Dashboard
                    </Link>
                  )}

                  {/* Buyer only sees buyer menu items */}
                  {displayRole === 'buyer' && (
                    <>
                      <Link href="/dashboard"
                        className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                        onClick={() => setDropdownOpen(false)}>
                        📦 My Orders
                      </Link>
                      <Link href="/dashboard?tab=viewings"
                        className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                        onClick={() => setDropdownOpen(false)}>
                        📅 My Viewings
                      </Link>
                      <Link href="/dashboard?tab=team"
                        className="block px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all"
                        onClick={() => setDropdownOpen(false)}>
                        👥 Company &amp; Team
                      </Link>
                    </>
                  )}

                  <hr className="border-[var(--border)]" />
                  <button onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2.5 text-[11px] text-[var(--txt)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-all">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── LOGGED OUT: Demo login dropdown ── */
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setLoginDropdownOpen(!loginDropdownOpen) }}
                className="flex items-center gap-2 py-1.5 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] transition-all hover:border-[var(--gold)]">
                <div style={{ fontSize: 9, letterSpacing: '1px', color: 'var(--gold)' }}>⚡</div>
                <div className="hidden sm:block">
                  <div className="text-[10px] tracking-[1px] text-white">Demo Login</div>
                  <div className="text-[8px] tracking-[1px] uppercase text-[var(--gold)]">Choose Role ▾</div>
                </div>
              </button>

              {loginDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-[220px] bg-[var(--card)] border border-[var(--border)] rounded-[var(--r)] shadow-[0_12px_40px_rgba(0,0,0,.6)] z-[100] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}>
                  <div style={{ padding: '10px 14px 6px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                    ⚡ Quick Demo Login
                  </div>
                  {DEMO_LOGINS.map(acc => (
                    <a key={acc.role} href={acc.href}
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface)] transition-all">
                      <span style={{ fontSize: 20 }}>{acc.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: acc.color }}>{acc.label}</div>
                        <div style={{ fontSize: 9, color: 'var(--muted)' }}>{acc.sub}</div>
                      </div>
                    </a>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', padding: '8px 14px' }}>
                    <Link href="/auth?tab=login"
                      onClick={() => setLoginDropdownOpen(false)}
                      style={{ fontSize: 10, color: 'var(--muted)', display: 'block', textAlign: 'center' }}
                      className="hover:text-white transition-colors">
                      Sign in with your own account →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="xl:hidden text-[var(--muted)] ml-1"
            onClick={(e) => { e.stopPropagation(); setMobileOpen(!mobileOpen) }}>
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
            {!isLoggedIn && (
              <div className="pt-2 space-y-1">
                <div style={{ fontSize: 8, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', paddingBottom: 6 }}>⚡ Demo Login</div>
                {DEMO_LOGINS.map(acc => (
                  <a key={acc.role} href={acc.href}
                    className="flex items-center gap-2 py-2 hover:text-white transition-colors"
                    onClick={() => setMobileOpen(false)}>
                    <span>{acc.icon}</span>
                    <span style={{ fontSize: 11, color: acc.color }}>{acc.label}</span>
                    <span style={{ fontSize: 9, color: 'var(--muted)' }}>— {acc.sub}</span>
                  </a>
                ))}
                <Link href="/auth?tab=register" className="btn-gold btn-sm block text-center mt-2"
                  onClick={() => setMobileOpen(false)}>
                  Apply for Trade Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
