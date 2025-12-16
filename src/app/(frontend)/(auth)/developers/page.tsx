import DevelopersList from "./DevelopersList"

export default function DevelopersPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Deweloperzy</h1>
        <p className="mt-1 text-sm muted">Przeglądaj i wyszukuj po NIP.</p>
      </header>
      <DevelopersList />
    </section>
  )
}
