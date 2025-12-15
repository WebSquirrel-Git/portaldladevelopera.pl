"use client"

import BackButton from "@/components/ui/BackButton"
import { InfoTooltip } from "@/components/ui/Tooltip"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type DeveloperAddress = Record<string, string>

type Developer = {
  _id: string
  name: string
  nip?: string
  regon?: string
  krs?: string
  email?: string
  phone?: string
  website?: string
  legalForm?: string
  fax?: string
  ceidg?: string
  siedziba?: DeveloperAddress
  sprzedaz?: DeveloperAddress
  sprzedazDodatkowe?: string[]
  contactMethods?: string[]
}

type ValidationErrors = Partial<{
  name: string
  nip: string
  regon: string
  email: string
  website: string
}>

export default function DeveloperDetails() {
  const params = useParams<{ id: string }>()
  const id = params?.id as string
  const [item, setItem] = useState<Developer | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<Developer>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vErrs, setVErrs] = useState<ValidationErrors>({})

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/admin/developers/${id}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        const dev: Developer | null = d && d._id ? d : null
        setItem(dev)
        setForm(dev || {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  function onChange<K extends keyof Developer>(key: K, value: Developer[K]) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  const validate = (f: Partial<Developer>): ValidationErrors => {
    const errs: ValidationErrors = {}
    const toDigits = (v?: string) => {
      if (!v) return undefined
      const s = v.replace(/\D+/g, "")
      return s || undefined
    }
    const isEmail = (v?: string) => !v || /.+@.+\..+/.test(v.trim())
    const isUrl = (v?: string) => {
      if (!v || v.trim() === "") return true
      try {
        const vv = v.match(/^https?:\/\//i) ? v : `https://${v}`
        new URL(vv)
        return true
      } catch {
        return false
      }
    }

    if (!f.name || f.name.trim() === "") errs.name = "Nazwa jest wymagana"
    const nipDigits = toDigits(f.nip)
    if (!nipDigits || nipDigits.length !== 10)
      errs.nip = "NIP musi zawierać dokładnie 10 cyfr"
    const regonDigits = toDigits(f.regon)
    if (f.regon && (!regonDigits || regonDigits.length !== 9))
      errs.regon = "REGON musi zawierać dokładnie 9 cyfr"
    if (!isEmail(f.email)) errs.email = "Niepoprawny adres e-mail"
    if (!isUrl(f.website))
      errs.website = "Niepoprawny adres WWW (spróbuj z https://)"

    return errs
  }

  const save = async () => {
    if (!id) return
    setSaving(true)
    setError(null)

    const ve = validate(form)
    if (Object.keys(ve).length > 0) {
      setVErrs(ve)
      setSaving(false)
      setError("Popraw wskazane pola i spróbuj ponownie")
      return
    }

    const toDefined = (v?: string) =>
      v && v.trim() !== "" ? v.trim() : undefined
    const toDigits = (v?: string) => {
      if (!v) return undefined
      const s = v.replace(/\D+/g, "")
      return s || undefined
    }
    const sanitizeAddress = (obj?: DeveloperAddress) => {
      if (!obj) return undefined as undefined | DeveloperAddress
      const allowed = [
        "woj",
        "pow",
        "gmi",
        "miasto",
        "ulica",
        "nrNieruchomosci",
        "nrLokalu",
        "kodPocztowy",
      ] as const
      const src = obj as Record<string, string | undefined>
      const res: Record<string, string> = {}
      for (const k of allowed) {
        const val = src[k]
        if (typeof val === "string" && val.trim() !== "") res[k] = val.trim()
      }
      return Object.keys(res).length ? (res as DeveloperAddress) : undefined
    }

    const payload = {
      name: toDefined(form.name),
      nip: toDigits(form.nip),
      regon: toDigits(form.regon),
      krs: toDefined(form.krs),
      email: toDefined(form.email),
      phone: toDefined(form.phone),
      website: toDefined(form.website),
      legalForm: toDefined(form.legalForm),
      fax: toDefined(form.fax),
      ceidg: toDigits(form.ceidg),
      siedziba: sanitizeAddress(form.siedziba),
      sprzedaz: sanitizeAddress(form.sprzedaz),
      sprzedazDodatkowe: Array.isArray(form.sprzedazDodatkowe)
        ? form.sprzedazDodatkowe.filter((s) => !!s && s.trim() !== "")
        : undefined,
      contactMethods: Array.isArray(form.contactMethods)
        ? form.contactMethods.filter((s) => !!s && s.trim() !== "")
        : undefined,
    }

    try {
      const res = await fetch(`/api/admin/developers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.message
        if (Array.isArray(msg) && msg.length) setError(msg[0])
        else setError("Nie udało się zapisać zmian")
        return
      }
      const d: Developer = await res.json()
      setItem(d)
      setForm(d)
      setVErrs({})
      setEditing(false)
    } catch {
      setError("Nie udało się zapisać zmian")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="space-y-3">
        <div className="h-6 w-48 bg-white/70 animate-pulse rounded" />
        <div className="h-28 bg-white/70 animate-pulse rounded" />
      </main>
    )
  }
  if (!item) {
    return (
      <main className="space-y-3">
        <BackButton className="mt-2" />
        <p className="text-sm text-black/60 dark:text-white/60">
          Nie znaleziono dewelopera.
        </p>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <BackButton className="mt-2" />
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">
            {editing ? (
              <div>
                <input
                  className="input"
                  value={form.name || ""}
                  onChange={(e) => {
                    onChange("name", e.target.value)
                    setVErrs((p) => ({ ...p, name: undefined }))
                  }}
                />
                {vErrs.name && (
                  <p className="mt-1 text-xs text-red-600">{vErrs.name}</p>
                )}
              </div>
            ) : (
              item.name
            )}
          </h1>
          <p className="mt-1 text-sm muted">Szczegóły dewelopera</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!editing ? (
            <button
              className="btn px-3 py-2"
              style={{
                background: "color-mix(in oklab, var(--accent) 12%, white)",
                borderColor: "var(--accent)",
              }}
              onClick={() => setEditing(true)}
            >
              Edytuj
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="btn"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card card-lg">
          <h2 className="font-medium mb-2">Dane rejestrowe</h2>
          <dl className="text-sm space-y-2">
            {editing ? (
              <Field
                label="NIP"
                hint="10 cyfr, bez spacji i myślników (XLSX: NIP)"
              >
                <div>
                  <input
                    value={form.nip || ""}
                    onChange={(e) => {
                      onChange("nip", e.target.value)
                      setVErrs((p) => ({ ...p, nip: undefined }))
                    }}
                    className="input"
                  />
                  {vErrs.nip && (
                    <p className="mt-1 text-xs text-red-600">{vErrs.nip}</p>
                  )}
                </div>
              </Field>
            ) : (
              <Row label="NIP" value={item.nip} />
            )}
            {editing ? (
              <Field label="REGON" hint="9 cyfr (XLSX: REGON)">
                <div>
                  <input
                    value={form.regon || ""}
                    onChange={(e) => {
                      onChange("regon", e.target.value)
                      setVErrs((p) => ({ ...p, regon: undefined }))
                    }}
                    className="input"
                  />
                  {vErrs.regon && (
                    <p className="mt-1 text-xs text-red-600">{vErrs.regon}</p>
                  )}
                </div>
              </Field>
            ) : (
              <Row label="REGON" value={item.regon} />
            )}
            {editing ? (
              <Field label="KRS" hint="Numer KRS (jeśli dotyczy)">
                <input
                  value={form.krs || ""}
                  onChange={(e) => onChange("krs", e.target.value)}
                  className="input"
                />
              </Field>
            ) : (
              <Row label="KRS" value={item.krs} />
            )}
            {editing ? (
              <Field
                label="Numer wpisu do CEIDG"
                hint="Jeśli dotyczy; tylko cyfry"
              >
                <input
                  value={form.ceidg || ""}
                  onChange={(e) => onChange("ceidg", e.target.value)}
                  className="input"
                />
              </Field>
            ) : (
              <Row label="Numer wpisu do CEIDG" value={item.ceidg} />
            )}
            {editing ? (
              <Field
                label="Forma prawna"
                hint="Nazwa formy prawnej (np. sp. z o.o., S.A., JDG)"
              >
                <input
                  value={form.legalForm || ""}
                  onChange={(e) => onChange("legalForm", e.target.value)}
                  className="input"
                  placeholder="np. spółka z o.o., S.A., JDG"
                />
              </Field>
            ) : (
              <Row label="Forma prawna" value={item.legalForm} />
            )}
            {editing ? (
              <Field
                label="Email"
                hint="Adres e-mail do kontaktu (XLSX: email)"
              >
                <div>
                  <input
                    value={form.email || ""}
                    onChange={(e) => {
                      onChange("email", e.target.value)
                      setVErrs((p) => ({ ...p, email: undefined }))
                    }}
                    className="input"
                  />
                  {vErrs.email && (
                    <p className="mt-1 text-xs text-red-600">{vErrs.email}</p>
                  )}
                </div>
              </Field>
            ) : (
              <Row label="Email" value={item.email} />
            )}
            {editing ? (
              <Field label="Telefon" hint="Telefon do kontaktu (XLSX: telefon)">
                <input
                  value={form.phone || ""}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="input"
                />
              </Field>
            ) : (
              <Row label="Telefon" value={item.phone} />
            )}
            {editing ? (
              <Field label="Numer faksu" hint="Jeśli dotyczy">
                <input
                  value={form.fax || ""}
                  onChange={(e) => onChange("fax", e.target.value)}
                  className="input"
                />
              </Field>
            ) : (
              <Row label="Numer faksu" value={item.fax} />
            )}
            {editing ? (
              <Field
                label="WWW"
                hint="Adres strony (XLSX: www). Można wpisać bez https://"
              >
                <div>
                  <input
                    value={form.website || ""}
                    onChange={(e) => {
                      onChange("website", e.target.value)
                      setVErrs((p) => ({ ...p, website: undefined }))
                    }}
                    className="input"
                  />
                  {vErrs.website && (
                    <p className="mt-1 text-xs text-red-600">{vErrs.website}</p>
                  )}
                </div>
              </Field>
            ) : (
              <Row label="WWW" value={item.website} />
            )}
          </dl>
        </div>
        <div className="card card-lg">
          <h2 className="font-medium mb-2">Kontakt i sprzedaż</h2>
          <dl className="text-sm space-y-2">
            {editing ? (
              <Field
                label="Metody kontaktu"
                hint={
                  "Podaj po jednej metodzie na wiersz (XLSX: contactMethods). Np. email: info@..., telefon: 123..., formularz www."
                }
              >
                <input
                  value={(form.contactMethods || []).join(", ")}
                  onChange={(e) =>
                    onChange(
                      "contactMethods",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="input"
                  placeholder="np. email, telefon"
                />
              </Field>
            ) : (
              <Row
                label="Metody kontaktu"
                value={(item.contactMethods || []).join(" | ") || undefined}
              />
            )}
            {editing ? (
              <Field
                label="Dodatkowe lokalizacje sprzedaży"
                hint={
                  "Podaj oddziały/punkty sprzedaży — po jednej lokalizacji na wiersz (XLSX: sprzedazDodatkowe)."
                }
              >
                <input
                  value={(form.sprzedazDodatkowe || []).join(", ")}
                  onChange={(e) =>
                    onChange(
                      "sprzedazDodatkowe",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="input"
                />
              </Field>
            ) : (
              <Row
                label="Dodatkowe lokalizacje sprzedaży"
                value={(item.sprzedazDodatkowe || []).join(" | ") || undefined}
              />
            )}
          </dl>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressCard
          title="Siedziba"
          obj={editing ? form.siedziba : item.siedziba}
          onChange={editing ? (v) => onChange("siedziba", v) : undefined}
        />
        <AddressCard
          title="Sprzedaż"
          obj={editing ? form.sprzedaz : item.sprzedaz}
          onChange={editing ? (v) => onChange("sprzedaz", v) : undefined}
        />
      </section>
    </main>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="opacity-70">{label}</dt>
      <dd className="truncate max-w-[60%] text-right">{value || "—"}</dd>
    </div>
  )
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
    <div className="flex items-center justify-between gap-3">
      <dt className="opacity-70 whitespace-nowrap inline-flex items-center">
        <span>{label}</span>
        {hint ? (
          <InfoTooltip text={hint} ariaLabel={`Podpowiedź: ${label}`} />
        ) : null}
      </dt>
      <dd className="flex-1">{children}</dd>
    </div>
  )
}

function AddressCard({
  title,
  obj,
  onChange,
}: {
  title: string
  obj?: DeveloperAddress
  onChange?: (v: DeveloperAddress) => void
}) {
  const keys = [
    "woj",
    "pow",
    "gmi",
    "miasto",
    "ulica",
    "nrNieruchomosci",
    "nrLokalu",
    "kodPocztowy",
  ]

  const context = title.toLowerCase().includes("siedziba")
    ? "siedziby dewelopera"
    : "lokalu sprzedaży"

  const addressHint = (k: string): string => {
    switch (k) {
      case "woj":
        return `Województwo adresu ${context}`
      case "pow":
        return `Powiat adresu ${context}`
      case "gmi":
        return `Gmina adresu ${context}`
      case "miasto":
        return `Miejscowość adresu ${context}`
      case "ulica":
        return `Ulica adresu ${context}`
      case "nrNieruchomosci":
        return `Nr nieruchomości adresu ${context}`
      case "nrLokalu":
        return `Nr lokalu adresu ${context}`
      case "kodPocztowy":
        return `Kod pocztowy adresu ${context}`
      default:
        return ""
    }
  }

  return (
    <div className="card card-lg">
      <h2 className="font-medium mb-2">{title}</h2>
      <dl className="text-sm space-y-2">
        {onChange ? (
          keys.map((k) => (
            <Field key={k} label={k} hint={addressHint(k)}>
              <input
                value={obj?.[k] || ""}
                onChange={(e) =>
                  onChange({ ...(obj || {}), [k]: e.target.value })
                }
                className="input"
              />
            </Field>
          ))
        ) : obj ? (
          Object.entries(obj).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))
        ) : (
          <Row label="brak" value={undefined} />
        )}
      </dl>
    </div>
  )
}
