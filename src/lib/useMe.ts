"use client"

import { useEffect, useState } from "react"

export type Me = {
  ok: boolean
  sub?: string
  username?: string
  role?: "SUPER_ADMIN" | "CLIENT"
  allowedInvestmentIds: string[]
  developerId?: string | null
  developerIds?: string[]
  iat?: number
  exp?: number
}

export function useMe() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch("/api/admin/me", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        return (await r.json()) as Me
      })
      .then((d) => {
        if (mounted) setMe(d)
      })
      .catch(() => {
        if (mounted) setError("unauthenticated")
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  return { me, loading, error }
}
