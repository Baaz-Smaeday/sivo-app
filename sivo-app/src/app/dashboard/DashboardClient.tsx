'use client'

import { useState } from 'react'

export default function DashboardClient({
  profile,
  quotes,
  viewings,
}: {
  profile: any
  quotes: any[]
  viewings: any[]
}) {
  const [tab, setTab] = useState<'overview' | 'quotes' | 'viewings'>('overview')

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
      approved: 'bg-green-900/30 text-green-300 border-green-800',
      rejected: 'bg-red-900/30 text-red-300 border-red-800',
      new: 'bg-blue-900/30 text-blue-300 border-blue-800',
      confirmed: 'bg-green-900/30 text-green-300 border-green-800',
      quoted: 'bg-brand-gold/20 text-brand-gold border-brand-gold/40',
    }
    return `inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${colors[status] || 'bg-brand-surface text-brand-muted border-brand-border'}`
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-white mb-1">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <div className="flex items-center gap-3 text-sm text-brand-muted">
          <span>{profile?.company?.name || 'Your Company'}</span>
          <span>·</span>
          <span className={statusBadge(profile?.status || 'pending')}>
            {profile?.status || 'pending'}
          </span>
        </div>
      </div>

      {/* Pending notice */}
      {profile?.status === 'pending' && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg text-sm text-yellow-200">
          ⏳ Your trade account is under review. You&apos;ll receive full access to trade pricing once approved (typically 1–2 working days).
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-brand-border mb-6">
        {(['overview', 'quotes', 'viewings'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold tracking-[1.5px] uppercase border-b-2 transition-colors ${
              tab === t
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-6 text-center">
            <div className="font-serif text-3xl text-brand-gold mb-1">{quotes.length}</div>
            <div className="text-xs text-brand-muted tracking-wider uppercase">Quote Requests</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-serif text-3xl text-brand-gold mb-1">{viewings.length}</div>
            <div className="text-xs text-brand-muted tracking-wider uppercase">Viewings</div>
          </div>
          <div className="card p-6 text-center">
            <div className="font-serif text-3xl text-brand-gold mb-1">
              {profile?.status === 'approved' ? '✓' : '⏳'}
            </div>
            <div className="text-xs text-brand-muted tracking-wider uppercase">Account Status</div>
          </div>
        </div>
      )}

      {/* Quotes */}
      {tab === 'quotes' && (
        <div>
          {quotes.length === 0 ? (
            <div className="text-center py-12 text-brand-muted">
              <p className="text-lg mb-2">No quotes yet</p>
              <p className="text-sm">Browse the collection and request a quote to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((q: any) => (
                <div key={q.id} className="card p-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-white font-medium">{q.ref_id}</div>
                    <div className="text-xs text-brand-muted">{new Date(q.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={statusBadge(q.status)}>{q.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Viewings */}
      {tab === 'viewings' && (
        <div>
          {viewings.length === 0 ? (
            <div className="text-center py-12 text-brand-muted">
              <p className="text-lg mb-2">No viewings yet</p>
              <p className="text-sm">Book a virtual or in-person viewing to see our collections.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {viewings.map((v: any) => (
                <div key={v.id} className="card p-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-white font-medium">{v.ref_id}</div>
                    <div className="text-xs text-brand-muted">
                      {v.type === 'virtual' ? '📹 Virtual' : '🏠 Store Visit'} · {v.preferred_date || 'Flexible'}
                    </div>
                  </div>
                  <span className={statusBadge(v.status)}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
