"use client"

import { useMe } from "@/lib/useMe"
import Link from "next/link"
import { useEffect, useState } from "react"

// Proste ikony inline w stylistyce akcentu
function IconBuilding() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect
        x="3"
        y="3"
        width="10"
        height="18"
        rx="1"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <rect x="7" y="7" width="2" height="2" fill="var(--accent)" />
      <rect x="11" y="7" width="2" height="2" fill="var(--accent)" />
      <rect x="7" y="11" width="2" height="2" fill="var(--accent)" />
      <rect x="11" y="11" width="2" height="2" fill="var(--accent)" />
      <path
        d="M13 15h8v6H3"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
    </svg>
  )
}
function IconMapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.5" fill="var(--accent)" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3 11.5 12 4l9 7.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M6 10.5V20h12v-9.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <rect x="10" y="14" width="4" height="6" fill="var(--accent)" rx="0.5" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <circle
        cx="9"
        cy="9"
        r="3"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 19a6 6 0 0 1 11 0"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <circle
        cx="17"
        cy="9"
        r="2.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M16 19h4.5a5 5 0 0 0-5-4"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    developers: number
    investments: number
    units: number
    users?: number
  } | null>(null)
  const [recent, setRecent] = useState<
    Array<{ kind: string; id: string; title: string; at: string }>
  >([])
  const [lastExport, setLastExport] = useState<string | null>(null)
  const { me } = useMe()

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const [countsRes, recentRes] = await Promise.all([
          fetch("/api/admin/stats/counts", { signal: controller.signal }).then(
            (r) => r.json()
          ),
          fetch("/api/admin/stats/recent", { signal: controller.signal }).then(
            (r) => r.json()
          ),
        ])
        setStats(countsRes || null)
        setRecent(Array.isArray(recentRes) ? recentRes : [])
        setLastExport(new Date().toISOString())
      } catch {}
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <section className="space-y-6">
      <div className="card p-6 overflow-hidden relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Witaj w panelu</h1>
            <p className="mt-1 text-sm muted">
              Zarządzaj deweloperami, inwestycjami i eksportami otwartych
              danych.
            </p>
          </div>
          <Link href="/investments" className="btn btn-primary">
            Przejdź do inwestycji
          </Link>
        </div>
        <div className="mt-4 text-xs muted">
          Ostatnia aktualizacja eksportów:{" "}
          {lastExport ? new Date(lastExport).toLocaleString() : "—"}
          <span className="mx-2">•</span>
          <Link href="/investments" className="underline">
            Eksporty
          </Link>
        </div>
      </div>

      {/* Ogłoszenie: aktualizacja aplikacji (hardkodowane) */}
      <div
        className="rounded-md border-l-4 p-3 text-sm text-black"
        style={{
          borderColor: "var(--accent)",
          background: "rgba(242,145,32,0.08)",
        }}
      >
        <p className="font-bold flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden
            className="shrink-0"
          >
            <path
              d="M3 12h18"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 3v18"
              stroke="#cc6f00"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Aktualności — wrzesień 2025</span>
        </p>

        <details open className="mt-2">
          <summary className="cursor-pointer font-medium">Co nowego</summary>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-black/5 mr-2">
                Frontend
              </span>
              Edycja inwestycji: dodano sekcję „Lokalizacja inwestycji” oraz
              pola „Sprzedaż i kontakt” identyczne jak w formularzu dodawania
              (textarea → lista po jednej linii).
            </li>
            <li>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-black/5 mr-2">
                A11y
              </span>
              Podpowiedzi XLSX: ikony „i” z mapowaniem pól do nagłówków XLSX;
              treści wielolinijkowe, bez ucięć; hover/focus/tap; ESC/klik poza;
              portal z clampingiem do viewportu; atrybuty ARIA; tekst
              zaznaczalny.
            </li>
            <li>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-black/5 mr-2">
                UX
              </span>
              Units: dodane podpowiedzi dla sortowania po „Nr lokalu/domku”,
              sterowania zaokrąglaniem cen (0/↑/↓) i kolumny „Akcje”; porządki
              TS/ESLint.
            </li>
          </ul>
        </details>

        <details className="mt-3">
          <summary className="cursor-pointer font-medium">
            Wcześniejsze w tym miesiącu
          </summary>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              Zgodnie ze zgłoszonymi uwagami dodaliśmy automatyczne ustawianie
              daty „obowiązuje od” na datę wprowadzenia/zmiany ceny (za m²,
              bazowej i całkowitej). Czyszczenie wartości nie nadpisuje daty.
            </li>
            <li>
              Powiązane przeliczenia cena bazowa ↔ cena za m² aktualizują
              również datę pola, które zostało automatycznie przeliczone.
            </li>
            <li>
              W polach złożonych (części, przynależne, prawa, inne świadczenia)
              dodanie/zmiana ustawia datę na datę tej operacji; wyczyszczenie
              wartości liczbowej pozostawia datę bez zmian.
            </li>
            <li>
              Nowość w tabeli lokali: wyszukiwarka po numerze lokalu/domku oraz
              naturalne sortowanie tej kolumny (np. 2 przed 10).
            </li>
            <li>
              Zapobieganie przypadkowym zmianom cen: usunęliśmy wewnętrzne
              strzałki (góra/dół) w polach liczbowych cen. Dzięki temu wartość
              nie zwiększy się „przez przypadek”, gdy kursor pozostaje w polu;
              zmiana następuje tylko po świadomym wpisaniu liczby lub użyciu
              przycisków zaokrąglania.
            </li>
            <li>
              Wskazówka: po dodaniu nowego lokalu daty ustawiają się dopiero po
              wpisaniu ceny.
            </li>
          </ul>
        </details>

        <div className="mt-2 text-xs text-gray-600 flex items-center gap-4">
          <span>Zaktualizowano: {new Date().toISOString().slice(0, 10)}</span>
          <span>Poprzednia publikacja: 2025-09-05</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Deweloperzy"
          value={stats ? stats.developers : null}
          href="/developers"
          icon={<IconBuilding />}
        />
        <StatCard
          label="Inwestycje"
          value={stats ? stats.investments : null}
          href="/investments"
          icon={<IconMapPin />}
        />
        <StatCard
          label="Lokale"
          value={stats ? stats.units : null}
          href="/investments"
          icon={<IconHome />}
        />
        {me?.role === "SUPER_ADMIN" && (
          <StatCard
            label="Użytkownicy"
            value={stats ? stats.users ?? null : null}
            href="/users"
            icon={<IconUsers />}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h2 className="font-medium">Ostatnie działania</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recent.length ? (
              recent.map((e) => (
                <li
                  key={`${e.kind}_${e.id}_${e.at}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-black/5 capitalize">
                      {e.kind}
                    </span>
                    <span className="font-medium">{e.title}</span>
                  </span>
                  <span className="muted text-xs">
                    {new Date(e.at).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <li className="muted">Brak danych</li>
            )}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-medium">Szybkie akcje</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link className="btn" href="/developers">
              Przeglądaj deweloperów
            </Link>
            <Link className="btn" href="/investments">
              Przeglądaj inwestycje
            </Link>
            <Link className="btn" href="/investments">
              Przeglądaj lokale
            </Link>
            {me?.role === "SUPER_ADMIN" && (
              <Link className="btn" href="/users">
                Zarządzaj użytkownikami
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  href,
  icon,
}: {
  label: string
  value: number | null
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link href={href} className="card p-5 block">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm muted flex items-center gap-2">
            <span>{label}</span>
          </div>
          <div className="mt-1 text-3xl font-semibold">
            {value === null ? (
              <span className="inline-block h-8 w-20 rounded bg-black/5 animate-pulse" />
            ) : (
              value
            )}
          </div>
        </div>
        <div className="shrink-0" aria-hidden>
          <div style={{ transform: "scale(1.8)" }}>{icon}</div>
        </div>
      </div>
    </Link>
  )
}
