import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0/edge"

export async function middleware(request: NextRequest) {
  const session = await getSession(request)
  if (!session?.user && request.nextUrl.pathname.startsWith('/app')) {
    const returnTo = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/api/auth/login?returnTo=${returnTo}`, request.url)
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}