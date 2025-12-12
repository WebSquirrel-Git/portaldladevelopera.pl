'use client'

import { PricingCard } from '@/blocks/PricingOverwiewBlock/Component'
import RichText from '@/components/RichText';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import styles from './card.module.scss'



export const CardHorizontal:React.FC<PricingCard> = (props)=>{
    const {title,
        subheader,
        button,
        includes,
    } = props;

    return(
        <div className='bg-primaryOrange/20 items-center justify-between w-full flex flex-col xl:flex-row border-solid xl:border-[2px] border-[3px] border-[#FE9A79] rounded-[20px] pt-6 pr-[20px] pb-[20px] pl-[20px] gap-[20px] xl:gap-8 xl:py-12 xl:px-[30px]'>
<div className='w-fit items-center xl:px-8 flex flex-col gap-[20px] xl:gap-8 py-[21px] xl:py-[33px] border-solid border-[1px] border-white/20 !border-x-0'>
 <div className='flex flex-col items-center'>
 <h2 className='gradient-orange-text !text-[32px] text-center'>
        {title}
     </h2>
     <RichText className={`text-center ${styles.richTextSubheader}`} data={subheader}/>
     </div>
     <Link
      className="w-3/4 transition-all flex flex-row items-center justify-center gap-3 duration:2000 hover:bg-right text-black rounded-lg box-border bg-gradientButton bg-[length:200%_100%] bg-left border border-yellowStroke border-solid border-l-0 border-b-0 font-medium text-[16px] py-[13px] px-6 cursor-pointer"
      href={button.url}
    >
      {button.label} <Icon icon='tabler:arrow-right' className='text-black h-6 w-6 text-[24px]'/>
    </Link>
</div>
<RichText data={includes} className={`mx-0 ${styles.richtextIncludes} xl:pr-8`}/>
        </div>
    )
}