const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      // dołożenie Bearer z cookie po stronie server actions/route handlers – na client fetch nie czytamy HttpOnly
    },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}`)
  }
  return (await res.json()) as T
}
