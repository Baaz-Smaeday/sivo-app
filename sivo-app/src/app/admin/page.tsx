import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth?tab=login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'supplier') redirect('/dashboard')

  const { data: applications } = await supabase
    .from('trade_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, company:companies(name)')
    .order('created_at', { ascending: false })

  const { data: viewings } = await supabase
    .from('viewing_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*, profile:profiles(full_name, email), company:companies(name)')
    .order('created_at', { ascending: false })

  const { data: recentLogs } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <AdminClient
      applications={applications || []}
      profiles={profiles || []}
      viewings={viewings || []}
      quotes={quotes || []}
      auditLog={recentLogs || []}
    />
  )
}
