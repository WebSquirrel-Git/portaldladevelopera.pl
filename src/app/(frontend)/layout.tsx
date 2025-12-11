import type { Metadata } from 'next'
import React from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { inter } from '@/config/font'
import '../styles/globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import localFont from 'next/font/local'
import { GoogleTagManager } from "@next/third-parties/google";

const satoshi = localFont({
  src: '../fonts/Satoshi-Variable.ttf',
  variable: '--satoshi',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ZpGWYJRVn9UcgQ0b0a_Gn0W7D5Kprf2k-h7RLqLrv5s" />
      <GoogleTagManager gtmId="GTM-MZ3N2ZRZ" />

        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} ${satoshi.variable} flex flex-col`}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MZ3N2ZRZ"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
}
