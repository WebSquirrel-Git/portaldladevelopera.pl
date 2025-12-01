import React from 'react'
import type { Post } from '@/payload-types'
import { Card } from '../Card/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { docs } = props
  return (
    <div className="flex flex-col gap-6">
      <h2 className="gradient-orange-text">Powiązane artykuły</h2>
      <div className="flex flex-row flex-wrap gap-3 xl:gap-[18px]">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} {...doc} />
        })}
      </div>
    </div>
  )
}
