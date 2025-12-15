"use client"

import { useMe } from "@/lib/useMe"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"

const NAV = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["SUPER_ADMIN", "CLIENT"] as const,
  },
  {
    href: "/developers",
    label: "Deweloperzy",
    roles: ["SUPER_ADMIN", "CLIENT"] as const,
  },
  {
    href: "/investments",
    label: "Inwestycje",
    roles: ["SUPER_ADMIN", "CLIENT"] as const,
  },
  { href: "/users", label: "Użytkownicy", roles: ["SUPER_ADMIN"] as const },
]

const PROTECTED_PATHS = NAV.map((n) => n.href)

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNav = PROTECTED_PATHS.some((p) => pathname?.startsWith(p))
  const [busy, setBusy] = useState(false)
  const { me } = useMe()

  const visibleNav = useMemo(() => {
    const role = me?.role || "CLIENT"
    return NAV.filter((n) => (n.roles as readonly string[]).includes(role))
  }, [me])

  async function logout() {
    setBusy(true)
    try {
      await fetch("/api/logout", { method: "POST" })
      window.location.href = "/logowanie"
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh">
      {showNav && (
        <header className="sticky top-2 md:top-4 z-20 mb-6 md:mb-8">
          <div className="relative isolate mx-auto max-w-6xl px-4 sm:px-6">
            {/* Usunięto dekoracyjny pasek nad nawigacją */}
            {/* Rozmyty halo za panelem nawigacji dla efektu floating */}
            <div
              className="pointer-events-none absolute inset-x-4 sm:inset-x-6 -top-6 h-24 z-0 blur-2xl rounded-[2rem]"
              style={{
                background:
                  "radial-gradient(90% 120% at 50% 0%, rgba(255, 210, 140, 0.45) 0%, rgba(255, 210, 140, 0.12) 40%, rgba(255, 210, 140, 0) 70%)",
              }}
            />

            <div
              className="relative z-10 h-16 flex items-center justify-between rounded-3xl border shadow-lg px-4 sm:px-6"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,244,229,0.88) 100%)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderColor: "var(--border)",
                boxShadow: "0 12px 28px rgba(87, 48, 15, 0.12)",
              }}
            >
              <div className="flex items-center gap-5">
                <Link
                  href="/dashboard"
                  className="font-semibold flex items-center gap-2"
                >
                  <span
                    className="inline-flex h-7 px-2 items-center justify-center rounded-full text-xs"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                    }}
                  >
                    GOV
                  </span>
                  RENDPRO Admin
                </Link>
                <nav className="hidden sm:flex items-center gap-1 text-sm">
                  {visibleNav.map((n) => {
                    const active = pathname?.startsWith(n.href)
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        className={`nav-link ${
                          active ? "nav-link--active" : ""
                        }`}
                      >
                        {n.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                {/* Avatar z inicjałem */}
                <div
                  className="h-8 w-8 rounded-full grid place-items-center text-xs font-medium select-none"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gold-300), var(--gold-600))",
                    color: "#3b2a18",
                    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6)",
                  }}
                  aria-hidden
                  title={me?.username || ""}
                >
                  {(me?.username || "A").slice(0, 1).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  disabled={busy}
                  className="btn btn-primary"
                >
                  {busy ? "Wylogowywanie…" : "Wyloguj"}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <div
          className="rounded-2xl border px-4 py-3 sm:px-6 sm:py-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,244,229,0.9) 100%)",
            borderColor: "var(--border)",
            boxShadow: "0 10px 24px rgba(87, 48, 15, 0.1)",
          }}
        >
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-6 px-2 items-center justify-center rounded-full"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                DOCS
              </span>
              <span className="opacity-70">Instrukcja obsługi</span>
            </div>
            <a
              href="https://docs.google.com/document/d/1IsnGLa2nh27Mf3-7fBf334WkBsbyqcUguLytbfcZOi8/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="btn px-3 py-1 text-xs"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                borderColor: "var(--accent)",
              }}
            >
              Otwórz
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
