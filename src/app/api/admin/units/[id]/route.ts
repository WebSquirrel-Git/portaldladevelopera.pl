import { cookies } from "next/headers"

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const res = await fetch(`${baseUrl}/admin/units/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const body = await req.json().catch(() => ({}))
  const res = await fetch(`${baseUrl}/admin/units/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  const res = await fetch(`${baseUrl}/admin/units/${id}`, {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  })
  if (res.status === 204) {
    return new Response(null, { status: 200 })
  }
  const body = await res.text().catch(() => "")
  return new Response(body, { status: res.status })
}
