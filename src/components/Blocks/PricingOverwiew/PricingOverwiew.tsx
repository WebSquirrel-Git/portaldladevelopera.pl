'use client'

import { PricingCard } from '@/blocks/PricingOverwiewBlock/Component';
import { useState } from 'react';
import { CardVertical } from './CardVertical';
import { CardHorizontal } from './CardHorizontal';

interface PricingOverviewType{
header: any;
  subheader:string;
  cards:PricingCard[]
}

export const PricingOverwiew: React.FC<PricingOverviewType> = (props) => {
  const { subheader,cards } = props;
  const verticalCards = cards.filter((card)=>card.orientation==='vertical')
  const horizontalCards = cards.filter((card)=>card.orientation==='horizontal')
 const [activePeriod,setActivePeriod] = useState<"month"|"year">('month')
  return (
    <div className="pt-10 xl:pb-[160px] pb-[80px] px-4 gap-12 bg-[url(/background-header.svg)] bg-no-repeat bg-top flex flex-col 2xl:pt-[40px] 2xl:px-[274px] justify-center items-center">
      
      <div className="flex flex-col gap-3 2xl:gap-6 justify-start items-center">
       <div className='flex flex-col items-center justify-center'>
       <p className='gradient-dark-orange-text !text-[20px] !leading-[26px] font-medium'>Cennik</p>
        <h1 className="text-center text-white">
          Wybierz <b className="gradient-text font-normal bg-gradientOrangeButton bg-white/40 bg-clip-text text-transparent">
            plan idealny
          </b>
          <br />
          dla Twojego biznesu
        </h1>
        </div>
        <div className="flex flex-col gap-8 items-center justify-center pb-0 2xl:pb-10">
          <h2 className="!text-lightGrey !text-[20px] !leading-[32px] text-center max-w-[617px]">
          {subheader}
          </h2>
        </div>
      </div>
      <div className="flex gap-2 lg:gap-6 max-w-[560px] flex-row w-full 2xl:w-fit border bg-dark border-white/10 border-solid border-b-0 rounded-[31px] p-[10px]">
        
          <button
            onClick={() => setActivePeriod('month')}
            className={`${activePeriod === 'month' ? 'gradient-orange' : 'bg-white/0 text-lightGrey'} cursor-pointer transition-all duration-500 ease-in-out w-full 2xl:w-fit rounded-[30px] py-[10px] px-[20px] xl:py-[12px] text-black text-[14px] font-medium border-0`}
          >
            Miesiąc
          </button>
       <button
            onClick={() => setActivePeriod('year')}
            className={`${activePeriod === 'year' ? 'gradient-orange' : 'bg-white/0 text-lightGrey'} cursor-pointer transition-all duration-500 ease-in-out w-full 2xl:w-fit rounded-[30px] py-[10px] px-[20px] xl:py-[12px] text-black text-[14px] font-medium border-0`}
          >
            Rok
          </button>
      </div>
      <div className="flex xl:flex-row flex-col xl:gap-0 gap-[18px]">
       {verticalCards.map((card,i)=><CardVertical key={i} index={i} activePeriod={activePeriod} {...card}/>)}
      </div>
      <CardHorizontal {...horizontalCards[0]}/>
    </div>
  )
}
