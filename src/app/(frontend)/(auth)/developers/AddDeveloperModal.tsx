"use client"

import { useState } from "react"

export default function AddDeveloperModal({
  onCreated,
}: {
  onCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [nip, setNip] = useState("")
  const [email, setEmail] = useState("")
  const [legalForm, setLegalForm] = useState("")
  const [fax, setFax] = useState("")
  const [ceidg, setCeidg] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName("")
    setNip("")
    setEmail("")
    setLegalForm("")
    setFax("")
    setCeidg("")
    setError(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const toDefined = (v?: string) =>
      v && v.trim() !== "" ? v.trim() : undefined
    const toDigits = (v?: string) => {
      if (!v) return undefined
      const s = v.replace(/\D+/g, "")
      return s || undefined
    }

    const nipDigits = toDigits(nip)
    if (!nipDigits || nipDigits.length !== 10) {
      setError("NIP powinien mieć 10 cyfr")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/developers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: toDefined(name),
          nip: nipDigits,
          email: toDefined(email),
          legalForm: toDefined(legalForm),
          fax: toDefined(fax), // dowolny tekst, wysyłany bez modyfikacji (po trim)
          ceidg: toDigits(ceidg), // tylko cyfry, opcjonalnie
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || "Błąd tworzenia")
      setOpen(false)
      reset()
      // Powiadom listę o zmianie – bez przeładowania strony
      onCreated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Błąd"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        + Dodaj dewelopera
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card card-lg w-full max-w-md relative">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nowy deweloper</h2>
              <button
                onClick={() => setOpen(false)}
                className="btn px-2 py-1 text-xs border border-red-700 bg-red-600 text-white hover:bg-red-700"
              >
                Zamknij
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium">Nazwa</label>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">NIP</label>
                <input
                  className="input"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="10 cyfr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Numer wpisu do CEIDG (opcjonalnie)
                </label>
                <input
                  className="input"
                  value={ceidg}
                  onChange={(e) => setCeidg(e.target.value)}
                  placeholder="tylko cyfry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Numer faksu (opcjonalnie)
                </label>
                <input
                  className="input"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  placeholder="np. +48 22 123 45 67 lub X"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Forma prawna (opcjonalnie)
                </label>
                <input
                  className="input"
                  value={legalForm}
                  onChange={(e) => setLegalForm(e.target.value)}
                  placeholder="np. spółka z o.o., S.A., JDG"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Email (opcjonalny)
                </label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn"
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
      )}
    </div>
  )
}
