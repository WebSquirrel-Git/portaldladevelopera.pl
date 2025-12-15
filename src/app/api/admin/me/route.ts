import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  if (!token)
    return Response.json({ message: "Unauthenticated" }, { status: 401 })

  try {
    const parts = token.split(".")
    if (parts.length < 2) throw new Error("Invalid token")
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = Buffer.from(payloadB64, "base64").toString("utf8")
    const payload = JSON.parse(json) as {
      sub?: string
      username?: string
      role?: string
      allowedInvestmentIds?: string[]
      developerId?: string
      developerIds?: string[]
      iat?: number
      exp?: number
    }
    return Response.json({
      ok: true,
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      allowedInvestmentIds: payload.allowedInvestmentIds || [],
      developerId: payload.developerId ?? null,
      developerIds: payload.developerIds || [],
      iat: payload.iat,
      exp: payload.exp,
    })
  } catch {
    return Response.json({ message: "Invalid token" }, { status: 400 })
  }
}
