'use client'

import { Page } from '@/payload-types'
import Script from 'next/script'
import { SchemaSlugPageProps } from './SchemaSlugPage'

interface SchemaSlugPageComponentProps {
  page: Page
  schema: SchemaSlugPageProps
}

export const SchemaSlugPageComponent: React.FC<SchemaSlugPageComponentProps> = (props) => {
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
