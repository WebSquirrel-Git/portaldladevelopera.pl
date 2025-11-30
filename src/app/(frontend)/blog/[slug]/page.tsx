import type { Metadata } from 'next'

import { RelatedPosts } from '@/components/Posts/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PostHeader } from '@/components/Posts/PostHeader/PostHeader'
import { RenderPostBlocks } from '@/blocks/Posts/RenderPostBlocks'
import { formatDateTimeMonthName } from '@/utilities/formatDateTimeMonthName'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    depth:2,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="bg-black pt-[18px] pb-[96px] px-4 xl:pt-16 xl:pb-[120px] 2xl:px-[360px] flex flex-col xl:gap-12 gap-6">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className='flex flex-col-reverse 2xl:flex-row gap-6'>
<div className='flex flex-col bg-[#1B1B1C]/90 rounded-lg xl:rounded-xl pb-16'>
  <PostHeader 
  title={post.title}
  coverImage={post.coverImage}
  cardDescription={post.cardDescription}
  headerSection={post.headerSection}
  publishedAt={post.publishedAt}

  />
<RenderPostBlocks blocks={post.content} />
<div className='flex flex-col gap-[18px] xl:gap-[20px] px-3 xl:px-16 py-[18px] xl:py-[20px]'>
  <p className='!text-grey text-[16px]'><b className='font-semibold'>Autor:</b> {post.headerSection.author}</p>
  <p className='!text-grey text-[16px]'><b className='font-semibold'>Ostatnia aktualizacja:</b> {post.publishedAt && (<time dateTime={post.publishedAt}>{formatDateTimeMonthName(post.publishedAt)}</time> )}</p>

</div>
</div>
<div className='flex flex-col bg-green-500 w-full h-[100px] xl:w-[223px]'>123</div>
</div>

 
 {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
