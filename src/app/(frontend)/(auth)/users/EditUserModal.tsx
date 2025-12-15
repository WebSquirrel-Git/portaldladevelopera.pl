"use client"

import { useEffect, useState } from "react"

type Investment = { _id: string; name: string }
type Developer = { _id: string; name: string }

type User = {
  _id: string
  username: string
  role: "SUPER_ADMIN" | "CLIENT"
  active: boolean
  allowedInvestmentIds: string[]
  developerId?: string
  developerIds?: string[]
}

type Props = {
  user: User
  onUpdated?: (user: User) => void
}

export default function EditUserModal({ user, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<User["role"]>(user.role)
  const [active, setActive] = useState<boolean>(user.active)
  const [selectedInv, setSelectedInv] = useState<Set<string>>(
    new Set(user.allowedInvestmentIds || [])
  )
  const [investments, setInvestments] = useState<Investment[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDevs, setSelectedDevs] = useState<Set<string>>(
    () =>
      new Set([
        ...(user.developerIds || []),
        ...(user.developerId ? [user.developerId] : []),
      ])
  )

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    async function load() {
      try {
        const [invs, devs] = await Promise.all([
          fetch("/api/admin/investments", { signal: controller.signal })
            .then((r) => r.json())
            .catch(() => []),
          fetch("/api/admin/developers", { signal: controller.signal })
            .then((r) => r.json())
            .catch(() => []),
        ])
        setInvestments(Array.isArray(invs) ? invs : [])
        setDevelopers(Array.isArray(devs) ? devs : [])
      } catch {}
    }
    load()
    return () => controller.abort()
  }, [open])

  function toggleInv(id: string) {
    setSelectedInv((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleDev(id: string) {
    setSelectedDevs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function submit() {
    setSaving(true)
    setError(null)
    try {
      const devIds = Array.from(selectedDevs)
      const payload: Record<string, unknown> = {
        username: username.trim(),
        role,
        active,
        allowedInvestmentIds: Array.from(selectedInv),
        developerIds: devIds,
        developerId: devIds.length === 1 ? devIds[0] : undefined,
      }
      if (password && password.trim().length > 0) {
        payload.password = password
      }
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const msg =
          (data && (data.message as string | string[])) || "Błąd zapisu"
        setError(Array.isArray(msg) ? msg[0] : msg)
        return
      }
      const updated = (data || user) as User
      onUpdated?.(updated)
      setOpen(false)
    } catch {
      setError("Nie udało się zapisać użytkownika")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button className="btn px-2 py-1 text-xs" onClick={() => setOpen(true)}>
        Edytuj
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 card w-full max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Edytuj użytkownika</h3>
              <button
                className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                onClick={() => setOpen(false)}
              >
                Zamknij
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs opacity-70">Login</label>
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs opacity-70">
                  Hasło (pozostaw puste bez zmiany)
                </label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs opacity-70">Rola</label>
                <select
                  className="input"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "SUPER_ADMIN" | "CLIENT")
                  }
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  id={`active_${user._id}`}
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label htmlFor={`active_${user._id}`} className="text-sm">
                  Aktywny
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs opacity-70">
                  Deweloperzy (opcjonalnie, wiele)
                </label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-auto p-2 border rounded bg-white/50">
                  {developers.map((d) => (
                    <label
                      key={d._id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDevs.has(d._id)}
                        onChange={() => toggleDev(d._id)}
                      />
                      <span className="truncate">{d.name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-gray-600">
                  Gdy zaznaczysz dokładnie jednego dewelopera, zostanie on
                  zapisany także jako pole zgodności wstecz (developerId).
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs opacity-70">
                  Dostęp do inwestycji
                </label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-auto p-2 border rounded bg-white/50">
                  {investments.map((i) => (
                    <label
                      key={i._id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selectedInv.has(i._id)}
                        onChange={() => toggleInv(i._id)}
                      />
                      <span className="truncate">{i.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="btn"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={submit}
                disabled={saving}
              >
                {saving ? "Zapisywanie…" : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
