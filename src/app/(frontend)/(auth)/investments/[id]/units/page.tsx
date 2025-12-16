import BackButton from "@/components/ui/BackButton"
import InvestmentSalesForm from "../InvestmentSalesForm"
import UnitsManager from "./UnitsManager"

export default async function InvestmentUnitsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <section className="space-y-6">
      <BackButton className="mt-2" />
      <header>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">
              Inwestycja – sprzedaż i lokale
            </h1>
            <p className="mt-1 text-sm muted">
              Edytuj sprzedaż/kontakt i zarządzaj lokalami w jednym miejscu.
            </p>
          </div>
        </div>
      </header>

      {/* Formularz sprzedaży/kontaktu dla inwestycji */}
      <InvestmentSalesForm investmentId={id} />

      {/* Lista lokali */}
      <UnitsManager investmentId={id} />
    </section>
  )
}
