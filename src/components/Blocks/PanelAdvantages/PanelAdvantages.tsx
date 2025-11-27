'use client'

import { PanelAdvantagesBlockPropsType } from '@/blocks/PanelAdvantagesBlock/Component'
import { Icon } from '@iconify/react';
import StarIcon from '@/assets/icons/star-list.svg'
import Image from 'next/image';


export const PanelAdvantages:React.FC<PanelAdvantagesBlockPropsType>=(props)=>{
    const {header,description,advantagesList} = props;

    return(
        <div className='bg-black pt-10 px-4 gap-16 flex flex-col pb-0 2xl:pt-[100px] 2xl:pb-[160px] 2xl:px-[274px] justify-center items-center'>
            <div className='flex flex-col gap-[20px] xl:gap-[18px] justify-center items-center'>
                 <h2 className='text-white text-center max-w-[730px]'>{header.normal}{" "}
                <b className='gradient-text font-normal bg-gradientOrangeButton bg-white/40 bg-clip-text text-transparent'>{header.gradient}</b>
            </h2>
            <p className='text-white text-center max-w-[730px]'>
                <b className='font-semibold'>{description.bold}</b><br/>{description.normal}
            </p>
            </div>
            <div className='flex xl:flex-row xl:flex-wrap flex-col gap-10 xl:gap-12'>
                {advantagesList.map((advantage,i)=>(
                    <div key={i} className='flex flex-col xl:pl-0 pl-[20px] xl:w-[264px] w-full xl:gap-[20px] gap-4'>
                        <div className='gradient-brown flex items-center justify-center w-12 h-12 rounded-lg border border-white/10 border-b-0'>
                            <Icon icon={advantage.icon} className='w-6 h-6 text-primaryOrange'/>
                        </div>
                        <h3 className='text-white'>{advantage.title}</h3>
                        <div className='flex flex-col gap-3 xl:gap-4 justify-start items-start'>
                         {advantage.advantagesList.map((item,z)=>(
                            <div key={z} className='flex flex-row gap-2 items-center justify-start'>
                                <Image className='w-6 h-6' src={StarIcon} alt='Gwiazdka'/>
                                <p className='text-lightGrey'>{item.advantage}</p>
                            </div>
                         ))}   
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}