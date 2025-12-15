import { cookies } from "next/headers"

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"

// Zwraca listę inwestycji widocznych dla bieżącego użytkownika (ułatwia panel Users do checkboxów)
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const res = await fetch(`${baseUrl}/admin/investments`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}
