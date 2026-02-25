'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function AdminClient({
  applications,
  profiles,
  viewings,
  quotes,
  auditLog,
}: {
  applications: any[]
  profiles: any[]
  viewings: any[]
  quotes: any[]
  auditLog: any[]
}) {
  const [tab, setTab] = useState<'applications' | 'users' | 'viewings' | 'quotes' | 'audit'>('applications')
  const supabase = createClient()
  const router = useRouter()

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
      approved: 'bg-green-900/30 text-green-300 border-green-800',
      rejected: 'bg-red-900/30 text-red-300 border-red-800',
      new: 'bg-blue-900/30 text-blue-300 border-blue-800',
      assigned: 'bg-purple-900/30 text-purple-300 border-purple-800',
      confirmed: 'bg-green-900/30 text-green-300 border-green-800',
      completed: 'bg-green-900/30 text-green-300 border-green-800',
    }
    return `inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${colors[status] || 'bg-brand-surface text-brand-muted border-brand-border'}`
  }

  const approveApplication = async (appId: string, email: string) => {
    // Update application
    await supabase.from('trade_applications').update({ status: 'approved' }).eq('id', appId)
    // Find and approve user profile
    const matchingProfile = profiles.find(p => p.email === email)
    if (matchingProfile) {
      await supabase.from('profiles').update({ status: 'approved' }).eq('id', matchingProfile.id)
    }
    // Audit
    await supabase.from('audit_log').insert({
      action: 'APPROVE_BUYER',
      actor: 'admin',
      target_type: 'trade_application',
      target_id: appId,
      details: { email },
    })
    router.refresh()
  }

  const rejectApplication = async (appId: string, email: string) => {
    await supabase.from('trade_applications').update({ status: 'rejected' }).eq('id', appId)
    const matchingProfile = profiles.find(p => p.email === email)
    if (matchingProfile) {
      await supabase.from('profiles').update({ status: 'rejected' }).eq('id', matchingProfile.id)
    }
    await supabase.from('audit_log').insert({
      action: 'REJECT_BUYER',
      actor: 'admin',
      target_type: 'trade_application',
      target_id: appId,
      details: { email },
    })
    router.refresh()
  }

  const updateViewingStatus = async (id: string, status: string) => {
    await supabase.from('viewing_requests').update({ status }).eq('id', id)
    await supabase.from('audit_log').insert({
      action: 'VIEWING_STATUS',
      actor: 'admin',
      target_type: 'viewing_request',
      target_id: id,
      details: { status },
    })
    router.refresh()
  }

  const pendingApps = applications.filter(a => a.status === 'pending').length
  const pendingViewings = viewings.filter(v => v.status === 'new').length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-[10px] font-semibold tracking-[3px] uppercase text-brand-gold mb-2">Admin Panel</div>
        <h1 className="font-serif text-3xl text-white">SIVO Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="font-serif text-2xl text-brand-gold">{applications.length}</div>
          <div className="text-[10px] text-brand-muted tracking-wider uppercase">Applications</div>
        </div>
        <div className="card p-4 text-center">
          <div className="font-serif text-2xl text-brand-gold">{profiles.length}</div>
          <div className="text-[10px] text-brand-muted tracking-wider uppercase">Users</div>
        </div>
        <div className="card p-4 text-center">
          <div className="font-serif text-2xl text-brand-gold">{viewings.length}</div>
          <div className="text-[10px] text-brand-muted tracking-wider uppercase">Viewings</div>
        </div>
        <div className="card p-4 text-center">
          <div className="font-serif text-2xl text-brand-gold">{quotes.length}</div>
          <div className="text-[10px] text-brand-muted tracking-wider uppercase">Quotes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-brand-border mb-6 overflow-x-auto">
        {[
          { key: 'applications', label: `Applications${pendingApps ? ` (${pendingApps})` : ''}` },
          { key: 'users', label: 'Users' },
          { key: 'viewings', label: `Viewings${pendingViewings ? ` (${pendingViewings})` : ''}` },
          { key: 'quotes', label: 'Quotes' },
          { key: 'audit', label: 'Audit Log' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-3 text-xs font-semibold tracking-[1px] uppercase whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Applications Tab */}
      {tab === 'applications' && (
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-brand-muted text-center py-8">No applications yet.</p>
          ) : applications.map(app => (
            <div key={app.id} className="card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-white font-medium">{app.full_name}</div>
                  <div className="text-xs text-brand-muted">{app.company_name} · {app.business_type} · {app.email}</div>
                  <div className="text-xs text-brand-muted mt-1">
                    {app.annual_spend && `Spend: ${app.annual_spend}`}
                    {app.vat_number && ` · VAT: ${app.vat_number}`}
                    {app.website && ` · ${app.website}`}
                  </div>
                  <div className="text-[10px] text-brand-muted mt-1">{new Date(app.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusBadge(app.status)}>{app.status}</span>
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveApplication(app.id, app.email)}
                        className="px-3 py-1.5 bg-green-800 text-green-200 text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectApplication(app.id, app.email)}
                        className="px-3 py-1.5 bg-red-900 text-red-300 text-xs rounded hover:bg-red-800 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-3">
          {profiles.map(p => (
            <div key={p.id} className="card p-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-white font-medium">{p.full_name || p.email}</div>
                <div className="text-xs text-brand-muted">{p.email} · {p.company?.name || 'No company'}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold tracking-wider uppercase ${p.role === 'admin' ? 'text-red-400' : 'text-brand-muted'}`}>
                  {p.role}
                </span>
                <span className={statusBadge(p.status)}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewings Tab */}
      {tab === 'viewings' && (
        <div className="space-y-3">
          {viewings.length === 0 ? (
            <p className="text-brand-muted text-center py-8">No viewing requests yet.</p>
          ) : viewings.map(v => (
            <div key={v.id} className="card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-white font-medium">{v.ref_id} · {v.contact_name}</div>
                  <div className="text-xs text-brand-muted">
                    {v.type === 'virtual' ? '📹 Virtual' : '🏠 Visit'} · {v.email} · {v.preferred_date || 'Flexible'}
                  </div>
                  {v.company_name && <div className="text-xs text-brand-muted">{v.company_name}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={statusBadge(v.status)}>{v.status}</span>
                  {v.status === 'new' && (
                    <select
                      className="select-field text-xs py-1 px-2 w-auto"
                      onChange={(e) => updateViewingStatus(v.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Update...</option>
                      <option value="assigned">Assigned</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quotes Tab */}
      {tab === 'quotes' && (
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <p className="text-brand-muted text-center py-8">No quote requests yet.</p>
          ) : quotes.map(q => (
            <div key={q.id} className="card p-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-white font-medium">{q.ref_id}</div>
                <div className="text-xs text-brand-muted">
                  {q.profile?.full_name} · {q.company?.name} · {new Date(q.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className={statusBadge(q.status)}>{q.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Audit Log Tab */}
      {tab === 'audit' && (
        <div className="space-y-2">
          {auditLog.map(log => (
            <div key={log.id} className="card p-3 flex justify-between items-center">
              <div>
                <span className="text-xs text-brand-gold font-mono">{log.action}</span>
                <span className="text-xs text-brand-muted ml-2">by {log.actor}</span>
              </div>
              <div className="text-[10px] text-brand-muted">{new Date(log.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
