'use client'

import { Post } from '@/payload-types'
import Script from 'next/script'
import { ArticleSchemaProps } from './Schema';

interface SchemaComponentProps{
    post:Post;
    schema:ArticleSchemaProps
}

export const SchemaComponent:React.FC<SchemaComponentProps>=(props)=>{
   const {post,schema} = props
    return (
         <Script 
         id={`Schema-for-${post.slug}`} 
         type='application/ld+json' 
         strategy='afterInteractive'
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
         >
              {JSON.stringify(schema)}
              </Script>
    )
}