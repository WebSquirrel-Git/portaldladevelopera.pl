"use client"

import { InfoTooltip } from "@/components/ui/Tooltip"
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

function newKey() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// Normalizacja identyfikatora z API (_id/id może być stringiem lub obiektem {$oid})
function normalizeId(id: unknown): string | undefined {
  if (!id) return undefined
  if (typeof id === "string") return id
  if (typeof id === "object") {
    const obj = id as Record<string, unknown>
    if (typeof obj.$oid === "string") return obj.$oid as string
    if (typeof obj.toHexString === "function")
      return (obj.toHexString as () => string)()
  }
  return undefined
}

// ==== Stabilne helpery poza komponentem (brak wpływu na zależności hooków) ====
const round2 = (v: number) => Math.round(v * 100) / 100
const clampNum = (v: unknown): number | undefined => {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return typeof n === "number" && Number.isFinite(n) ? n : undefined
}
const quickRound = (
  v: number | undefined,
  mode: "half0" | "ceil0" | "floor0"
): number | undefined => {
  if (typeof v !== "number" || !Number.isFinite(v)) return v
  if (mode === "half0") return Math.round(v)
  if (mode === "ceil0") return Math.ceil(v)
  return Math.floor(v)
}

// Dzisiejsza data w formacie RRRR-MM-DD (lokalna strefa czasowa)
function todayStrLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

interface UnitRow {
  __key: string
  _id?: string
  number: string
  type: "flat" | "house"
  floor?: number
  areaM2: number
  rooms: number
  available: boolean
  pricePerM2Gross?: number
  pricePerM2EffectiveFrom?: string
  basePriceGross?: number
  basePriceEffectiveFrom?: string
  totalPriceGross?: number
  totalPriceEffectiveFrom?: string
  prospectUrl?: string
  availability?: "available" | "reserved" | "sold"
  parts?: Array<{
    kind: string
    label?: string
    priceGross?: number
    effectiveFrom?: string
  }>
  ancillary?: Array<{
    kind: string
    label?: string
    priceGross?: number
    effectiveFrom?: string
  }>
  rights?: Array<{
    name: string
    valueGross?: number
    effectiveFrom?: string
  }>
  otherBenefits?: Array<{
    name: string
    valueGross?: number
    effectiveFrom?: string
  }>
}

// Typy danych zwracanych z API (daty jako string | Date)
interface UnitApiPart {
  kind: string
  label?: string
  priceGross?: number
  effectiveFrom?: string | Date
}
interface UnitApiAncillary {
  kind: string
  label?: string
  priceGross?: number
  effectiveFrom?: string | Date
}
interface UnitApiRightBenefit {
  name: string
  valueGross?: number
  effectiveFrom?: string | Date
}
interface UnitApi {
  _id?: string
  number?: string
  type?: "flat" | "house"
  floor?: number
  areaM2?: number
  rooms?: number
  available?: boolean
  pricePerM2Gross?: number
  pricePerM2EffectiveFrom?: string | Date
  basePriceGross?: number
  basePriceEffectiveFrom?: string | Date
  totalPriceGross?: number
  totalPriceEffectiveFrom?: string | Date
  prospectUrl?: string
  availability?: "available" | "reserved" | "sold"
  parts?: UnitApiPart[]
  ancillary?: UnitApiAncillary[]
  rights?: UnitApiRightBenefit[]
  otherBenefits?: UnitApiRightBenefit[]
}

function toDateStr(v?: string | Date): string | undefined {
  if (!v) return undefined
  if (typeof v === "string") return v.slice(0, 10)
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return undefined
}

function fromApiToRow(x: UnitApi): UnitRow {
  const avail = x.availability
  const boolAvailable = x.available
  const resolvedAvailability: UnitRow["availability"] =
    (avail as UnitRow["availability"]) ??
    (boolAvailable === false ? "reserved" : "available")
  const resolvedAvailable =
    typeof boolAvailable === "boolean"
      ? boolAvailable
      : resolvedAvailability === "available"

  // Wyznacz bezpieczne stringowe _id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawId = (x as any)._id ?? (x as any).id
  const safeId = normalizeId(rawId)

  return {
    __key: safeId || newKey(),
    _id: safeId,
    number: x.number ?? "",
    type: (x.type as UnitRow["type"]) ?? "flat",
    floor: x.floor ?? undefined,
    areaM2: x.areaM2 ?? 0,
    rooms: x.rooms ?? 1,
    available: resolvedAvailable,
    pricePerM2Gross: x.pricePerM2Gross ?? undefined,
    pricePerM2EffectiveFrom: toDateStr(x.pricePerM2EffectiveFrom),
    basePriceGross: x.basePriceGross ?? undefined,
    basePriceEffectiveFrom: toDateStr(x.basePriceEffectiveFrom),
    totalPriceGross: x.totalPriceGross ?? undefined,
    totalPriceEffectiveFrom: toDateStr(x.totalPriceEffectiveFrom),
    prospectUrl: x.prospectUrl ?? "",
    availability: resolvedAvailability,
    parts:
      x.parts?.map((p) => ({
        kind: p?.kind ?? "",
        label: p?.label ?? undefined,
        priceGross:
          typeof p?.priceGross === "number" ? p.priceGross : undefined,
        effectiveFrom: toDateStr(p?.effectiveFrom),
      })) ?? [],
    ancillary:
      x.ancillary?.map((p) => ({
        kind: p?.kind ?? "",
        label: p?.label ?? undefined,
        priceGross:
          typeof p?.priceGross === "number" ? p.priceGross : undefined,
        effectiveFrom: toDateStr(p?.effectiveFrom),
      })) ?? [],
    rights:
      x.rights?.map((r) => ({
        name: r?.name ?? "",
        valueGross:
          typeof r?.valueGross === "number" ? r.valueGross : undefined,
        effectiveFrom: toDateStr(r?.effectiveFrom),
      })) ?? [],
    otherBenefits:
      x.otherBenefits?.map((r) => ({
        name: r?.name ?? "",
        valueGross:
          typeof r?.valueGross === "number" ? r.valueGross : undefined,
        effectiveFrom: toDateStr(r?.effectiveFrom),
      })) ?? [],
  }
}

export default function UnitsManager({
  investmentId,
}: {
  investmentId: string
}) {
  const [rows, setRows] = useState<UnitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Modal edycji pól tablicowych
  const [editingRowKey, setEditingRowKey] = useState<string | null>(null)
  const [editingArrays, setEditingArrays] = useState<{
    parts: NonNullable<UnitRow["parts"]>
    ancillary: NonNullable<UnitRow["ancillary"]>
    rights: NonNullable<UnitRow["rights"]>
    otherBenefits: NonNullable<UnitRow["otherBenefits"]>
  } | null>(null)

  // Kalkulator: debounce przeliczania powiązanych cen
  const calcTimers = useRef<
    Record<string, ReturnType<typeof setTimeout> | undefined>
  >({})
  const debounceMs = 300

  // Wyszukiwarka po numerze lokalu
  const [numberQuery, setNumberQuery] = useState("")
  const filteredRows = useMemo(() => {
    const q = numberQuery.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => (r.number || "").toLowerCase().includes(q))
  }, [rows, numberQuery])

  // Naturalne porównanie tekstowo-liczbowe (np. 2 < 10)
  const naturalCollator = useMemo(
    () => new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }),
    []
  )

  // Helper do ustawiania (cena + odpowiadająca data) atomowo
  const setPriceWithDate = useCallback(
    (
      rowKey: string,
      priceKey: keyof Pick<
        UnitRow,
        "pricePerM2Gross" | "basePriceGross" | "totalPriceGross"
      >,
      dateKey: keyof Pick<
        UnitRow,
        | "pricePerM2EffectiveFrom"
        | "basePriceEffectiveFrom"
        | "totalPriceEffectiveFrom"
      >,
      value: number | undefined
    ) => {
      setRows((prev) =>
        prev.map((r) => {
          const isRow = r._id === rowKey || r.__key === rowKey
          if (!isRow) return r
          const prevVal = r[priceKey] as number | undefined
          // Jeśli brak zmiany – nic nie rób
          if (prevVal === value) return r
          // Przy wyczyszczeniu wartości nie nadpisujemy daty
          if (typeof value !== "number" || !Number.isFinite(value)) {
            return { ...r, [priceKey]: undefined } as UnitRow
          }
          return {
            ...r,
            [priceKey]: value,
            [dateKey]: todayStrLocal(),
          } as UnitRow
        })
      )
      setDirty(true)
    },
    []
  )

  const scheduleRecalc = useCallback(
    (rowKey: string, source: "ppm2" | "base") => {
      // Wyczyść poprzedni timer dla wiersza
      const t = calcTimers.current[rowKey]
      if (t) clearTimeout(t)
      calcTimers.current[rowKey] = setTimeout(() => {
        // Oblicz wartości na podstawie aktualnego stanu
        setRows((prev) =>
          prev.map((r) => {
            const isRow = r._id === rowKey || r.__key === rowKey
            if (!isRow) return r
            const area = clampNum(r.areaM2)
            if (!area || area <= 0) return r // kalkulator wyłączony
            if (source === "ppm2") {
              const ppm2 = clampNum(r.pricePerM2Gross)
              if (ppm2 === undefined) return { ...r, basePriceGross: undefined }
              const nextBase = round2(ppm2 * area)
              if (r.basePriceGross === nextBase) return r
              return {
                ...r,
                basePriceGross: nextBase,
                basePriceEffectiveFrom: todayStrLocal(),
              }
            } else {
              const base = clampNum(r.basePriceGross)
              if (base === undefined)
                return { ...r, pricePerM2Gross: undefined }
              const nextPpm2 = round2(base / area)
              if (r.pricePerM2Gross === nextPpm2) return r
              return {
                ...r,
                pricePerM2Gross: nextPpm2,
                pricePerM2EffectiveFrom: todayStrLocal(),
              }
            }
          })
        )
      }, debounceMs)
    },
    [setRows, debounceMs]
  )

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/admin/units?investmentId=${encodeURIComponent(investmentId)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d: UnitApi[]) => {
        setRows((d || []).map(fromApiToRow))
        setError(null)
      })
      .catch(() => {
        setError("Błąd pobierania listy lokali.")
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [investmentId])

  // Stabilizujemy columnHelper, aby nie tworzyć go na każdej renderce
  const columnHelper = useMemo(() => createColumnHelper<UnitRow>(), [])

  const updateCell = useCallback(
    <K extends keyof UnitRow>(rowKey: string, key: K, value: UnitRow[K]) => {
      setRows((prev) =>
        prev.map((r) =>
          r._id === rowKey || r.__key === rowKey ? { ...r, [key]: value } : r
        )
      )
      setDirty(true)
    },
    []
  )

  const handleDeleteRow = useCallback(
    async (row: UnitRow) => {
      setError(null)
      try {
        if (row._id) {
          const res = await fetch(`/api/admin/units/${row._id}`, {
            method: "DELETE",
          })
          if (!res.ok && res.status !== 204) throw new Error()
          const rr = await fetch(
            `/api/admin/units?investmentId=${encodeURIComponent(investmentId)}`
          )
          const d = (await rr.json()) as UnitApi[]
          setRows((d || []).map(fromApiToRow))
        } else {
          setRows((prev) =>
            prev.filter((r) => r.__key !== row.__key && r._id !== row._id)
          )
        }
        setDirty(true)
      } catch {
        setError("Nie udało się usunąć lokalu.")
      }
    },
    [investmentId]
  )

  // Duplikuj wiersz nad oryginałem, czyszcząc _id i number
  const handleDuplicateRow = useCallback((row: UnitRow) => {
    setRows((prev) => {
      const key = row._id ?? row.__key
      const idx = prev.findIndex((r) => (r._id ?? r.__key) === key)
      if (idx === -1) return prev
      const orig = prev[idx]
      const clone: UnitRow = {
        ...orig,
        __key: newKey(),
        _id: undefined,
        number: "",
        // głębokie kopie tablic, aby nie współdzielić referencji
        parts: orig.parts ? orig.parts.map((p) => ({ ...p })) : [],
        ancillary: orig.ancillary ? orig.ancillary.map((p) => ({ ...p })) : [],
        rights: orig.rights ? orig.rights.map((p) => ({ ...p })) : [],
        otherBenefits: orig.otherBenefits
          ? orig.otherBenefits.map((p) => ({ ...p }))
          : [],
      }
      const next = [...prev]
      next.splice(idx, 0, clone)
      return next
    })
    setDirty(true)
  }, [])

  // Otwórz modal edycji tablic
  const openEditArrays = useCallback((row: UnitRow) => {
    setEditingRowKey(row._id ?? row.__key)
    setEditingArrays({
      parts: [...(row.parts ?? [])],
      ancillary: [...(row.ancillary ?? [])],
      rights: [...(row.rights ?? [])],
      otherBenefits: [...(row.otherBenefits ?? [])],
    })
  }, [])

  // Zamknij modal edycji tablic (bez zapisu)
  const closeEditArrays = useCallback(() => {
    setEditingRowKey(null)
    setEditingArrays(null)
  }, [])

  // Zapisz zmiany tablic do wiersza
  const saveEditArrays = useCallback(() => {
    if (!editingRowKey || !editingArrays) return
    setRows((prev) =>
      prev.map((r) =>
        r._id === editingRowKey || r.__key === editingRowKey
          ? {
              ...r,
              parts: editingArrays.parts,
              ancillary: editingArrays.ancillary,
              rights: editingArrays.rights,
              otherBenefits: editingArrays.otherBenefits,
            }
          : r
      )
    )
    setDirty(true)
    setEditingRowKey(null)
    setEditingArrays(null)
  }, [editingRowKey, editingArrays])

  const columns = useMemo(
    () => [
      columnHelper.accessor("type", {
        header: "Rodzaj nieruchomości: lokal mieszkalny, dom jednorodzinny",
        cell: (info: CellContext<UnitRow, UnitRow["type"]>) => (
          <select
            className="input w-full"
            value={info.getValue() ?? "flat"}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "type",
                (e.target.value === "house"
                  ? "house"
                  : "flat") as UnitRow["type"]
              )
            }
          >
            <option value="flat">lokal mieszkalny</option>
            <option value="house">dom jednorodzinny</option>
          </select>
        ),
      }),
      columnHelper.accessor("number", {
        header: (ctx) => {
          const dir = ctx.column.getIsSorted() as false | "asc" | "desc"
          return (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:underline"
                onClick={ctx.column.getToggleSortingHandler()}
              >
                Nr lokalu lub domu jednorodzinnego nadany przez dewelopera
                <span className="text-[10px] text-gray-500">
                  {dir === "asc" ? "↑" : dir === "desc" ? "↓" : "↕"}
                </span>
              </button>
              <InfoTooltip
                text={
                  "Kliknij, aby sortować po numerze. W tabeli stosowane jest sortowanie naturalne (2 < 10)."
                }
                ariaLabel="Podpowiedź: sortowanie"
              />
            </div>
          )
        },
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const a = String(rowA.getValue(columnId) ?? "")
          const b = String(rowB.getValue(columnId) ?? "")
          return naturalCollator.compare(a, b)
        },
        cell: (info: CellContext<UnitRow, string>) => (
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="input w-full"
            value={info.getValue() ?? ""}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "number",
                e.target.value
              )
            }
            placeholder="X"
          />
        ),
      }),
      columnHelper.accessor("areaM2", {
        header: "Pow. m²",
        cell: (info: CellContext<UnitRow, number>) => (
          <input
            type="number"
            className="input w-full"
            value={info.getValue() ?? 0}
            onChange={(e) => {
              const rowKey = info.row.original._id ?? info.row.original.__key
              const newVal = Number(e.target.value) || 0
              updateCell(rowKey, "areaM2", newVal)
              // Po zmianie powierzchni przelicz w zależności od dostępnego źródła
              const hasBase =
                typeof info.row.original.basePriceGross === "number"
              const hasPpm2 =
                typeof info.row.original.pricePerM2Gross === "number"
              if (newVal > 0) {
                if (hasBase) scheduleRecalc(rowKey, "base")
                else if (hasPpm2) scheduleRecalc(rowKey, "ppm2")
              }
            }}
          />
        ),
      }),
      columnHelper.accessor("pricePerM2Gross", {
        header:
          "Cena m² powierzchni użytkowej lokalu mieszkalnego / domu jednorodzinnego [zł]",
        cell: (info: CellContext<UnitRow, number | undefined>) => {
          const rowKey = info.row.original._id ?? info.row.original.__key
          const val = info.getValue()
          const area = info.row.original.areaM2
          const disabled = !area || area <= 0
          return (
            <div className="inline-flex items-center w-full gap-1">
              <div className="relative flex-1">
                <input
                  type="number"
                  className="input w-full pr-12"
                  value={val ?? ""}
                  onChange={(e) => {
                    const v =
                      e.target.value === "" ? undefined : Number(e.target.value)
                    setPriceWithDate(
                      rowKey,
                      "pricePerM2Gross",
                      "pricePerM2EffectiveFrom",
                      v
                    )
                    if (!disabled) scheduleRecalc(rowKey, "ppm2")
                  }}
                  onBlur={(e) => {
                    const v =
                      e.target.value === "" ? undefined : Number(e.target.value)
                    if (typeof v === "number" && Number.isFinite(v)) {
                      updateCell(rowKey, "pricePerM2Gross", round2(v))
                    }
                  }}
                  placeholder="X"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                  PLN
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() => {
                    const nv = quickRound(val, "half0")
                    setPriceWithDate(
                      rowKey,
                      "pricePerM2Gross",
                      "pricePerM2EffectiveFrom",
                      nv
                    )
                    if (!disabled) scheduleRecalc(rowKey, "ppm2")
                  }}
                >
                  0
                </button>
                <InfoTooltip
                  text={"Zaokrąglij do pełnych zł (połowa w górę)."}
                  ariaLabel="Podpowiedź: zaokrąglij"
                />
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() => {
                    const nv = quickRound(val, "ceil0")
                    setPriceWithDate(
                      rowKey,
                      "pricePerM2Gross",
                      "pricePerM2EffectiveFrom",
                      nv
                    )
                    if (!disabled) scheduleRecalc(rowKey, "ppm2")
                  }}
                >
                  ↑
                </button>
                <InfoTooltip
                  text={"Sufit do pełnych zł (zaokrąglenie w górę)."}
                  ariaLabel="Podpowiedź: sufit"
                />
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() => {
                    const nv = quickRound(val, "floor0")
                    setPriceWithDate(
                      rowKey,
                      "pricePerM2Gross",
                      "pricePerM2EffectiveFrom",
                      nv
                    )
                    if (!disabled) scheduleRecalc(rowKey, "ppm2")
                  }}
                >
                  ↓
                </button>
                <InfoTooltip
                  text={"Podłoga do pełnych zł (zaokrąglenie w dół)."}
                  ariaLabel="Podpowiedź: podłoga"
                />
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor("pricePerM2EffectiveFrom", {
        header:
          "Data, od której obowiązuje cena m² powierzchni użytkowej lokalu mieszkalnego / domu jednorodzinnego",
        cell: (info: CellContext<UnitRow, string | undefined>) => (
          <input
            type="date"
            className="input w-full"
            value={info.getValue() ?? ""}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "pricePerM2EffectiveFrom",
                e.target.value === "" ? undefined : e.target.value
              )
            }
            placeholder="X"
          />
        ),
      }),
      columnHelper.accessor("basePriceGross", {
        header:
          "Cena lokalu mieszkalnego lub domu jednorodzinnego będących przedmiotem umowy, stanowiąca iloczyn ceny m² oraz powierzchni [zł]",
        cell: (info: CellContext<UnitRow, number | undefined>) => {
          const rowKey = info.row.original._id ?? info.row.original.__key
          const val = info.getValue()
          const area = info.row.original.areaM2
          const disabled = !area || area <= 0
          return (
            <div className="inline-flex items-center w-full gap-1">
              <div className="relative flex-1">
                <input
                  type="number"
                  className="input w-full pr-12"
                  value={val ?? ""}
                  onChange={(e) => {
                    const v =
                      e.target.value === "" ? undefined : Number(e.target.value)
                    setPriceWithDate(
                      rowKey,
                      "basePriceGross",
                      "basePriceEffectiveFrom",
                      v
                    )
                    if (!disabled) scheduleRecalc(rowKey, "base")
                  }}
                  onBlur={(e) => {
                    const v =
                      e.target.value === "" ? undefined : Number(e.target.value)
                    if (typeof v === "number" && Number.isFinite(v)) {
                      updateCell(rowKey, "basePriceGross", round2(v))
                    }
                  }}
                  placeholder="X"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                  PLN
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() => {
                    const nv = quickRound(val, "half0")
                    setPriceWithDate(
                      rowKey,
                      "basePriceGross",
                      "basePriceEffectiveFrom",
                      nv
                    )
                    if (!disabled) scheduleRecalc(rowKey, "base")
                  }}
                >
                  0
                </button>
                <InfoTooltip
                  text={"Zaokrąglij do pełnych zł (połowa w górę)."}
                />
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() => {
                    const nv = quickRound(val, "ceil0")
                    setPriceWithDate(
                      rowKey,
                      "basePriceGross",
                      "basePriceEffectiveFrom",
                      nv
                    )
                    if (!disabled) scheduleRecalc(rowKey, "base")
                  }}
                >
                  ↑
                </button>
                <InfoTooltip
                  text={"Sufit do pełnych zł (zaokrąglenie w górę)."}
                />
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() => {
                    const nv = quickRound(val, "floor0")
                    setPriceWithDate(
                      rowKey,
                      "basePriceGross",
                      "basePriceEffectiveFrom",
                      nv
                    )
                    if (!disabled) scheduleRecalc(rowKey, "base")
                  }}
                >
                  ↓
                </button>
                <InfoTooltip
                  text={"Podłoga do pełnych zł (zaokrąglenie w dół)."}
                />
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor("basePriceEffectiveFrom", {
        header:
          "Data, od której obowiązuje cena lokalu mieszkalnego lub domu jednorodzinnego będących przedmiotem umowy, stanowiąca iloczyn ceny m² oraz powierzchni",
        cell: (info: CellContext<UnitRow, string | undefined>) => (
          <input
            type="date"
            className="input w-full"
            value={info.getValue() ?? ""}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "basePriceEffectiveFrom",
                e.target.value === "" ? undefined : e.target.value
              )
            }
            placeholder="X"
          />
        ),
      }),
      columnHelper.accessor("totalPriceGross", {
        header:
          "Cena lokalu mieszkalnego lub domu jednorodzinnego uwzględniająca cenę lokalu stanowiącą iloczyn powierzchni oraz metrażu i innych składowych ceny, o których mowa w art. 19a ust. 1 pkt 1), 2) lub 3) [zł]",
        cell: (info: CellContext<UnitRow, number | undefined>) => {
          const rowKey = info.row.original._id ?? info.row.original.__key
          const val = info.getValue()
          return (
            <div className="inline-flex items-center w-full gap-1">
              <div className="relative flex-1">
                <input
                  type="number"
                  className="input w-full pr-12"
                  value={val ?? ""}
                  onChange={(e) =>
                    setPriceWithDate(
                      rowKey,
                      "totalPriceGross",
                      "totalPriceEffectiveFrom",
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                  onBlur={(e) => {
                    const v =
                      e.target.value === "" ? undefined : Number(e.target.value)
                    if (typeof v === "number" && Number.isFinite(v)) {
                      updateCell(rowKey, "totalPriceGross", round2(v))
                    }
                  }}
                  placeholder="X"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                  PLN
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() =>
                    setPriceWithDate(
                      rowKey,
                      "totalPriceGross",
                      "totalPriceEffectiveFrom",
                      quickRound(val, "half0")
                    )
                  }
                >
                  0
                </button>
                <InfoTooltip
                  text={"Zaokrąglij do pełnych zł (połowa w górę)."}
                />
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() =>
                    setPriceWithDate(
                      rowKey,
                      "totalPriceGross",
                      "totalPriceEffectiveFrom",
                      quickRound(val, "ceil0")
                    )
                  }
                >
                  ↑
                </button>
                <InfoTooltip
                  text={"Sufit do pełnych zł (zaokrąglenie w górę)."}
                />
                <button
                  type="button"
                  className="btn px-1 py-0.5 text-[10px]"
                  onClick={() =>
                    setPriceWithDate(
                      rowKey,
                      "totalPriceGross",
                      "totalPriceEffectiveFrom",
                      quickRound(val, "floor0")
                    )
                  }
                >
                  ↓
                </button>
                <InfoTooltip
                  text={"Podłoga do pełnych zł (zaokrąglenie w dół)."}
                />
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor("totalPriceEffectiveFrom", {
        header:
          "Data, od której obowiązuje cena lokalu mieszkalnego lub domu jednorodzinnego uwzględniająca cenę lokalu stanowiącą iloczyn powierzchni oraz metrażu i innych składowych ceny, o których mowa w art. 19a ust. 1 pkt 1), 2) lub 3)",
        cell: (info: CellContext<UnitRow, string | undefined>) => (
          <input
            type="date"
            className="input w-full"
            value={info.getValue() ?? ""}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "totalPriceEffectiveFrom",
                e.target.value === "" ? undefined : e.target.value
              )
            }
            placeholder="X"
          />
        ),
      }),
      {
        id: "partsKinds",
        header: "Rodzaj części nieruchomości będących przedmiotem umowy",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["parts"]> =
            info.row.original.parts ?? []
          const txt = arr
            .map((p) => p.kind)
            .filter(Boolean)
            .join("; ")
          return txt || "X"
        },
      },
      {
        id: "partsLabels",
        header: "Oznaczenie części nieruchomości nadane przez dewelopera",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["parts"]> =
            info.row.original.parts ?? []
          const txt = arr
            .map((p) => p.label)
            .filter(Boolean)
            .join("; ")
          return txt || "X"
        },
      },
      {
        id: "partsPrices",
        header: "Cena części nieruchomości będących przedmiotem umowy [zł]",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["parts"]> =
            info.row.original.parts ?? []
          const txt = arr
            .map((p) =>
              typeof p.priceGross === "number" ? String(p.priceGross) : ""
            )
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "partsDates",
        header:
          "Data, od której obowiązuje cena części nieruchomości będących przedmiotem umowy",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["parts"]> =
            info.row.original.parts ?? []
          const txt = arr
            .map((p) => p.effectiveFrom || "")
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "ancKinds",
        header:
          "Rodzaj pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["ancillary"]> =
            info.row.original.ancillary ?? []
          const txt = arr
            .map((p) => p.kind)
            .filter(Boolean)
            .join("; ")
          return txt || "X"
        },
      },
      {
        id: "ancLabels",
        header:
          "Oznaczenie pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["ancillary"]> =
            info.row.original.ancillary ?? []
          const txt = arr
            .map((p) => p.label)
            .filter(Boolean)
            .join("; ")
          return txt || "X"
        },
      },
      {
        id: "ancPrices",
        header:
          "Wyszczególnienie cen pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali [zł]",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["ancillary"]> =
            info.row.original.ancillary ?? []
          const txt = arr
            .map((p) =>
              typeof p.priceGross === "number" ? String(p.priceGross) : ""
            )
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "ancDates",
        header:
          "Data, od której obowiązuje cena wyszczególnionych pomieszczeń przynależnych, o których mowa w art. 2 ust. 4 ustawy z dnia 24 czerwca 1994 r. o własności lokali",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["ancillary"]> =
            info.row.original.ancillary ?? []
          const txt = arr
            .map((p) => p.effectiveFrom || "")
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "rightsNames",
        header:
          "Wyszczególnienie praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["rights"]> =
            info.row.original.rights ?? []
          const txt = arr
            .map((r) => r.name)
            .filter(Boolean)
            .join("; ")
          return txt || "X"
        },
      },
      {
        id: "rightsValues",
        header:
          "Wartość praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego [zł]",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["rights"]> =
            info.row.original.rights ?? []
          const txt = arr
            .map((r) =>
              typeof r.valueGross === "number" ? String(r.valueGross) : ""
            )
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "rightsDates",
        header:
          "Data, od której obowiązuje cena wartości praw niezbędnych do korzystania z lokalu mieszkalnego lub domu jednorodzinnego",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["rights"]> =
            info.row.original.rights ?? []
          const txt = arr
            .map((r) => r.effectiveFrom || "")
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "benefitsNames",
        header:
          "Wyszczególnienie rodzajów innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["otherBenefits"]> =
            info.row.original.otherBenefits ?? []
          const txt = arr
            .map((r) => r.name)
            .filter(Boolean)
            .join("; ")
          return txt || "X"
        },
      },
      {
        id: "benefitsValues",
        header:
          "Wartość innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność [zł]",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["otherBenefits"]> =
            info.row.original.otherBenefits ?? []
          const txt = arr
            .map((r) =>
              typeof r.valueGross === "number" ? String(r.valueGross) : ""
            )
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      {
        id: "benefitsDates",
        header:
          "Data, od której obowiązuje cena wartości innych świadczeń pieniężnych, które nabywca zobowiązany jest spełnić na rzecz dewelopera w wykonaniu umowy przenoszącej własność",
        cell: (info: CellContext<UnitRow, unknown>) => {
          const arr: NonNullable<UnitRow["otherBenefits"]> =
            info.row.original.otherBenefits ?? []
          const txt = arr
            .map((r) => r.effectiveFrom || "")
            .filter(Boolean)
            .join(", ")
          return txt || "X"
        },
      },
      columnHelper.accessor("prospectUrl", {
        header:
          "Adres strony internetowej, pod którym dostępny jest prospekt informacyjny",
        cell: (info: CellContext<UnitRow, string | undefined>) => (
          <input
            type="url"
            className="input w-full"
            value={info.getValue() ?? ""}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "prospectUrl",
                e.target.value
              )
            }
            placeholder="X"
          />
        ),
      }),
      columnHelper.accessor("rooms", {
        header: "Pokoje",
        cell: (info: CellContext<UnitRow, number>) => (
          <input
            type="number"
            className="input w-full"
            value={info.getValue() ?? 1}
            onChange={(e) =>
              updateCell(
                info.row.original._id ?? info.row.original.__key,
                "rooms",
                Number(e.target.value) || 1
              )
            }
          />
        ),
      }),
      columnHelper.accessor("availability", {
        header: "Status",
        cell: (
          info: CellContext<UnitRow, UnitRow["availability"] | undefined>
        ) => (
          <select
            className="input w-full"
            value={info.getValue() ?? "available"}
            onChange={(e) => {
              const v =
                (e.target.value as UnitRow["availability"]) || "available"
              setRows((prev) =>
                prev.map((r) =>
                  r._id === (info.row.original._id ?? "") ||
                  r.__key === info.row.original.__key
                    ? { ...r, availability: v, available: v === "available" }
                    : r
                )
              )
              setDirty(true)
            }}
          >
            <option value="available">Dostępny</option>
            <option value="reserved">Zarezerwowany</option>
            <option value="sold">Sprzedany</option>
          </select>
        ),
      }),
      {
        id: "actions",
        header: () => (
          <div className="inline-flex items-center gap-1">
            Akcje
            <InfoTooltip
              text={
                "• Edytuj: pola złożone (części, przynależne, prawa, inne świadczenia).\n• Duplikuj: tworzy kopię wiersza nad oryginałem.\n• Usuń: usuwa wiersz."
              }
              ariaLabel="Podpowiedź: akcje"
            />
          </div>
        ),
        cell: (info: CellContext<UnitRow, unknown>) => (
          <div className="flex gap-2">
            <button
              className="btn px-2 py-1 text-xs"
              onClick={() => openEditArrays(info.row.original)}
            >
              Edytuj
            </button>
            <InfoTooltip
              text={"Edytuj części, pomieszczenia, prawa i inne świadczenia."}
            />
            <button
              className="btn px-2 py-1 text-xs"
              onClick={() => handleDuplicateRow(info.row.original)}
            >
              Duplikuj
            </button>
            <InfoTooltip text={"Utwórz kopię wiersza nad oryginałem."} />
            <button
              className="btn px-2 py-1 text-xs"
              onClick={() => handleDeleteRow(info.row.original)}
            >
              Usuń
            </button>
          </div>
        ),
      },
    ],
    [
      columnHelper,
      updateCell,
      handleDeleteRow,
      openEditArrays,
      handleDuplicateRow,
      scheduleRecalc,
      setPriceWithDate,
      naturalCollator,
    ]
  )

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    getRowId: (row) => String(row._id ?? row.__key),
  })

  async function handleSave() {
    setError(null)
    const newRows = rows.filter((r) => !r._id)
    const existingRows = rows.filter((r) => r._id)

    const isNewValid = (r: UnitRow) =>
      (r.number || "").trim().length > 0 &&
      (r.areaM2 ?? 0) > 0 &&
      (r.rooms ?? 0) > 0

    // 1) Duplikaty numerów lokali (w obrębie tej inwestycji)
    const numbers = rows
      .map((r) => (r.number || "").trim())
      .filter((n) => n.length > 0)
    const counts = numbers.reduce<Record<string, number>>((acc, n) => {
      acc[n] = (acc[n] || 0) + 1
      return acc
    }, {})
    const duplicates = Object.keys(counts).filter((n) => counts[n] > 1)
    if (duplicates.length > 0) {
      setError(
        `Zduplikowane numery lokali: ${duplicates.join(
          ", "
        )}. Każdy lokal powinien mieć unikalny numer.`
      )
      return
    }

    // 2) Walidacja nowych wierszy (wymagane pola)
    const invalidNew = newRows.filter((r) => !isNewValid(r))
    if (invalidNew.length > 0) {
      setError(
        "Uzupełnij wymagane pola nowych lokali: numer, powierzchnia (> 0), pokoje (> 0). Usuń nieużywane wiersze lub uzupełnij dane."
      )
      return
    }

    const validNew = newRows.filter(isNewValid)

    try {
      const tasks: Promise<Response>[] = []
      for (const r of existingRows) {
        const availability = (r.availability ??
          (r.available ? "available" : "reserved")) as
          | "available"
          | "reserved"
          | "sold"
        const payload = {
          investmentId,
          number: (r.number ?? "").trim(),
          type: r.type === "house" ? ("house" as const) : ("flat" as const),
          // floor usunięty z payloadu
          areaM2: Number(r.areaM2) || 0,
          rooms: Number(r.rooms) || 1,
          available: availability === "available",
          availability,
          pricePerM2Gross: r.pricePerM2Gross ?? undefined,
          pricePerM2EffectiveFrom:
            r.pricePerM2EffectiveFrom && r.pricePerM2EffectiveFrom !== ""
              ? r.pricePerM2EffectiveFrom
              : undefined,
          basePriceGross: r.basePriceGross ?? undefined,
          basePriceEffectiveFrom:
            r.basePriceEffectiveFrom && r.basePriceEffectiveFrom !== ""
              ? r.basePriceEffectiveFrom
              : undefined,
          totalPriceGross: r.totalPriceGross ?? undefined,
          totalPriceEffectiveFrom:
            r.totalPriceEffectiveFrom && r.totalPriceEffectiveFrom !== ""
              ? r.totalPriceEffectiveFrom
              : undefined,
          prospectUrl: r.prospectUrl || undefined,
          parts: (r.parts ?? []).map((p) => ({
            kind: p.kind ?? "",
            label: p.label || undefined,
            priceGross:
              typeof p.priceGross === "number" ? p.priceGross : undefined,
            effectiveFrom: p.effectiveFrom || undefined,
          })),
          ancillary: (r.ancillary ?? []).map((p) => ({
            kind: p.kind ?? "",
            label: p.label || undefined,
            priceGross:
              typeof p.priceGross === "number" ? p.priceGross : undefined,
            effectiveFrom: p.effectiveFrom || undefined,
          })),
          rights: (r.rights ?? []).map((x) => ({
            name: x.name ?? "",
            valueGross:
              typeof x.valueGross === "number" ? x.valueGross : undefined,
            effectiveFrom: x.effectiveFrom || undefined,
          })),
          otherBenefits: (r.otherBenefits ?? []).map((x) => ({
            name: x.name ?? "",
            valueGross:
              typeof x.valueGross === "number" ? x.valueGross : undefined,
            effectiveFrom: x.effectiveFrom || undefined,
          })),
        }
        tasks.push(
          fetch(`/api/admin/units/${r._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        )
      }
      for (const r of validNew) {
        const availability = (r.availability ??
          (r.available ? "available" : "reserved")) as
          | "available"
          | "reserved"
          | "sold"
        const payload = {
          investmentId,
          number: (r.number ?? "").trim(),
          type: r.type === "house" ? ("house" as const) : ("flat" as const),
          // floor usunięty z payloadu
          areaM2: Number(r.areaM2) || 0,
          rooms: Number(r.rooms) || 1,
          available: availability === "available",
          availability,
          pricePerM2Gross: r.pricePerM2Gross ?? undefined,
          pricePerM2EffectiveFrom:
            r.pricePerM2EffectiveFrom && r.pricePerM2EffectiveFrom !== ""
              ? r.pricePerM2EffectiveFrom
              : undefined,
          basePriceGross: r.basePriceGross ?? undefined,
          basePriceEffectiveFrom:
            r.basePriceEffectiveFrom && r.basePriceEffectiveFrom !== ""
              ? r.basePriceEffectiveFrom
              : undefined,
          totalPriceGross: r.totalPriceGross ?? undefined,
          totalPriceEffectiveFrom:
            r.totalPriceEffectiveFrom && r.totalPriceEffectiveFrom !== ""
              ? r.totalPriceEffectiveFrom
              : undefined,
          prospectUrl: r.prospectUrl || undefined,
          parts: (r.parts ?? []).map((p) => ({
            kind: p.kind ?? "",
            label: p.label || undefined,
            priceGross:
              typeof p.priceGross === "number" ? p.priceGross : undefined,
            effectiveFrom: p.effectiveFrom || undefined,
          })),
          ancillary: (r.ancillary ?? []).map((p) => ({
            kind: p.kind ?? "",
            label: p.label || undefined,
            priceGross:
              typeof p.priceGross === "number" ? p.priceGross : undefined,
            effectiveFrom: p.effectiveFrom || undefined,
          })),
          rights: (r.rights ?? []).map((x) => ({
            name: x.name ?? "",
            valueGross:
              typeof x.valueGross === "number" ? x.valueGross : undefined,
            effectiveFrom: x.effectiveFrom || undefined,
          })),
          otherBenefits: (r.otherBenefits ?? []).map((x) => ({
            name: x.name ?? "",
            valueGross:
              typeof x.valueGross === "number" ? x.valueGross : undefined,
            effectiveFrom: x.effectiveFrom || undefined,
          })),
        }
        tasks.push(
          fetch(`/api/admin/units`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        )
      }

      const res = await Promise.all(tasks)
      const failed = res.filter((r) => !r.ok)
      if (failed.length > 0) {
        try {
          const first = failed[0]
          const data = await first.json().catch(() => null)
          const msg = Array.isArray(data?.message)
            ? data.message[0]
            : data?.message
          setError(
            msg ||
              "Nie udało się zapisać części zmian. Sprawdź duplikaty numerów i wymagane pola, a następnie spróbuj ponownie."
          )
        } catch {
          setError(
            "Nie udało się zapisać części zmian. Sprawdź duplikaty numerów i wymagane pola, a następnie spróbuj ponownie."
          )
        }
        return
      }

      const rr = await fetch(
        `/api/admin/units?investmentId=${encodeURIComponent(investmentId)}`
      )
      const d = (await rr.json()) as UnitApi[]
      setRows((d || []).map(fromApiToRow))
      setDirty(false)
      setError(null)
    } catch {
      setError("Nie udało się zapisać zmian.")
    }
  }

  function addRow() {
    setRows((prev) => [
      {
        __key: newKey(),
        number: "",
        type: "flat",
        areaM2: 0,
        rooms: 1,
        available: true,
        availability: "available",
      },
      ...prev,
    ])
    setDirty(true)
  }

  if (loading) return <div className="card">Ładowanie…</div>

  return (
    <div className="space-y-3 no-number-spinners">
      <div
        className="rounded-md border-l-4 p-3 text-sm text-black"
        style={{
          borderColor: "var(--accent)",
          background: "rgba(242,145,32,0.08)",
        }}
      >
        <div className="whitespace-normal break-words">
          <p className="font-bold flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden
              className="shrink-0"
            >
              <path
                d="M12 2a7 7 0 0 0-7 7c0 2.5 1.3 4.7 3.2 6l.3.3V18h7v-2.7l.3-.3A7 7 0 0 0 12 2z"
                fill="var(--accent)"
                stroke="#cc6f00"
                strokeWidth="1.2"
              />
              <path
                d="M9 18h6M10 22h4"
                fill="none"
                stroke="#cc6f00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Wskazówka: edycja cen, dat i pól złożonych</span>
          </p>
          <ul className="list-disc ml-5 mt-2">
            <li>
              Po dodaniu nowego lokalu, gdy wpiszesz cenę (za m², bazową lub
              całkowitą), odpowiednie pole „obowiązuje od” zostanie
              automatycznie ustawione na dzisiejszą datę. Daty nie są
              nadpisywane, gdy tylko czyścisz wartość.
            </li>
            <li>
              W polach złożonych (części, przynależne, prawa, inne świadczenia):
              dodanie nowej pozycji ustawia datę „obowiązuje od” na dziś; zmiana
              nazwy/rodzaju/ceny/wartości również aktualizuje tę datę.
              Wyczyszczenie liczbowej wartości nie zmienia daty.
            </li>
            <li>
              Przy powiązanych przeliczeniach cena bazowa ↔ cena za m² system
              aktualizuje także datę tego pola, które zostało automatycznie
              przeliczone.
            </li>
            <li>
              Pola dotyczące: części nieruchomości, pomieszczeń przynależnych,
              praw i innych świadczeń uzupełnia się w kolumnie{" "}
              <span className="font-medium">Akcje → Edytuj</span>
              (otwiera się okno „Edycja pól złożonych”).
            </li>
            <li>
              W oknie edycji dodawaj kolejne pozycje przyciskiem{" "}
              <span className="font-medium">Dodaj</span>, usuń zbędne{" "}
              <span className="font-medium">Usuń</span>. Ceny w PLN, daty w
              formacie RRRR-MM-DD.
            </li>
            <li>
              Po uzupełnieniu kliknij{" "}
              <span className="font-medium">Zapisz</span> w oknie edycji, a
              następnie
              <span className="font-medium"> Zapisz zmiany</span> nad tabelą,
              aby wysłać dane do API i XLSX.
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn" onClick={addRow}>
          Dodaj lokal
        </button>
        <button className="btn" disabled={!dirty} onClick={handleSave}>
          Zapisz zmiany
        </button>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-gray-600" htmlFor="units-search">
            Szukaj po numerze:
          </label>
          <input
            id="units-search"
            type="text"
            className="input"
            placeholder="np. 2, A-12, 10B"
            value={numberQuery}
            onChange={(e) => setNumberQuery(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="card overflow-hidden">
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full min-w-max text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="sticky top-0 z-10 bg-white px-2 py-2 text-left border-b text-xs leading-tight align-top max-w-[280px]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-1 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal edycji tablic */}
      {editingArrays && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-5xl max-h-[90vh] overflow-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edycja pól złożonych</h3>
              <button
                className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                onClick={closeEditArrays}
              >
                Zamknij
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Uzupełnij szczegóły dla: części nieruchomości (parts), pomieszczeń
              przynależnych (ancillary), praw (rights) i innych świadczeń
              (otherBenefits). Aby dodać kolejne pozycje użyj przycisku „Dodaj”.
              Pozostaw puste pole, aby je wyczyścić. Po zakończeniu kliknij
              „Zapisz”.
            </p>

            {/* Parts */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Części nieruchomości (parts)</h4>
                <button
                  className="btn px-2 py-1 text-xs"
                  onClick={() =>
                    setEditingArrays((prev) =>
                      prev
                        ? {
                            ...prev,
                            parts: [
                              ...prev.parts,
                              {
                                kind: "",
                                label: "",
                                priceGross: undefined,
                                effectiveFrom: todayStrLocal(),
                              },
                            ],
                          }
                        : prev
                    )
                  }
                >
                  Dodaj
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Rodzaj</th>
                      <th className="px-2 py-1 text-left">Oznaczenie</th>
                      <th className="px-2 py-1 text-left">Cena [zł]</th>
                      <th className="px-2 py-1 text-left">Data od</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingArrays.parts.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">
                          <input
                            className="input w-full"
                            value={item.kind}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      parts: prev.parts.map((p, i) => {
                                        if (i !== idx) return p
                                        const next = e.target.value
                                        if (p.kind === next) return p
                                        return {
                                          ...p,
                                          kind: next,
                                          effectiveFrom: todayStrLocal(),
                                        }
                                      }),
                                    }
                                  : prev
                              )
                            }
                            placeholder="np. komórka lok."
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            className="input w-full"
                            value={item.label ?? ""}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      parts: prev.parts.map((p, i) => {
                                        if (i !== idx) return p
                                        const next = e.target.value
                                        if ((p.label ?? "") === next) return p
                                        return {
                                          ...p,
                                          label: next,
                                          effectiveFrom: todayStrLocal(),
                                        }
                                      }),
                                    }
                                  : prev
                              )
                            }
                            placeholder="oznaczenie"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="relative inline-flex items-center w-full">
                            <input
                              type="number"
                              className="input w-full pr-10"
                              value={item.priceGross ?? ""}
                              onChange={(e) =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        parts: prev.parts.map((p, i) => {
                                          if (i !== idx) return p
                                          const next =
                                            e.target.value === ""
                                              ? undefined
                                              : Number(e.target.value)
                                          if (p.priceGross === next) return p
                                          return {
                                            ...p,
                                            priceGross: next,
                                            effectiveFrom: todayStrLocal(),
                                          }
                                        }),
                                      }
                                    : prev
                                )
                              }
                              onBlur={() =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        parts: prev.parts.map((p, i) =>
                                          i === idx &&
                                          typeof p.priceGross === "number"
                                            ? {
                                                ...p,
                                                priceGross: round2(
                                                  p.priceGross!
                                                ),
                                              }
                                            : p
                                        ),
                                      }
                                    : prev
                                )
                              }
                              placeholder="0.00"
                            />
                            <span className="absolute right-2 text-[10px] text-gray-500">
                              PLN
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="date"
                            className="input w-full"
                            value={item.effectiveFrom ?? ""}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      parts: prev.parts.map((p, i) =>
                                        i === idx
                                          ? {
                                              ...p,
                                              effectiveFrom:
                                                e.target.value === ""
                                                  ? undefined
                                                  : e.target.value,
                                            }
                                          : p
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            className="btn px-2 py-1 text-xs"
                            onClick={() =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      parts: prev.parts.filter(
                                        (_, i) => i !== idx
                                      ),
                                    }
                                  : prev
                              )
                            }
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Ancillary */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Pomieszczenia przynależne (ancillary)
                </h4>
                <button
                  className="btn px-2 py-1 text-xs"
                  onClick={() =>
                    setEditingArrays((prev) =>
                      prev
                        ? {
                            ...prev,
                            ancillary: [
                              ...prev.ancillary,
                              {
                                kind: "",
                                label: "",
                                priceGross: undefined,
                                effectiveFrom: todayStrLocal(),
                              },
                            ],
                          }
                        : prev
                    )
                  }
                >
                  Dodaj
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Rodzaj</th>
                      <th className="px-2 py-1 text-left">Oznaczenie</th>
                      <th className="px-2 py-1 text-left">Cena [zł]</th>
                      <th className="px-2 py-1 text-left">Data od</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingArrays.ancillary.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">
                          <input
                            className="input w-full"
                            value={item.kind}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      ancillary: prev.ancillary.map((p, i) => {
                                        if (i !== idx) return p
                                        const next = e.target.value
                                        if (p.kind === next) return p
                                        return {
                                          ...p,
                                          kind: next,
                                          effectiveFrom: todayStrLocal(),
                                        }
                                      }),
                                    }
                                  : prev
                              )
                            }
                            placeholder="np. komórka lok."
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            className="input w-full"
                            value={item.label ?? ""}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      ancillary: prev.ancillary.map((p, i) => {
                                        if (i !== idx) return p
                                        const next = e.target.value
                                        if ((p.label ?? "") === next) return p
                                        return {
                                          ...p,
                                          label: next,
                                          effectiveFrom: todayStrLocal(),
                                        }
                                      }),
                                    }
                                  : prev
                              )
                            }
                            placeholder="oznaczenie"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="relative inline-flex items-center w-full">
                            <input
                              type="number"
                              className="input w-full pr-10"
                              value={item.priceGross ?? ""}
                              onChange={(e) =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        ancillary: prev.ancillary.map(
                                          (p, i) => {
                                            if (i !== idx) return p
                                            const next =
                                              e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value)
                                            if (p.priceGross === next) return p
                                            return {
                                              ...p,
                                              priceGross: next,
                                              effectiveFrom: todayStrLocal(),
                                            }
                                          }
                                        ),
                                      }
                                    : prev
                                )
                              }
                              onBlur={() =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        ancillary: prev.ancillary.map((p, i) =>
                                          i === idx &&
                                          typeof p.priceGross === "number"
                                            ? {
                                                ...p,
                                                priceGross: round2(
                                                  p.priceGross!
                                                ),
                                              }
                                            : p
                                        ),
                                      }
                                    : prev
                                )
                              }
                              placeholder="0.00"
                            />
                            <span className="absolute right-2 text-[10px] text-gray-500">
                              PLN
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="date"
                            className="input w-full"
                            value={item.effectiveFrom ?? ""}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      ancillary: prev.ancillary.map((p, i) =>
                                        i === idx
                                          ? {
                                              ...p,
                                              effectiveFrom:
                                                e.target.value === ""
                                                  ? undefined
                                                  : e.target.value,
                                            }
                                          : p
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            className="btn px-2 py-1 text-xs"
                            onClick={() =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      ancillary: prev.ancillary.filter(
                                        (_, i) => i !== idx
                                      ),
                                    }
                                  : prev
                              )
                            }
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rights */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Prawa (rights)</h4>
                <button
                  className="btn px-2 py-1 text-xs"
                  onClick={() =>
                    setEditingArrays((prev) =>
                      prev
                        ? {
                            ...prev,
                            rights: [
                              ...prev.rights,
                              {
                                name: "",
                                valueGross: undefined,
                                effectiveFrom: todayStrLocal(),
                              },
                            ],
                          }
                        : prev
                    )
                  }
                >
                  Dodaj
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Nazwa</th>
                      <th className="px-2 py-1 text-left">Wartość [zł]</th>
                      <th className="px-2 py-1 text-left">Data od</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingArrays.rights.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">
                          <input
                            className="input w-full"
                            value={item.name}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      rights: prev.rights.map((p, i) => {
                                        if (i !== idx) return p
                                        const next = e.target.value
                                        if (p.name === next) return p
                                        return {
                                          ...p,
                                          name: next,
                                          effectiveFrom: todayStrLocal(),
                                        }
                                      }),
                                    }
                                  : prev
                              )
                            }
                            placeholder="np. prawo do korzystania z..."
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="relative inline-flex items-center w-full">
                            <input
                              type="number"
                              className="input w-full pr-10"
                              value={item.valueGross ?? ""}
                              onChange={(e) =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        rights: prev.rights.map((p, i) => {
                                          if (i !== idx) return p
                                          const next =
                                            e.target.value === ""
                                              ? undefined
                                              : Number(e.target.value)
                                          if (p.valueGross === next) return p
                                          return {
                                            ...p,
                                            valueGross: next,
                                            effectiveFrom: todayStrLocal(),
                                          }
                                        }),
                                      }
                                    : prev
                                )
                              }
                              onBlur={() =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        rights: prev.rights.map((p, i) =>
                                          i === idx &&
                                          typeof p.valueGross === "number"
                                            ? {
                                                ...p,
                                                valueGross: round2(
                                                  p.valueGross!
                                                ),
                                              }
                                            : p
                                        ),
                                      }
                                    : prev
                                )
                              }
                              placeholder="0.00"
                            />
                            <span className="absolute right-2 text-[10px] text-gray-500">
                              PLN
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="date"
                            className="input w-full"
                            value={item.effectiveFrom ?? ""}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      rights: prev.rights.map((p, i) =>
                                        i === idx
                                          ? {
                                              ...p,
                                              effectiveFrom:
                                                e.target.value === ""
                                                  ? undefined
                                                  : e.target.value,
                                            }
                                          : p
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            className="btn px-2 py-1 text-xs"
                            onClick={() =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      rights: prev.rights.filter(
                                        (_, i) => i !== idx
                                      ),
                                    }
                                  : prev
                              )
                            }
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Other benefits */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Inne świadczenia pieniężne (otherBenefits)
                </h4>
                <button
                  className="btn px-2 py-1 text-xs"
                  onClick={() =>
                    setEditingArrays((prev) =>
                      prev
                        ? {
                            ...prev,
                            otherBenefits: [
                              ...prev.otherBenefits,
                              {
                                name: "",
                                valueGross: undefined,
                                effectiveFrom: todayStrLocal(),
                              },
                            ],
                          }
                        : prev
                    )
                  }
                >
                  Dodaj
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Nazwa</th>
                      <th className="px-2 py-1 text-left">Wartość [zł]</th>
                      <th className="px-2 py-1 text-left">Data od</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingArrays.otherBenefits.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">
                          <input
                            className="input w-full"
                            value={item.name}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      otherBenefits: prev.otherBenefits.map(
                                        (p, i) => {
                                          if (i !== idx) return p
                                          const next = e.target.value
                                          if (p.name === next) return p
                                          return {
                                            ...p,
                                            name: next,
                                            effectiveFrom: todayStrLocal(),
                                          }
                                        }
                                      ),
                                    }
                                  : prev
                              )
                            }
                            placeholder="np. opłata za..."
                          />
                        </td>
                        <td className="px-2 py-1">
                          <div className="relative inline-flex items-center w-full">
                            <input
                              type="number"
                              className="input w-full pr-10"
                              value={item.valueGross ?? ""}
                              onChange={(e) =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        otherBenefits: prev.otherBenefits.map(
                                          (p, i) => {
                                            if (i !== idx) return p
                                            const next =
                                              e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value)
                                            if (p.valueGross === next) return p
                                            return {
                                              ...p,
                                              valueGross: next,
                                              effectiveFrom: todayStrLocal(),
                                            }
                                          }
                                        ),
                                      }
                                    : prev
                                )
                              }
                              onBlur={() =>
                                setEditingArrays((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        otherBenefits: prev.otherBenefits.map(
                                          (p, i) =>
                                            i === idx &&
                                            typeof p.valueGross === "number"
                                              ? {
                                                  ...p,
                                                  valueGross: round2(
                                                    p.valueGross!
                                                  ),
                                                }
                                              : p
                                        ),
                                      }
                                    : prev
                                )
                              }
                              placeholder="0.00"
                            />
                            <span className="absolute right-2 text-[10px] text-gray-500">
                              PLN
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="date"
                            className="input w-full"
                            value={item.effectiveFrom ?? ""}
                            onChange={(e) =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      otherBenefits: prev.otherBenefits.map(
                                        (p, i) =>
                                          i === idx
                                            ? {
                                                ...p,
                                                effectiveFrom:
                                                  e.target.value === ""
                                                    ? undefined
                                                    : e.target.value,
                                              }
                                            : p
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            className="btn px-2 py-1 text-xs"
                            onClick={() =>
                              setEditingArrays((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      otherBenefits: prev.otherBenefits.filter(
                                        (_, i) => i !== idx
                                      ),
                                    }
                                  : prev
                              )
                            }
                          >
                            Usuń
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
                onClick={closeEditArrays}
              >
                Anuluj
              </button>
              <button className="btn" onClick={saveEditArrays}>
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
