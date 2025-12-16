"use client"

import { InfoTooltip } from "@/components/ui/Tooltip"
import { useEffect, useState } from "react"

type SalesAddress = {
  woj?: string
  pow?: string
  gmi?: string
  miasto?: string
  ulica?: string
  nrNieruchomosci?: string
  nrLokalu?: string
  kodPocztowy?: string
}

type CreateInvestmentPayload = {
  developerId: string
  name: string
  address?: string
  city?: string
  lokalizacja?: Omit<SalesAddress, "nrLokalu">
  sprzedaz?: SalesAddress
  sprzedazDodatkowe?: string[]
  contactMethods?: string[]
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

export default function AddInvestmentModal({
  onCreated,
  initialDeveloperId,
  lockedDeveloperId,
}: {
  onCreated: (created?: unknown) => void
  initialDeveloperId?: string
  lockedDeveloperId?: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [developerId, setDeveloperId] = useState(
    lockedDeveloperId || initialDeveloperId || ""
  )
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")

  const [lok, setLok] = useState({
    woj: "",
    pow: "",
    gmi: "",
    miasto: "",
    ulica: "",
    nrNieruchomosci: "",
    kodPocztowy: "",
  })
  const [sprz, setSprz] = useState({
    woj: "",
    pow: "",
    gmi: "",
    miasto: "",
    ulica: "",
    nrNieruchomosci: "",
    nrLokalu: "",
    kodPocztowy: "",
  })
  const [sprzDod, setSprzDod] = useState<string>("")
  const [contact, setContact] = useState<string>("")
  const [devs, setDevs] = useState<Array<{ _id: string; name: string }>>([])

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/admin/developers", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setDevs(Array.isArray(d) ? d : []))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (lockedDeveloperId) setDeveloperId(lockedDeveloperId)
  }, [lockedDeveloperId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!developerId || !name.trim()) {
      setError("Wybierz dewelopera i podaj nazwę")
      return
    }
    setLoading(true)
    try {
      const payload: CreateInvestmentPayload = {
        developerId,
        name: name.trim(),
        address: address || undefined,
        city: city || undefined,
      }
      const nz = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined)
      const hasLok = Object.values(lok).some((v) => nz(v))
      if (hasLok)
        payload.lokalizacja = {
          woj: nz(lok.woj),
          pow: nz(lok.pow),
          gmi: nz(lok.gmi),
          miasto: nz(lok.miasto),
          ulica: nz(lok.ulica),
          nrNieruchomosci: nz(lok.nrNieruchomosci),
          kodPocztowy: nz(lok.kodPocztowy),
        }
      const hasSprz = Object.values(sprz).some((v) => nz(v))
      if (hasSprz)
        payload.sprzedaz = {
          woj: nz(sprz.woj),
          pow: nz(sprz.pow),
          gmi: nz(sprz.gmi),
          miasto: nz(sprz.miasto),
          ulica: nz(sprz.ulica),
          nrNieruchomosci: nz(sprz.nrNieruchomosci),
          nrLokalu: nz(sprz.nrLokalu),
          kodPocztowy: nz(sprz.kodPocztowy),
        }
      const sprzDodArr = sprzDod
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      if (sprzDodArr.length) payload.sprzedazDodatkowe = sprzDodArr
      const contactArr = contact
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      if (contactArr.length) payload.contactMethods = contactArr

      const res = await fetch("/api/admin/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data: unknown = await res.json().catch(() => ({}))
      const msg =
        typeof data === "object" && data && "message" in data
          ? String((data as Record<string, unknown>).message)
          : undefined
      if (!res.ok) throw new Error(msg || "Błąd tworzenia")
      setOpen(false)
      setName("")
      setAddress("")
      setCity("")
      setLok({
        woj: "",
        pow: "",
        gmi: "",
        miasto: "",
        ulica: "",
        nrNieruchomosci: "",
        kodPocztowy: "",
      })
      setSprz({
        woj: "",
        pow: "",
        gmi: "",
        miasto: "",
        ulica: "",
        nrNieruchomosci: "",
        nrLokalu: "",
        kodPocztowy: "",
      })
      setSprzDod("")
      setContact("")
      onCreated(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Błąd")
    } finally {
      setLoading(false)
    }
  }

  const lockedDevName = lockedDeveloperId
    ? devs.find((d) => d._id === lockedDeveloperId)?.name || lockedDeveloperId
    : undefined

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Dodaj inwestycję
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card card-lg w-full max-w-3xl relative max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nowa inwestycja</h2>
              <button
                onClick={() => setOpen(false)}
                className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
              >
                Zamknij
              </button>
            </div>
            <div className="mt-4 overflow-y-auto flex-1">
              <form
                onSubmit={submit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {lockedDeveloperId ? (
                  <Field label="Deweloper">
                    <input
                      className="input"
                      value={lockedDevName || "—"}
                      disabled
                    />
                  </Field>
                ) : (
                  <Field label="Deweloper">
                    <select
                      className="input"
                      value={developerId}
                      onChange={(e) => setDeveloperId(e.target.value)}
                      required
                    >
                      <option value="">— wybierz —</option>
                      {devs.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Nazwa">
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Miasto">
                  <input
                    className="input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field>
                <Field label="Adres (tekst)">
                  <input
                    className="input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Field>

                <div className="sm:col-span-2 mt-2">
                  <h3 className="font-medium">Lokalizacja inwestycji</h3>
                </div>
                <Field
                  label="Województwo"
                  hint="XLSX: Województwo lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.woj}
                    onChange={(e) => setLok({ ...lok, woj: e.target.value })}
                  />
                </Field>
                <Field
                  label="Powiat"
                  hint="XLSX: Powiat lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.pow}
                    onChange={(e) => setLok({ ...lok, pow: e.target.value })}
                  />
                </Field>
                <Field
                  label="Gmina"
                  hint="XLSX: Gmina lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.gmi}
                    onChange={(e) => setLok({ ...lok, gmi: e.target.value })}
                  />
                </Field>
                <Field
                  label="Miejscowość"
                  hint="XLSX: Miejscowość lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.miasto}
                    onChange={(e) => setLok({ ...lok, miasto: e.target.value })}
                  />
                </Field>
                <Field
                  label="Ulica"
                  hint="XLSX: Ulica lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.ulica}
                    onChange={(e) => setLok({ ...lok, ulica: e.target.value })}
                  />
                </Field>
                <Field
                  label="Nr nieruchomości"
                  hint="XLSX: Nr nieruchomości lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.nrNieruchomosci}
                    onChange={(e) =>
                      setLok({ ...lok, nrNieruchomosci: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Kod pocztowy"
                  hint="XLSX: Kod pocztowy lokalizacji przedsięwzięcia…"
                >
                  <input
                    className="input"
                    value={lok.kodPocztowy}
                    onChange={(e) =>
                      setLok({ ...lok, kodPocztowy: e.target.value })
                    }
                  />
                </Field>

                <div className="sm:col-span-2 mt-2">
                  <h3 className="font-medium">
                    Sprzedaż i kontakt (opcjonalnie, nadpisuje dane dewelopera)
                  </h3>
                </div>
                <Field
                  label="Województwo"
                  hint="XLSX: Województwo adresu lokalu sprzedaży"
                >
                  <input
                    className="input"
                    value={sprz.woj}
                    onChange={(e) => setSprz({ ...sprz, woj: e.target.value })}
                  />
                </Field>
                <Field
                  label="Powiat"
                  hint="XLSX: Powiat adresu lokalu sprzedaży"
                >
                  <input
                    className="input"
                    value={sprz.pow}
                    onChange={(e) => setSprz({ ...sprz, pow: e.target.value })}
                  />
                </Field>
                <Field label="Gmina" hint="XLSX: Gmina adresu lokalu sprzedaży">
                  <input
                    className="input"
                    value={sprz.gmi}
                    onChange={(e) => setSprz({ ...sprz, gmi: e.target.value })}
                  />
                </Field>
                <Field
                  label="Miejscowość"
                  hint="XLSX: Miejscowość adresu lokalu sprzedaży"
                >
                  <input
                    className="input"
                    value={sprz.miasto}
                    onChange={(e) =>
                      setSprz({ ...sprz, miasto: e.target.value })
                    }
                  />
                </Field>
                <Field label="Ulica" hint="XLSX: Ulica adresu lokalu sprzedaży">
                  <input
                    className="input"
                    value={sprz.ulica}
                    onChange={(e) =>
                      setSprz({ ...sprz, ulica: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Nr nieruchomości"
                  hint="XLSX: Nr nieruchomości adresu lokalu sprzedaży"
                >
                  <input
                    className="input"
                    value={sprz.nrNieruchomosci}
                    onChange={(e) =>
                      setSprz({ ...sprz, nrNieruchomosci: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Nr lokalu"
                  hint="XLSX: Nr lokalu adresu lokalu sprzedaży"
                >
                  <input
                    className="input"
                    value={sprz.nrLokalu}
                    onChange={(e) =>
                      setSprz({ ...sprz, nrLokalu: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Kod pocztowy"
                  hint="XLSX: Kod pocztowy adresu lokalu sprzedaży"
                >
                  <input
                    className="input"
                    value={sprz.kodPocztowy}
                    onChange={(e) =>
                      setSprz({ ...sprz, kodPocztowy: e.target.value })
                    }
                  />
                </Field>

                <Field
                  label="Dodatkowe lokalizacje sprzedaży (po jednej na linię)"
                  hint="XLSX: Dodatkowe lokalizacje, w których prowadzona jest sprzedaż"
                >
                  <textarea
                    className="input min-h-20"
                    value={sprzDod}
                    onChange={(e) => setSprzDod(e.target.value)}
                  />
                </Field>
                <Field
                  label="Sposoby kontaktu (po jednym na linię)"
                  hint="XLSX: Sposób kontaktu nabywcy z deweloperem"
                >
                  <textarea
                    className="input min-h-20"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </Field>

                {error && (
                  <div className="sm:col-span-2 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setOpen(false)}
                  >
                    Anuluj
                  </button>
                  <button disabled={loading} className="btn btn-primary">
                    {loading ? "Zapisywanie…" : "Zapisz"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
