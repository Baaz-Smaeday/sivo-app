import { NextResponse, type NextRequest } from 'next/server'

const ROLES: Record<string, string> = {
  admin:    '/admin',
  buyer:    '/dashboard',
  supplier: '/supplier',
}

export async function GET(request: NextRequest) {
  const role = new URL(request.url).searchParams.get('role') || ''

  if (!ROLES[role]) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  const response = NextResponse.redirect(new URL(ROLES[role], request.url))

  // Set a simple demo-role cookie the middleware can read
  response.cookies.set('sivo-demo-role', role, {
    httpOnly: false,
    secure: request.url.startsWith('https'),
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return response
}
