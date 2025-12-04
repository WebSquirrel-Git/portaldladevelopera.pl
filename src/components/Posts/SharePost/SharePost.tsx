'use client'

import { Media as MediaType } from '@/payload-types'
import { CardLatestPosts } from '../CardLatestPosts/CardLatestPosts'
import Link from 'next/link'
import Image from 'next/image'
import LinkedinIcon from '@/assets/icons/streamline-logos_linkedin-logo-block.svg'
import FacebookIcon from '@/assets/icons/raphael_facebook.svg'
import LinkIcon from '@/assets/icons/link-gradient.svg'

interface SharePostProps {
  latestPosts: {
    id: string
    title?: string
    coverImage: string | MediaType
    cardDescription: string
    meta?:
      | {
          title?: string | null
          image?: (string | null) | MediaType
          description?: string | null
        }
      | undefined
    publishedAt?: string | null | undefined
    slug?: string
  }[]
  slug: string
}

export const SharePost: React.FC<SharePostProps> = (props) => {
  const { latestPosts, slug } = props

  const copyLink = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('Skopiowano link!')
      })
      .catch(() => {
        console.error('Nie udało się skopiować linku.')
      })
  }
  return (
    <div className="shrink-0 flex flex-col w-full lg:w-[223px] gap-12">
      <div className="flex flex-col gap-[20px]">
        <p className="text-[16px] font-bold !text-white text-left leading-none">Udostępnij post</p>
        <div className="flex flex-row lg:flex-col lg:gap-0 gap-2">
          <Link
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`}
            className="flex flex-row gap-2 items-center justify-center lg:justify-start h-10 px-4 w-10 lg:w-full border-solid border-dark/90 lg:border-none border lg:rounded-none rounded-lg"
          >
            <Image src={LinkedinIcon} alt="Linkedin" className="w-4 h-4" />
            <p className="lg:block hidden text-[14px] !text-lightGrey font-medium">Linkedin</p>
          </Link>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`}
            className="flex flex-row gap-2 items-center justify-center lg:justify-start h-10 px-4 w-10 lg:w-full border-solid border-dark/90 lg:border-none border lg:rounded-none rounded-lg"
          >
            <Image src={FacebookIcon} alt="Facebook" className="w-4 h-4" />
            <p className="lg:block hidden text-[14px] !text-lightGrey font-medium">Facebook</p>
          </Link>
          <button
            onClick={copyLink}
            className="bg-transparent cursor-pointer flex flex-row gap-2 items-center justify-center lg:justify-start h-10 px-4 w-10 lg:w-full border-solid border-dark/90 lg:border-none border lg:rounded-none rounded-lg"
          >
            <Image src={LinkIcon} alt="Kopiuj link" className="w-4 h-4" />
            <p className="lg:block hidden text-[14px] !text-lightGrey font-medium">Kopiuj link</p>
          </button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col gap-3">
        <p className="text-[16px] font-bold !text-white text-left">Nowe wpisy</p>
        {latestPosts.map((post) => (
          <CardLatestPosts key={post.id} {...post} />
        ))}
      </div>
    </div>
  )
}
