import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/Posts/CollectionArchive'
import { PageRange } from '@/components/Posts/PageRange'
import { Pagination } from '@/components/Posts/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import BlogIcon from '@/assets/icons/blog.svg'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 2,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    // <div className="pt-24 pb-24">
    //   <div className="container mb-16">
    //     <div className="prose dark:prose-invert max-w-none">
    //       <h1>Posts</h1>
    //     </div>
    //   </div>

    //   <div className="container mb-8">
    //     <PageRange
    //       collection="posts"
    //       currentPage={posts.page}
    //       limit={2}
    //       totalDocs={posts.totalDocs}
    //     />
    //   </div>

    //   <CollectionArchive posts={posts.docs} />

    //   <div className="container">
    //     {posts?.page && posts?.totalPages > 1 && (
    //       <Pagination page={posts.page} totalPages={posts.totalPages} />
    //     )}
    //   </div>
    // </div>
      <div className="flex flex-col bg-black">
          <div className='bg-[url(/background-gradient.webp)] justify-center items-center flex flex-col gap-6 px-4 pt-12 pb-[123px] 2xl:px-[320px] xl:pt-[75px] xl:pb-[175px]'>
    <div className="flex w-fit bg-gradientOrangeButton p-[1px] rounded-[32px]">
                  <div className="flex flex-row gap-2.5 bg-[#512714] xl:py-1 xl:pl-[7px] xl:pr-3 p-1 rounded-[32px]">
                    <Image src={BlogIcon} alt='Blog dla dewelopera' className="w-6 h-6" />
                    <span className="xl:flex hidden bg-blend-screen gradient-text bg-gradientOrangeButton bg-clip-text text-transparent">
                      Blog dla dewelopera
                    </span>
                  </div>
                </div>
                <h1 className='text-white text-center max-w-[1100px]'><b className='font-normal gradient-orange-text'>Wiedza</b>, która napędza Twój biznes deweloperski</h1>
          <p className='max-w-[600px] text-[20px] leading-[32px] text-lightGrey text-center'>Poznaj najnowsze trendy, porady prawne i najlepsze praktyki 
    w zarządzaniu inwestycjami.</p>
          </div>
    <div className='flex flex-col py-12 px-4 xl:py-[96px] 2xl:px-[360px] gap-[18px] xl:gap-8'>
     <CollectionArchive posts={posts.docs} />
    <div className="container">
            {posts.totalPages > 1 && posts.page && (
              <Pagination page={posts.page} totalPages={posts.totalPages} />
            )}
          </div>
    </div>
          
    
         
    
    {/* <div className="container mb-8">
            <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={3}
              totalDocs={posts.totalDocs}
            />
          </div> */}
          
        </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Szablon Posty ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
