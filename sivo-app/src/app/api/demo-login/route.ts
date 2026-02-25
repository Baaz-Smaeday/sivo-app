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

  // Create the redirect response first
  const response = NextResponse.redirect(new URL(acc.redirect, request.url))

  // Clear ALL existing Supabase session cookies on the response
  request.cookies.getAll().forEach(cookie => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, '', { maxAge: 0, path: '/' })
    }
  })

  // Create Supabase client — cookies will be set directly on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: () => undefined, // Don't read existing session
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: acc.email,
    password: acc.password,
  })

  if (error || !data.session) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error?.message || 'Login failed')}`, request.url)
    )
  }

  return response
}
