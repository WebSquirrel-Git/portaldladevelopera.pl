import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set("admin_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })

  return Response.json({ ok: true })
}
