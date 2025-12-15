"use client"

import { InfoTooltip } from "@/components/ui/Tooltip"
import { useMe } from "@/lib/useMe"
import { useEffect, useMemo, useState } from "react"
import AddDeveloperModal from "./AddDeveloperModal"

type Developer = {
  _id: string
  name: string
  nip?: string
  address?: string
}

type Toast = { id: string; type: "success" | "error"; message: string }

export default function DevelopersList() {
  const [items, setItems] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const { me } = useMe()

  function showToast(type: Toast["type"], message: string) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const url = query
      ? `/api/admin/developers?nip=${encodeURIComponent(query)}`
      : "/api/admin/developers"
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setItems(d)
        else if (d && typeof d === "object" && "_id" in d)
          setItems([d as Developer])
        else setItems([])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [query, refreshKey])

  const count = useMemo(() => items.length, [items])

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(`Usunąć dewelopera "${name}"? Operacji nie można cofnąć.`)
    )
      return
    try {
      const res = await fetch(`/api/admin/developers/${id}`, {
        method: "DELETE",
      })
      if (!res.ok && res.status !== 204) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }
      showToast("success", "Usunięto dewelopera")
      // Odśwież listę bez przeładowania strony
      setItems((prev) => prev.filter((x) => x._id !== id))
      setRefreshKey((k) => k + 1)
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Nie udało się usunąć dewelopera"
      showToast("error", message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Szukaj po NIP</label>
          <input
            className="input"
            placeholder="np. 5250001009"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={me?.role === "CLIENT"}
          />
        </div>
        <div className="text-sm muted">{count} wyników</div>
        <div className="sm:ml-auto">
          {me?.role === "SUPER_ADMIN" ? (
            <AddDeveloperModal onCreated={() => setRefreshKey((k) => k + 1)} />
          ) : (
            <div className="flex items-center gap-2">
              <button className="btn btn-primary" disabled aria-disabled="true">
                + Dodaj dewelopera
              </button>
              <InfoTooltip
                text="Dodawanie nowych deweloperów jest zablokowane. Skontaktuj się z administratorem, aby uzyskać zgodę."
                ariaLabel="Informacja o ograniczeniu dodawania deweloperów"
              />
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 card animate-pulse" />
          ))}
        </div>
      ) : count ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d) => (
            <article
              key={d._id}
              className="card hover:shadow-md transition-shadow border-l-4"
              style={{ borderLeftColor: "var(--accent)" }}
            >
              <h3 className="font-medium truncate">{d.name}</h3>
              <dl className="mt-2 text-sm muted">
                <div className="flex items-center justify-between">
                  <dt className="opacity-70">NIP</dt>
                  <dd>{d.nip || "—"}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href={`/developers/${d._id}`}
                  className="btn px-2 py-1 text-xs"
                >
                  Szczegóły
                </a>
                {me?.role === "SUPER_ADMIN" && (
                  <button
                    className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(d._id, d.name)}
                  >
                    Usuń
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card card-lg text-sm muted">Brak wyników</div>
      )}

      {/* Toasts */}
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
    </div>
  )
}
