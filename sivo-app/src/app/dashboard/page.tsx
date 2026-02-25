import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

const DEMO_PROFILES: Record<string, any> = {
  buyer: {
    id: 'demo-buyer',
    full_name: 'James Wilson',
    email: 'buyer@demo.co.uk',
    role: 'buyer',
    status: 'approved',
    company: { name: 'Wilson Interiors Ltd' },
  },
  admin: {
    id: 'demo-admin',
    full_name: 'Navi Singh',
    email: 'admin@sivohome.com',
    role: 'admin',
    status: 'approved',
    company: { name: 'SIVO HQ' },
  },
}

export const revalidate = 0

export default async function DashboardPage() {
  // Check demo cookie first
  const cookieStore = cookies()
  const demoRole = cookieStore.get('sivo-demo-role')?.value

  if (demoRole === 'buyer' || demoRole === 'admin') {
    return (
      <DashboardClient
        profile={DEMO_PROFILES[demoRole]}
        quotes={[]}
        viewings={[]}
      />
    )
  }

  // Real Supabase auth check
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
