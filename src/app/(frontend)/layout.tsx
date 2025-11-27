import type { Metadata } from 'next'
import React from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import {inter} from '@/config/font'
import '../styles/globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import localFont from 'next/font/local'

const satoshi = localFont({
  src: '../fonts/Satoshi-Variable.ttf',
  variable: '--satoshi',
  display: 'swap',
  
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} ${satoshi.variable}`}>

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
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
