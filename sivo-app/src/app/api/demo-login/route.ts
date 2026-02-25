import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const CREDS: Record<string, { email: string; password: string; redirect: string }> = {
  admin:    { email: 'admin@sivohome.com',  password: 'admin123',    redirect: '/admin' },
  buyer:    { email: 'buyer@demo.co.uk',    password: 'buyer123',    redirect: '/dashboard' },
  supplier: { email: 'supplier@demo.co.uk', password: 'supplier123', redirect: '/supplier' },
}

export async function GET(request: NextRequest) {
  const role = new URL(request.url).searchParams.get('role') || ''
  const acc = CREDS[role]

  if (!acc) return NextResponse.redirect(new URL('/auth', request.url))

  const redirectUrl = new URL(acc.redirect, request.url)
  let response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Sign out any existing session first
  await supabase.auth.signOut()

  // Sign in as the demo role
  const { error } = await supabase.auth.signInWithPassword({
    email: acc.email,
    password: acc.password,
  })

  if (error) {
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(error.message)}`, request.url))
  }

  return response
}
