import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth?tab=login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*, company:companies(*)')
    .eq('id', user.id)
    .single()

  const profile = profileData ? { ...profileData, email: user.email } : null

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*, items:quote_items(*, product:products(name, sku))')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  const { data: viewings } = await supabase
    .from('viewing_requests')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false })

  return (
    <DashboardClient
      profile={profile}
      quotes={quotes || []}
      viewings={viewings || []}
    />
  )
}
