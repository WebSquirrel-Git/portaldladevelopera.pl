'use client'

import { PricingCard } from '@/blocks/PricingOverwiewBlock/Component'
import RichText from '@/components/RichText';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import styles from './card.module.scss'

interface CardVerticalType extends PricingCard{
index:number;
activePeriod:'month'|'year'
}

export const CardVertical:React.FC<CardVerticalType> = (props)=>{
    const {title,
        subheader,
        featuredTag,
        monthPricing,
        yearPricing,
        button,
        featured,
        limits,
        notContains,
        includes,
        index,
        activePeriod
    } = props;

    return(
        <div className={`flex ${featured?'py-0':'py-[10px]'} w-full sm:max-w-[420px]`}>

<div className={`flex bg-dark/90 items-center flex-col gap-[20px] rounded-[20px] xl:gap-8 pt-6 px-[20px] border-solid border-[1px] pb-[20px] xl:pt-8 xl:px-[30px] xl:pb-12 ${featured?'border-primaryOrange':'border-darkGrey'} ${index===0&&'xl:border-[1px] xl:border-r-0 xl:rounded-r-none'} ${index===1&&'border-[2px]'} ${index===2&&'xl:border-[1px] xl:border-l-0 xl:rounded-l-none'}`}>
<div className='flex flex-col'>
    <h2 className={`${featured?'gradient-dark-orange-text':'text-white'} !text-[32px] text-center`}>
        {title}
    </h2>
     <RichText className='text-center text-lightGrey' data={subheader}/>
</div>
{featured&&<span className='w-fit bg-gradientOrange py-[7px] px-[14px] rounded-[16px] font-medium text-[12px] leading-[17px] text-black'>
    {featuredTag}
    </span>}
    <div className='flex flex-col items-center'>
        <div className='flex flex-row items-center gap-1'>
            <span className='!text-[40px] text-white font-bold'>
                {activePeriod==='month'&&monthPricing&&monthPricing.monthMonthPrice}
                {activePeriod==='year'&&yearPricing&&yearPricing.yearYearPriceBlock.yearPrice}{" "}
                 zł</span>
            <span className='text-[16px] leading-[24px] text-lightGrey font-semibold'>
                {activePeriod==='month'&&"/miesiąc netto"}
                {activePeriod==='year'&&"/rok netto"}
                </span>
                {activePeriod==='year'&&yearPricing&&yearPricing.yearYearPriceBlock.yearPricePromo&&<span 
                className='!text-[14px] !leading-[20px] !text-white font-light bg-primaryOrange pt-1.5 pr-2 pb-[5px] pl-2 rounded-[24px]'>
                    {yearPricing.yearYearPriceBlock.yearPricePromo}</span>}
        </div>
        <div className='flex flex-row items-center gap-1'>
            <span className='!text-[24px] gradient-orange-text font-medium'>
                {activePeriod==='month'&&monthPricing&&monthPricing.monthYearPrice}
                {activePeriod==='year'&&yearPricing&&yearPricing.yearMonthPrice}{" "} 
                zł</span>
            <span className='text-[14px] leading-[20px] text-lightGrey font-light'>
                {activePeriod==='month'&&"/rocznie"}
                {activePeriod==='year'&&"/miesiąc"}
                </span>
        </div>
    </div>
    <Link
      className="w-3/4 transition-all flex flex-row items-center justify-center gap-3 duration:2000 hover:bg-right text-black rounded-lg box-border bg-gradientButton bg-[length:200%_100%] bg-left border border-yellowStroke border-solid border-l-0 border-b-0 font-medium text-[16px] py-[13px] px-6 cursor-pointer"
      href={button.url}
    >
      {button.label} <Icon icon='tabler:arrow-right' className='text-black h-6 w-6 text-[24px]'/>
    </Link>
    <div className='flex border-solid border-0 !border-t-[1px] border-white/20 flex-col xl:pl-[20px] pt-[20px] xl:pt-8 w-full items-start'>
        <RichText data={limits} className={`mx-0 ${styles.richtextLimits}`}/>
        <RichText data={includes} className={`mx-0 ${styles.richtextIncludes}`}/>
        <RichText data={notContains} className={`mx-0 ${styles.richtextNotContains}`}/>
    </div>
</div>
 </div>
    )
}