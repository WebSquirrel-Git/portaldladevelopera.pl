import { cookies } from "next/headers"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { username, password } = body || {}

  if (!username || !password) {
    return Response.json({ message: "Brak danych" }, { status: 400 })
  }

  const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return Response.json(data || { message: "Błąd logowania" }, {
      status: res.status,
    })
  }

  const data = await res.json()
  const token = data?.access_token as string | undefined
  if (!token) {
    return Response.json(
      { message: "Brak tokenu w odpowiedzi" },
      { status: 502 }
    )
  }

  // HttpOnly cookie for JWT (Next 15: cookies() jest async)
  const cookieStore = await cookies()
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  })

  return Response.json({ ok: true })
}
