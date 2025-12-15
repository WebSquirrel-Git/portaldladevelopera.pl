import BackButton from "@/components/ui/BackButton"
import Link from "next/link"
import InvestmentSalesForm from "./InvestmentSalesForm"

export default async function InvestmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <section className="space-y-6">
      <BackButton className="mt-2" />
      <header>
        <h1 className="text-2xl font-semibold">Inwestycja</h1>
        <p className="mt-1 text-sm muted">
          Edytuj dane sprzedaży i kontaktu wykorzystywane w eksportach.
        </p>
      </header>
      <div className="flex items-center gap-2">
        <Link href={`/investments/${id}/units`} className="btn">
          Zarządzaj lokalami
        </Link>
      </div>
      <InvestmentSalesForm investmentId={id} />
    </section>
  )
}
