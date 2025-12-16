"use client"

import { useMe } from "@/lib/useMe"
import { useEffect, useMemo, useState } from "react"
import AddUserModal from "./AddUserModal"
import EditUserModal from "./EditUserModal"

type User = {
  _id: string
  username: string
  role: "SUPER_ADMIN" | "CLIENT"
  active: boolean
  allowedInvestmentIds: string[]
  developerId?: string
  developerIds?: string[]
}

type Investment = { _id: string; name: string }
type Developer = { _id: string; name: string }

type Toast = { id: string; type: "success" | "error"; message: string }

export default function UsersPage() {
  const { me } = useMe()
  const [users, setUsers] = useState<User[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  const isSuper = me?.role === "SUPER_ADMIN"

  function showToast(type: Toast["type"], message: string) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  async function refresh() {
    setLoading(true)
    try {
      const [usersRes, invsRes, devsRes] = await Promise.all([
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/investments").then((r) => r.json()),
        fetch("/api/admin/developers").then((r) => r.json()),
      ])
      setUsers(Array.isArray(usersRes) ? usersRes : [])
      setInvestments(Array.isArray(invsRes) ? invsRes : [])
      setDevelopers(Array.isArray(devsRes) ? devsRes : [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    if (!isSuper) return
    const controller = new AbortController()
    ;(async () => {
      setLoading(true)
      try {
        const [usersRes, invsRes, devsRes] = await Promise.all([
          fetch("/api/admin/users", { signal: controller.signal }).then((r) =>
            r.json()
          ),
          fetch("/api/admin/investments", { signal: controller.signal }).then(
            (r) => r.json()
          ),
          fetch("/api/admin/developers", { signal: controller.signal }).then(
            (r) => r.json()
          ),
        ])
        setUsers(Array.isArray(usersRes) ? usersRes : [])
        setInvestments(Array.isArray(invsRes) ? invsRes : [])
        setDevelopers(Array.isArray(devsRes) ? devsRes : [])
      } catch {}
      setLoading(false)
    })()
    return () => controller.abort()
  }, [isSuper])

  const invMap = useMemo(
    () => new Map(investments.map((i) => [i._id, i.name])),
    [investments]
  )
  const devMap = useMemo(
    () => new Map(developers.map((d) => [d._id, d.name])),
    [developers]
  )

  async function toggleActive(u: User) {
    try {
      const res = await fetch(`/api/admin/users/${u._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !u.active }),
      })
      if (!res.ok) throw new Error("HTTP " + res.status)
      const updated: User = await res.json()
      setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)))
      showToast("success", "Zmieniono status użytkownika")
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Błąd")
    }
  }

  async function removeUser(u: User) {
    if (!window.confirm(`Usunąć użytkownika "${u.username}"?`)) return
    try {
      const res = await fetch(`/api/admin/users/${u._id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("HTTP " + res.status)
      setUsers((prev) => prev.filter((x) => x._id !== u._id))
      showToast("success", "Usunięto użytkownika")
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Błąd")
    }
  }

  if (!isSuper) {
    return (
      <div className="card">
        <h1 className="font-medium">Użytkownicy</h1>
        <p className="mt-2 text-sm muted">
          Brak uprawnień. Tylko SUPER_ADMIN ma dostęp do tej sekcji.
        </p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Użytkownicy</h1>
        <AddUserModal onCreated={() => refresh()} />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 card animate-pulse" />
          ))}
        </div>
      ) : users.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <article key={u._id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{u.username}</h3>
                  <p className="text-xs muted">
                    {u.role} • {u.active ? "aktywny" : "zablokowany"}
                  </p>
                </div>
                <EditUserModal
                  user={u}
                  onUpdated={(updated) =>
                    setUsers((prev) =>
                      prev.map((x) => (x._id === updated._id ? updated : x))
                    )
                  }
                />
              </div>
              <div className="mt-2 text-xs muted">
                <div>
                  Inwestycje: {u.allowedInvestmentIds.length || 0}
                  {u.allowedInvestmentIds.length
                    ? ` — ${u.allowedInvestmentIds
                        .map((id) => invMap.get(id) || id)
                        .join(", ")}`
                    : ""}
                </div>
                <div>
                  Deweloperzy: {u.developerIds?.length || 0}
                  {u.developerIds && u.developerIds.length
                    ? ` — ${u.developerIds
                        .map((id) => devMap.get(id) || id)
                        .join(", ")}`
                    : ""}
                </div>
                {u.developerId &&
                  !(u.developerIds?.includes(u.developerId) ?? false) && (
                    <div>
                      Deweloper (legacy):{" "}
                      {devMap.get(u.developerId) || u.developerId}
                    </div>
                  )}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  className="btn px-2 py-1 text-xs"
                  onClick={() => toggleActive(u)}
                >
                  {u.active ? "Dezaktywuj" : "Aktywuj"}
                </button>
                <button
                  className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => removeUser(u)}
                >
                  Usuń
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card card-lg text-sm muted">Brak użytkowników</div>
      )}

      {/* Toasty */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-3 py-2 rounded shadow text-sm ${
              t.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </section>
  )
}
