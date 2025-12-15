import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PATHS = ["/dashboard", "/developers", "/investments", "/units"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get("admin_token")?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/logowanie"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|public).*)"],
}
