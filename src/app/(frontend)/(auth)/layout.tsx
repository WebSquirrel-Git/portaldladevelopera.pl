import AppShell from "@/components/layout/AppShell"
import type { Metadata } from "next"
import { Geist_Mono, Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "RENDPRO GOV Integrator – Admin",
  description: "Panel administracyjny",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppShell>{children}</AppShell>
      </body>
  )
}
