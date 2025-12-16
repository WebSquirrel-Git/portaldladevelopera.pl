import type { Metadata } from 'next'
import React from 'react'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { getServerSideURL } from '@/utilities/getURL'

import { GoogleTagManager } from "@next/third-parties/google";


export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ZpGWYJRVn9UcgQ0b0a_Gn0W7D5Kprf2k-h7RLqLrv5s" />
      <GoogleTagManager gtmId="GTM-MZ3N2ZRZ" />

        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
     
       
        {children}
        
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
}
