import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SupplierDashboard from './SupplierDashboard'

export const revalidate = 0

export default async function SupplierPage() {
  // Check demo cookie first
  const cookieStore = cookies()
  const demoRole = cookieStore.get('sivo-demo-role')?.value

  if (demoRole === 'supplier') {
    return (
      <SupplierDashboard
        products={[]}
        quotes={[]}
        profile={{
          id: 'demo-supplier',
          full_name: 'Raj Patel',
          email: 'supplier@demo.co.uk',
          role: 'supplier',
          company: { name: 'GHP Manufacturing' },
        }}
      />
    )
  }

  // Real Supabase auth check
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth?tab=login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, company:companies(name)')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'supplier' && profile?.role !== 'admin') redirect('/dashboard')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('supplier_id', user.id)
    .order('created_at', { ascending: false })

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*, items:quote_items(*, product:products(name, sku))')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <SupplierDashboard
      products={products || []}
      quotes={quotes || []}
      profile={{ ...profile, email: user.email }}
    />
  )
}
