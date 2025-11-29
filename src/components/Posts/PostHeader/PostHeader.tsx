import React from 'react'

import type { Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { formatDateTimeMonthName } from '@/utilities/formatDateTimeMonthName'

interface PostHeaderProps{
  title:string;
  coverImage:MediaType | string;
  cardDescription:string;
  headerSection:{
author:string;
navMenu:{
  navItem:string;
}[];
description:any;
  };
  publishedAt:string | null | undefined;
}

export const PostHeader: React.FC<PostHeaderProps> = (props) => {
  const {  title,coverImage,headerSection,publishedAt } = props


  return (
    <div className="flex flex-col w-full">
  <div className='relative w-full md:h-[290px] h-[142px] rounded-t-[6px]'>
    <Media resource={coverImage} fill={true} imgClassName='object-cover object-bottom rounded-t-[6px]'/>
  </div>
  <div className='flex flex-col pt-8 px-3 xl:pt-12 xl:px-16 gap-[18px] xl:gap-[20px]'>
<div className='flex flex-row gap-0.5 items-center'>
  <p className='!text-white text-[14px] font-medium'>Blog</p>
  <Icon icon='material-symbols:chevron-right-rounded' className='text-grey'/>
  <p className='text-[14px] font-medium gradient-orange-text'>{title}</p>
</div>
<div className='flex flex-col gap-4'>
  <h2 className='text-lightGrey'>{title}</h2>
  <p className='!text-grey text-[16px]'><b className='font-semibold'>Ostatnia aktualizacja:</b> {publishedAt && (<time dateTime={publishedAt}>{formatDateTimeMonthName(publishedAt)}</time> )}</p>
<p className='!text-grey text-[16px]'><b className='font-semibold'>Autor:</b> {headerSection.author}</p>
</div>
<div className='flex flex-col gap-3'>
  <p className='!text-white text-[16px]'>Spis treści</p>
  <div className='flex pl-3 pb-6'>
    <div className='flex flex-col pl-4 gap-2 border-solid border-l border-0 border-white/10'>
    {headerSection.navMenu.map((navItem,i)=>(
      <span key={i} className='text-[14px] text-primaryOrange'>{i+1}. <Link className='text-[14px] leading-[22px] text-primaryOrange !underline decoration-1' href={`#${i+1}`}>{navItem.navItem}</Link></span>
      ))}
    </div>
  </div>
</div>
<RichText data={headerSection.description} className='text-[16px] text-lightGrey mx-0 w-full max-w-full'/>
  </div>
  
    </div>
  )
}
