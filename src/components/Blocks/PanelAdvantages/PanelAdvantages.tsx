'use client'

import { PanelAdvantagesBlockPropsType } from '@/blocks/PanelAdvantagesBlock/Component'
import { Icon } from '@iconify/react';



export const PanelAdvantages:React.FC<PanelAdvantagesBlockPropsType>=(props)=>{
    const {header,description,advantagesList} = props;

    return(
        <div className='bg-black pt-10 px-4 gap-16 flex flex-col pb-0 2xl:pt-[100px] 2xl:pb-[160px] 2xl:px-[360px] justify-center items-center'>
            <div className='flex flex-col gap-[20px] xl:gap-[18px] justify-center items-center'>
                 <h2 className='text-white text-center max-w-[730px]'>{header.normal}{" "}
                <b className='gradient-text font-normal bg-gradientOrangeButton bg-white/40 bg-clip-text text-transparent'>{header.gradient}</b>
            </h2>
            <p className='text-white text-center max-w-[730px]'>
                <b className='font-semibold'>{description.bold}</b><br/>{description.normal}
            </p>
            </div>
        </div>
    )
}