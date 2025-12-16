"use client"

import { InfoTooltip } from "@/components/ui/Tooltip"
import { useEffect, useState } from "react"

type Sales = {
  woj?: string
  pow?: string
  gmi?: string
  miasto?: string
  ulica?: string
  nrNieruchomosci?: string
  nrLokalu?: string
  kodPocztowy?: string
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium">
        {label}
        {hint ? (
          <InfoTooltip text={hint} ariaLabel={`Podpowiedź: ${label}`} />
        ) : null}
      </label>
      {children}
    </div>
  )
}

export default function InvestmentSalesForm({
  investmentId,
}: {
  investmentId: string
}) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [name, setName] = useState<string>("")
  const [sprzedaz, setSprzedaz] = useState<Sales>({})
  const [sprzedazDodatkowe, setSprzedazDodatkowe] = useState<string[]>([])
  const [contactMethods, setContactMethods] = useState<string[]>([])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/admin/investments/${investmentId}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((d: unknown) => {
        const obj =
          typeof d === "object" && d ? (d as Record<string, unknown>) : {}
        setName(typeof obj.name === "string" ? obj.name : "")
        setSprzedaz(
          typeof obj.sprzedaz === "object" && obj.sprzedaz
            ? (obj.sprzedaz as Sales)
            : {}
        )
        setSprzedazDodatkowe(
          Array.isArray(obj.sprzedazDodatkowe)
            ? (obj.sprzedazDodatkowe as string[])
            : []
        )
        setContactMethods(
          Array.isArray(obj.contactMethods)
            ? (obj.contactMethods as string[])
            : []
        )
        setError(null)
      })
      .catch(() => setError("Nie udało się pobrać danych inwestycji."))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [investmentId])

  function textareaFromArray(arr: string[]) {
    return (arr || []).join("\n")
  }

  function arrayFromTextarea(s: string) {
    return (s || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const nz = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined)
      const cleanSprz: Sales = {
        woj: nz(sprzedaz.woj),
        pow: nz(sprzedaz.pow),
        gmi: nz(sprzedaz.gmi),
        miasto: nz(sprzedaz.miasto),
        ulica: nz(sprzedaz.ulica),
        nrNieruchomosci: nz(sprzedaz.nrNieruchomosci),
        nrLokalu: nz(sprzedaz.nrLokalu),
        kodPocztowy: nz(sprzedaz.kodPocztowy),
      }
      const hasAny = Object.values(cleanSprz).some((v) => !!v)

      const payload: {
        sprzedaz?: Sales
        sprzedazDodatkowe?: string[]
        contactMethods?: string[]
      } = {
        sprzedaz: hasAny ? cleanSprz : undefined,
        sprzedazDodatkowe: sprzedazDodatkowe.length
          ? sprzedazDodatkowe
          : undefined,
        contactMethods: contactMethods.length ? contactMethods : undefined,
      }

      const res = await fetch(`/api/admin/investments/${investmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data: unknown = await res.json().catch(() => ({}))
      const msg =
        typeof data === "object" && data && "message" in data
          ? String((data as Record<string, unknown>).message)
          : undefined
      if (!res.ok) throw new Error(msg || "Błąd zapisu")
      setNotice("Zapisano zmiany.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się zapisać zmian.")
    } finally {
      setSaving(false)
    }
  }

  function handleResetToFallback() {
    setSprzedaz({})
    setSprzedazDodatkowe([])
    setContactMethods([])
    setNotice(
      "Wyczyszczono pola (obowiązuje fallback do danych dewelopera po zapisaniu)."
    )
  }

  if (loading) return <div className="card">Ładowanie…</div>

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">{name || "Inwestycja"}</h2>
          <p className="text-sm muted">
            Edycja pól sprzedaż/kontakt na poziomie inwestycji.
          </p>
          <div
            className="mt-2 text-sm rounded-md border-l-4 pl-3 py-2 flex items-center gap-2 font-bold text-black"
            style={{
              borderColor: "var(--accent)",
              background: "rgba(242,145,32,0.08)",
            }}
          >
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
            <span>
              Jeżeli miejsce sprzedaży realizowanej inwestycji jest
              <span className="underline"> inne </span>
              niż siedziba dewelopera, uzupełnij te pola.
            </span>
          </div>
        </div>
        <button type="button" className="btn" onClick={handleResetToFallback}>
          Wyczyść pola
        </button>
      </header>

      {notice && <div className="text-sm text-green-700">{notice}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <form
        onSubmit={handleSave}
        className="card grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <div className="sm:col-span-2">
          <h3 className="font-medium">Sprzedaż</h3>
        </div>
        <Field
          label="Województwo"
          hint="XLSX: Województwo adresu lokalu sprzedaży"
        >
          <input
            className="input"
            value={sprzedaz.woj || ""}
            onChange={(e) => setSprzedaz({ ...sprzedaz, woj: e.target.value })}
          />
        </Field>
        <Field label="Powiat" hint="XLSX: Powiat adresu lokalu sprzedaży">
          <input
            className="input"
            value={sprzedaz.pow || ""}
            onChange={(e) => setSprzedaz({ ...sprzedaz, pow: e.target.value })}
          />
        </Field>
        <Field label="Gmina" hint="XLSX: Gmina adresu lokalu sprzedaży">
          <input
            className="input"
            value={sprzedaz.gmi || ""}
            onChange={(e) => setSprzedaz({ ...sprzedaz, gmi: e.target.value })}
          />
        </Field>
        <Field
          label="Miejscowość"
          hint="XLSX: Miejscowość adresu lokalu sprzedaży"
        >
          <input
            className="input"
            value={sprzedaz.miasto || ""}
            onChange={(e) =>
              setSprzedaz({ ...sprzedaz, miasto: e.target.value })
            }
          />
        </Field>
        <Field label="Ulica" hint="XLSX: Ulica adresu lokalu sprzedaży">
          <input
            className="input"
            value={sprzedaz.ulica || ""}
            onChange={(e) =>
              setSprzedaz({ ...sprzedaz, ulica: e.target.value })
            }
          />
        </Field>
        <Field
          label="Nr nieruchomości"
          hint="XLSX: Nr nieruchomości adresu lokalu sprzedaży"
        >
          <input
            className="input"
            value={sprzedaz.nrNieruchomosci || ""}
            onChange={(e) =>
              setSprzedaz({ ...sprzedaz, nrNieruchomosci: e.target.value })
            }
          />
        </Field>
        <Field label="Nr lokalu" hint="XLSX: Nr lokalu adresu lokalu sprzedaży">
          <input
            className="input"
            value={sprzedaz.nrLokalu || ""}
            onChange={(e) =>
              setSprzedaz({ ...sprzedaz, nrLokalu: e.target.value })
            }
          />
        </Field>
        <Field
          label="Kod pocztowy"
          hint="XLSX: Kod pocztowy adresu lokalu sprzedaży"
        >
          <input
            className="input"
            value={sprzedaz.kodPocztowy || ""}
            onChange={(e) =>
              setSprzedaz({ ...sprzedaz, kodPocztowy: e.target.value })
            }
          />
        </Field>

        <Field
          label="Dodatkowe lokalizacje sprzedaży (po jednej na linię)"
          hint="XLSX: Dodatkowe lokalizacje, w których prowadzona jest sprzedaż"
        >
          <textarea
            className="input min-h-20"
            value={textareaFromArray(sprzedazDodatkowe)}
            onChange={(e) =>
              setSprzedazDodatkowe(arrayFromTextarea(e.target.value))
            }
          />
        </Field>
        <Field
          label="Sposoby kontaktu (po jednym na linię)"
          hint="XLSX: Sposób kontaktu nabywcy z deweloperem"
        >
          <textarea
            className="input min-h-20"
            value={textareaFromArray(contactMethods)}
            onChange={(e) =>
              setContactMethods(arrayFromTextarea(e.target.value))
            }
          />
        </Field>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Zapisywanie…" : "Zapisz"}
          </button>
        </div>
      </form>
    </section>
  )
}
