'use client'
import React from 'react'

import type { Page } from '@/payload-types'
import { Icon } from '@iconify/react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
 

export const MainHero: React.FC<Page['hero']> = (props) => {

  const {card,backgroundImage} = props
  if (!backgroundImage || !card) return null

  return (
   <div className="flex flex-col h-screen w-full relative">
      <Media resource={backgroundImage} fill={true} imgClassName='object-cover'/>
      <div className="max-w-[850px] 2xl:p-8 p-4 absolute top-1/2 -translate-y-1/2 2xl:left-[100px] left-4 right-4 flex flex-col bg-white/70 rounded-4xl gap-4">
        <h1 className='text-black'>
         {card?.header}
        </h1>
        <RichText className="mx-0" data={card.description} enableGutter={false}/>
        <Link
          href={card.ctaButton.url||""}
          className="w-fit gap-2 px-10 py-3 rounded-2xl bg-(--dark-brown) text-white text-[16px] font-normal flex items-center justify-center flex-row"
        >
          {card.ctaButton.label} <Icon icon={card.ctaButton.icon} width={18} height={18} />
        </Link>
      </div>
    </div>
  )
}
