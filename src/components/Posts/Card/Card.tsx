'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Media as MediaType, Post } from '@/payload-types'
import LinkIcon from '@/assets/icons/link.svg'
import { Media } from '@/components/Media'
import Image from 'next/image'
import { formatDateTime } from '@/utilities/formatDateTime'

export type CardPostData = Pick<Post, 'slug' | 'meta' | 'title'>

interface CardProps{
  coverImage:MediaType|string;
  id:string;
publishedAt?:string | null | undefined;
slug:string;
title:string;
cardDescription:string;

}

export const Card: React.FC<CardProps> = (props) => {

  const { slug, coverImage,id,publishedAt,title,cardDescription } = props;


  return (
    <article className='relative gap-2 flex flex-col w-full sm:w-[383px] sm:h-[357px] rounded-xl bg-[#1B1B1CE5]/90 border-darkGrey border-solid border p-2'>
     {publishedAt&&<time className='z-20 top-0 right-0 absolute text-[14px] leading-[22px] text-lightGrey pt-[10px] pr-[14px] pb-[6px] pl-[10px] bg-darkGrey rounded-bl-[10px] rounded-tr-[12px]'>
{formatDateTime(publishedAt)}
     </time>}
     <div className='relative w-full h-[144px] rounded-md'>
      <Media resource={coverImage} fill imgClassName='object-cover position-center rounded-md'/>
     </div>
     <div className='flex flex-col p-2 gap-3'>
      <div className='flex flex-col gap-2'>
        <p className='font-semibold text-[16px] leading-[24px] text-left !text-white'>{title}</p>
        <p className='text-[14px] leading-[22px] text-lightGrey'>{cardDescription}</p>
      </div>
      <Link className='px-[6px] flex flex-row w-full justify-start items-center gap-[14px] pt-3 border-solid border-darkGrey border-0 border-t' href={`${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${slug}`}>
      <Image src={LinkIcon} alt='Link' className='w-[20px] h-[20px]'/>
      <span className='text-[14px] leading-[22px] text-white'>Zobacz więcej</span>
      </Link>
     </div>
    </article>
  )
}
