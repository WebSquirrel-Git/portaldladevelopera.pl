import React from 'react'
import bgImage from '@/assets/background-error.svg'
import Image from 'next/image'
import { LinkButton } from '@/components/ui/LinkButton/LinkButton'

export default function NotFound() {
  return (
   <div className=" min-h-screen pt-[120px] px-4 gap-12 bg-black  flex flex-col 2xl:pt-[200px] 2xl:px-[274px] justify-start items-center">
   <div className='flex flex-col gap-2 xl:gap-6 items-center justify-start'>
<p className='gradient-dark-orange-text'>Problem z połączeniem</p>
<h1 className='text-white text-center !text-10 !leading-12 xl:text-[64px]! xl:leading-[78px]!'>Ups!<br/>
<b className='gradient-orange-text !font-normal'>Coś poszło nie tak</b></h1>
<p className='text-center'><b className='!font-medium'>Pracujemy nad rozwiązaniem problemu.</b><br/>
Spróbuj odświeżyć stronę lub wróć na stronę główną.</p>
   </div>
   <LinkButton label='Wróć na Stronę Główną' url={process.env.NEXT_PUBLIC_SERVER_URL}/>
   <Image src={bgImage} alt='półkole' className='w-full h-auto object-contain'/>
    </div>
  )
}
