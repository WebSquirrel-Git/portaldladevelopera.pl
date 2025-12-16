import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6 bg-[#F6E9D5]">
      <div className="w-full max-w-sm card card-lg">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Logowanie</h1>
          <p className="mt-1 text-sm muted">
            Uzyskaj dostęp do panelu administracyjnego
          </p>
        </header>
        <LoginForm />
      </div>
    </main>
  )
}
