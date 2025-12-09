'use client'

import { Page } from '@/payload-types'
import Script from 'next/script'
import { SchemaHomePageProps } from './SchemaHomePage'

interface SchemaHomePageComponentProps {
  page: Page
  schema: SchemaHomePageProps
}

export const SchemaHomePageComponent: React.FC<SchemaHomePageComponentProps> = (props) => {
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
