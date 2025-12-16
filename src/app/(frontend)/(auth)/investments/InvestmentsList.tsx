"use client"

import { InfoTooltip } from "@/components/ui/Tooltip"
import { useMe } from "@/lib/useMe"
import { useEffect, useMemo, useState } from "react"
import AddInvestmentModal from "./AddInvestmentModal"
import EditInvestmentModal from "./EditInvestmentModal"

type Developer = { _id: string; name: string }

type Investment = {
  _id: string
  developerId: string
  name: string
  address?: string
  city?: string
  extIdent: string
}

type Toast = { id: string; type: "success" | "error"; message: string }

type PreviewKind = "json" | "csv" | "xml" | "md5" | "other"

function formatXml(input: string): string {
  try {
    const compact = input.replace(/>\s+</g, "><").trim()
    const tokens = compact.replace(/(>)(<)(\/*)/g, "$1\n$2$3").split("\n")
    let indent = 0
    const out: string[] = []
    for (const raw of tokens) {
      const line = raw.trim()
      if (!line) continue
      const isClosing = /^<\//.test(line)
      const isCommentOrDecl =
        /^<\?/.test(line) || /^<!--/.test(line) || /^<![^-]/.test(line)
      const isSelfClosing = /<[^>]+\/>$/.test(line)
      const hasPairSameLine = /^<[^>]+>.*<\/[^>]+>$/.test(line)
      if (isClosing && indent > 0) indent--
      out.push(`${"  ".repeat(indent)}${line}`)
      const isOpeningTag = /^<[^\/?!][^>]*>$/.test(line)
      if (
        isOpeningTag &&
        !isSelfClosing &&
        !isCommentOrDecl &&
        !hasPairSameLine
      ) {
        indent++
      }
    }
    return out.join("\n")
  } catch {
    return input
  }
}

export default function InvestmentsList() {
  const [devs, setDevs] = useState<Developer[]>([])
  const [items, setItems] = useState<Investment[]>([])
  const [developerId, setDeveloperId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Podgląd XML/MD5
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTitle, setPreviewTitle] = useState("")
  const [previewContent, setPreviewContent] = useState("")
  const [previewKind, setPreviewKind] = useState<PreviewKind>("other")

  const [toasts, setToasts] = useState<Toast[]>([])
  function showToast(type: Toast["type"], message: string) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  const { me } = useMe()
  const canManage = me?.role === "SUPER_ADMIN"

  const clientHasSingleLocked = me?.role === "CLIENT" && !!me?.developerId
  const clientHasMulti =
    me?.role === "CLIENT" &&
    Array.isArray(me?.developerIds) &&
    me.developerIds.length > 0
  const lockedDeveloperId = clientHasSingleLocked
    ? me?.developerId || ""
    : undefined
  const allowedOnly =
    me?.role === "CLIENT" &&
    !clientHasSingleLocked &&
    !clientHasMulti &&
    (me?.allowedInvestmentIds?.length || 0) > 0

  const publicBase = (process.env.NEXT_PUBLIC_PUBLIC_BASE_URL || "").replace(
    /\/$/,
    ""
  )

  function slugify(v: string) {
    return String(v)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  }

  async function handleDownload(url: string, filename: string) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const href = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = href
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(href)
    } catch {
      // Fallback: otwórz w nowej karcie
      window.open(url, "_blank")
    }
  }

  async function handlePreview(url: string, title: string) {
    try {
      setPreviewTitle(title)
      setPreviewContent("Wczytywanie…")
      setPreviewOpen(true)
      // Rozpoznaj rodzaj podglądu po rozszerzeniu URL
      const lowered = url.toLowerCase()
      const kind: PreviewKind = lowered.endsWith(".json")
        ? "json"
        : lowered.endsWith(".csv")
        ? "csv"
        : lowered.endsWith(".xml")
        ? "xml"
        : lowered.endsWith(".md5")
        ? "md5"
        : "other"
      setPreviewKind(kind)

      const res = await fetch(url)
      const raw = await res.text()

      // Formatowanie JSON/XML – pretty print
      let formatted = raw
      if (kind === "json") {
        try {
          formatted = JSON.stringify(JSON.parse(raw), null, 2)
        } catch {
          // zostaw surowy tekst jeśli niepoprawny JSON
        }
      } else if (kind === "xml") {
        formatted = formatXml(raw)
      }

      setPreviewContent(formatted || "(pusto)")
    } catch {
      setPreviewContent("Błąd wczytywania podglądu.")
    }
  }

  // Update: accept whole investment to validate permissions for CLIENT
  async function handleDeleteInvestment(inv: Investment) {
    const isClientOwner =
      me?.role === "CLIENT" && me?.developerId === inv.developerId
    if (!(canManage || isClientOwner)) return
    if (
      !window.confirm(
        `Usunąć inwestycję "${inv.name}"? Operacji nie można cofnąć.`
      )
    )
      return
    try {
      const res = await fetch(`/api/admin/investments/${inv._id}`, {
        method: "DELETE",
      })
      if (!res.ok && res.status !== 204) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }
      showToast("success", "Usunięto inwestycję")
      setRefreshKey((k) => k + 1)
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Nie udało się usunąć inwestycji"
      showToast("error", msg)
    }
  }

  // Load developers for filter
  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/admin/developers", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setDevs(Array.isArray(d) ? d : []))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  // Wymuś filtr na własnym deweloperze dla CLIENT (single) lub ustaw "wszyscy przypisani" przy multi
  useEffect(() => {
    if (clientHasSingleLocked && lockedDeveloperId)
      setDeveloperId(lockedDeveloperId)
    else if (clientHasMulti) setDeveloperId("")
  }, [clientHasSingleLocked, lockedDeveloperId, clientHasMulti])

  // Load investments
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const url = developerId
      ? `/api/admin/investments?developerId=${encodeURIComponent(developerId)}`
      : "/api/admin/investments"
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [developerId, refreshKey])

  const count = useMemo(() => items.length, [items])

  // Lista deweloperów dostępnych do wyboru dla klienta z multi
  const assignedDevelopers = useMemo(() => {
    if (!clientHasMulti) return [] as Developer[]
    const ids = new Set((me?.developerIds || []).map(String))
    return devs.filter((d) => ids.has(String(d._id)))
  }, [clientHasMulti, me?.developerIds, devs])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="w-full sm:w-80">
          <label className="block text-sm font-medium">Deweloper</label>
          {lockedDeveloperId ? (
            <select className="input" value={developerId} disabled>
              <option value={developerId}>
                {devs.find((d) => d._id === developerId)?.name || developerId}
              </option>
            </select>
          ) : clientHasMulti ? (
            <select
              className="input"
              value={developerId}
              onChange={(e) => setDeveloperId(e.target.value)}
            >
              <option value="">Wszyscy przypisani</option>
              {assignedDevelopers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          ) : allowedOnly ? (
            <input
              className="input"
              value="Tylko przypisane inwestycje"
              disabled
              readOnly
            />
          ) : (
            <select
              className="input"
              value={developerId}
              onChange={(e) => setDeveloperId(e.target.value)}
            >
              <option value="">Wszyscy</option>
              {devs.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="text-sm muted">{count} wyników</div>
        <div className="sm:ml-auto">
          {/* SUPER_ADMIN: pełne zarządzanie; pozostali: zablokowane z komunikatem */}
          {canManage ? (
            <AddInvestmentModal
              initialDeveloperId={developerId}
              onCreated={(created?: unknown) => {
                const inv = created as Investment | undefined
                if (inv && (!developerId || inv.developerId === developerId)) {
                  setItems((prev) => [inv, ...prev])
                }
                setRefreshKey((k) => k + 1)
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <button className="btn btn-primary" disabled aria-disabled="true">
                + Dodaj inwestycję
              </button>
              <InfoTooltip
                text="Dodawanie nowych inwestycji jest zablokowane. Skontaktuj się z administratorem, aby uzyskać zgodę."
                ariaLabel="Informacja o ograniczeniu dodawania inwestycji"
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
          {items.map((it) => {
            const slug = slugify(it.name || it.extIdent)
            const base = `${publicBase}/open-data/${slug}`
            const url = (ext: string) => `${base}/${slug}.${ext}`
            const clientCanDelete =
              me?.role === "CLIENT" && me?.developerId === it.developerId
            return (
              <article
                key={it._id}
                className="card hover:shadow-md transition-shadow border-l-4"
                style={{ borderLeftColor: "var(--accent)" }}
              >
                <h3 className="font-medium truncate">{it.name}</h3>
                <dl className="mt-2 text-sm muted space-y-1">
                  <div className="flex items-center justify-between">
                    <dt className="opacity-70">Miasto</dt>
                    <dd>{it.city || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="opacity-70">Adres</dt>
                    <dd className="truncate max-w-[60%] text-right">
                      {it.address || "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="opacity-70">extIdent</dt>
                    <dd className="truncate max-w-[60%] text-right">
                      {it.extIdent}
                    </dd>
                  </div>
                </dl>
                {/* Zarządzanie lokalami – wyśrodkowany wyróżniony przycisk */}
                <div className="mt-3 flex justify-center">
                  <a
                    href={`/investments/${it._id}/units`}
                    className="btn px-3 py-2 text-sm"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      borderColor: "var(--accent)",
                    }}
                  >
                    Zarządzaj lokalami
                  </a>
                </div>
                {/* Linki do eksportów */}
                <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-[11px]">
                  <span className="opacity-70 mr-2">Oferty:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-70">JSON</span>
                    <a
                      href={url("json")}
                      className="btn px-2 py-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Otwórz
                    </a>
                    <button
                      className="btn px-2 py-1"
                      onClick={() =>
                        handlePreview(url("json"), `${it.name} — offers.json`)
                      }
                    >
                      Podgląd
                    </button>
                    <button
                      className="btn px-2 py-1"
                      onClick={() =>
                        handleDownload(url("json"), `${slug}.json`)
                      }
                    >
                      Pobierz
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-70">CSV</span>
                    <a
                      href={url("csv")}
                      className="btn px-2 py-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Otwórz
                    </a>
                    <button
                      className="btn px-2 py-1"
                      onClick={() =>
                        handlePreview(url("csv"), `${it.name} — offers.csv`)
                      }
                    >
                      Podgląd
                    </button>
                    <button
                      className="btn px-2 py-1"
                      onClick={() => handleDownload(url("csv"), `${slug}.csv`)}
                    >
                      Pobierz
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-70">XLSX</span>
                    <a
                      href={url("xlsx")}
                      className="btn px-2 py-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Otwórz
                    </a>
                    <button
                      className="btn px-2 py-1"
                      onClick={() =>
                        handleDownload(url("xlsx"), `${slug}.xlsx`)
                      }
                    >
                      Pobierz
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-end gap-2 text-[11px]">
                  <span className="opacity-70 mr-2">Harvest:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-70">XML</span>
                    <a
                      href={url("xml")}
                      className="btn px-2 py-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Otwórz
                    </a>
                    <button
                      className="btn px-2 py-1"
                      onClick={() =>
                        handlePreview(url("xml"), `${it.name} — harvest.xml`)
                      }
                    >
                      Podgląd
                    </button>
                    <button
                      className="btn px-2 py-1"
                      onClick={() => handleDownload(url("xml"), `${slug}.xml`)}
                    >
                      Pobierz
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-70">MD5</span>
                    <a
                      href={url("md5")}
                      className="btn px-2 py-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Otwórz
                    </a>
                    <button
                      className="btn px-2 py-1"
                      onClick={() =>
                        handlePreview(url("md5"), `${it.name} — md5`)
                      }
                    >
                      Podgląd
                    </button>
                    <button
                      className="btn px-2 py-1"
                      onClick={() => handleDownload(url("md5"), `${slug}.md5`)}
                    >
                      Pobierz
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  {(canManage || clientCanDelete) && (
                    <button
                      className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleDeleteInvestment(it)}
                    >
                      Usuń
                    </button>
                  )}
                  {/* Edycja inwestycji w modalu */}
                  <EditInvestmentModal
                    investment={it}
                    canChangeDeveloper={canManage}
                    lockedDeveloperId={lockedDeveloperId}
                    onUpdated={(updated?: unknown) => {
                      const inv = updated as Investment | undefined
                      if (inv) {
                        setItems((prev) =>
                          prev.map((p) =>
                            p._id === inv._id ? { ...p, ...inv } : p
                          )
                        )
                      } else {
                        setRefreshKey((k) => k + 1)
                      }
                    }}
                  />
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="card card-lg text-sm muted">Brak wyników</div>
      )}

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPreviewOpen(false)}
          />
          <div className="relative z-10 card w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-medium truncate">{previewTitle}</h4>
              <button
                className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                onClick={() => setPreviewOpen(false)}
              >
                Zamknij
              </button>
            </div>
            <div className="mt-3 flex-1 min-h-0 overflow-auto border rounded bg-white/50">
              <pre
                className={`p-3 text-xs font-mono ${
                  previewKind === "csv" ||
                  previewKind === "json" ||
                  previewKind === "xml"
                    ? "whitespace-pre"
                    : "whitespace-pre-wrap break-words"
                } overflow-x-auto`}
              >
                {previewContent}
              </pre>
            </div>
          </div>
        </div>
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
    </div>
  )
}
