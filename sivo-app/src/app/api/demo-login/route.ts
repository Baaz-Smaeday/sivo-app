import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const DEMO_ROLES: Record<string, string> = {
  'admin@sivohome.com': 'admin',
  'buyer@demo.co.uk': 'buyer',
  'supplier@demo.co.uk': 'supplier',
}

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json()

  const role = DEMO_ROLES[email]
  if (!role) {
    return NextResponse.json({ error: 'Not a demo account' }, { status: 400 })
  }

  // Use service role key to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('profiles')
    .update({ role, status: 'approved' })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ role })
}
