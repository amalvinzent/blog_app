import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req) {
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const response = NextResponse.next()
    response.headers.set('x-user', encodeURIComponent(JSON.stringify(payload)))
    return response
  } catch (err) {
    console.error('JWT verification failed', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/blogs/:path*', '/api/blogs/:path*']
}
