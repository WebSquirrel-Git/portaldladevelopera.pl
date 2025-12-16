import { cookies } from "next/headers"

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const [countsRes, recentRes] = await Promise.all([
    fetch(`${baseUrl}/admin/stats/counts`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      cache: "no-store",
    }),
    fetch(`${baseUrl}/admin/stats/recent`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      cache: "no-store",
    }),
  ])
  const counts = await countsRes.json().catch(() => ({}))
  const recent = await recentRes.json().catch(() => [])
  return Response.json(
    { counts, recent },
    { status: countsRes.ok ? 200 : countsRes.status }
  )
}
