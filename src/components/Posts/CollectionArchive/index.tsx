import React from 'react'

import { Card, CardPostData } from '@/components/Posts/Card/Card'
import { Media } from '@/payload-types'
import { CardWide } from '../CardWide/CardWide'

export type Props = {
  posts: CardPostData[]
}

interface CollectionArchiveProps {
  posts: {
    id: string
    title?: string
    coverImage: string | Media
    cardDescription: string
    meta?:
      | {
          title?: string | null
          image?: (string | null) | Media
          description?: string | null
        }
      | undefined
    publishedAt?: string | null | undefined
    slug?: string
  }[]
}

export const CollectionArchive: React.FC<CollectionArchiveProps> = (props) => {
  const { posts } = props
  return (
    <div className="flex flex-col gap-3 xl:gap-[40px]">
      {posts.length > 0 && <CardWide {...posts[0]} />}
      <div className="flex flex-row flex-wrap xl:gap-4 gap-3">
        {posts?.slice(1).map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className="col-span-4" key={index}>
                <Card {...result} />
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
