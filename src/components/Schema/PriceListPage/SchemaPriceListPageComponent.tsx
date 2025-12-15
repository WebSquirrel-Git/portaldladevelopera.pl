'use client'

import { Page } from '@/payload-types'
import Script from 'next/script'
import { SchemaPriceListPageProps } from './SchemaPriceListPage'

interface SchemaPriceListPageComponentProps {
  page: Page
  schema: SchemaPriceListPageProps
}

export const SchemaPriceListPageComponent: React.FC<SchemaPriceListPageComponentProps> = (props) => {
  const { page, schema } = props
  return (
    <Script
      id={`Schema-for-${page.slug}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    >
      {JSON.stringify(schema)}
    </Script>
  )
}
