import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const CREDS: Record<string, { email: string; password: string; redirect: string }> = {
  admin:    { email: 'admin@sivohome.com',  password: 'admin123',    redirect: '/admin' },
  buyer:    { email: 'buyer@demo.co.uk',    password: 'buyer123',    redirect: '/dashboard' },
  supplier: { email: 'supplier@demo.co.uk', password: 'supplier123', redirect: '/supplier' },
}

export async function GET(request: NextRequest) {
  const role = new URL(request.url).searchParams.get('role') || ''
  const acc = CREDS[role]

  if (!acc) return NextResponse.redirect(new URL('/auth', request.url))

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: acc.email,
    password: acc.password,
  })

  if (error || !data.session) {
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(error?.message || 'Login failed')}`, request.url))
  }

  const response = NextResponse.redirect(new URL(acc.redirect, request.url))

  // Set session cookies directly on the response
  const { access_token, refresh_token } = data.session
  const isSecure = request.url.startsWith('https')

  response.cookies.set('sb-access-token', access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })

  response.cookies.set('sb-refresh-token', refresh_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  // Also set the Supabase auth token cookie (format varies by project)
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('.')[0].split('//')[1]
  response.cookies.set(`sb-${projectRef}-auth-token`, JSON.stringify(data.session), {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 3600,
