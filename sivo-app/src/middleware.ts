import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Read demo role cookie (set by /api/demo-login)
  const demoRole = request.cookies.get('sivo-demo-role')?.value
  const pathname = request.nextUrl.pathname

  // Protect /admin
  if (pathname.startsWith('/admin')) {
    if (!user && demoRole !== 'admin') {
      return NextResponse.redirect(new URL('/auth?tab=login', request.url))
    }
    if (user && !demoRole) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Protect /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!user && demoRole !== 'buyer' && demoRole !== 'admin') {
      return NextResponse.redirect(new URL('/auth?tab=login', request.url))
    }
  }

  // Protect /supplier
  if (pathname.startsWith('/supplier')) {
    if (!user && demoRole !== 'supplier' && demoRole !== 'admin') {
      return NextResponse.redirect(new URL('/auth?tab=login', request.url))
    }
    if (user && !demoRole) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'supplier' && profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/supplier/:path*'],
}
