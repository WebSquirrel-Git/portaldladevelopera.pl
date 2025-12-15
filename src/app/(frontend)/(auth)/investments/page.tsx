import InvestmentsList from "./InvestmentsList"

export default function InvestmentsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Inwestycje</h1>
        <p className="mt-1 text-sm muted">
          Lista inwestycji, eksporty publiczne oraz przejście do edycji lokali.
        </p>
      </header>
      <InvestmentsList />
    </section>
  )
}
