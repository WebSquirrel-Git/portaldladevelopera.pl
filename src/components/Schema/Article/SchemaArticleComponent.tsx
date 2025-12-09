'use client'

import { Post } from '@/payload-types'
import Script from 'next/script'
import { ArticleSchemaProps } from './SchemaArticle'

interface SchemaArticleComponentProps {
  post: Post
  schema: ArticleSchemaProps
}

export const SchemaArticleComponent: React.FC<SchemaArticleComponentProps> = (props) => {
  const { post, schema } = props
  return (
    <Script
      id={`Schema-for-${post.slug}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    >
      {JSON.stringify(schema)}
    </Script>
  )
}
