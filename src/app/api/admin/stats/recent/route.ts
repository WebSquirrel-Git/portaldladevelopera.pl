import { cookies } from "next/headers"

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const res = await fetch(`${baseUrl}/admin/stats/recent`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}
