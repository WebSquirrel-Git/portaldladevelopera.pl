import { cookies } from "next/headers"

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const investmentId = searchParams.get("investmentId")
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const url = `${baseUrl}/admin/units${
    investmentId ? `?investmentId=${encodeURIComponent(investmentId)}` : ""
  }`
  const res = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const body = await req.json().catch(() => ({}))
  const res = await fetch(`${baseUrl}/admin/units`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}
