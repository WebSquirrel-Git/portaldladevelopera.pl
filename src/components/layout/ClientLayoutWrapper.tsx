'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import AppShell from '@/components/layout/AppShell'

const AUTH_PATHS = [
  '/dashboard',
  '/developers',
  '/investments',
  '/users',
]

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isAuthRoute = AUTH_PATHS.some((p) =>
    pathname.startsWith(p)
  )

  if (isAuthRoute) {
    return <AppShell>{children}</AppShell>
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
