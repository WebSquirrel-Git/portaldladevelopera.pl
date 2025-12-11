'use client'

import { Icon } from '@iconify/react'

interface DescrptionCardProps {
  icon: string
  header: string
  subheader: string
  description: string
  className?: string | undefined
  active: boolean
}

export const DescriptionCard: React.FC<DescrptionCardProps> = (props) => {
  const { icon, header, subheader, description, active, className } = props
  return (
    <div
      className={`top-[690px] sm:top-[600px] left-0 right-0 w-[90%] mx-auto xl:mx-0 h-fit transition-all duration-800 ${className} isolate z-9999 absolute ${active ? 'flex' : 'hidden'} ${active ? 'bg-white/20' : 'bg-transparent'} xl:flex flex-col  sm:max-w-[380px] border-secondaryOrange border-solid rounded-[20px] p-[18px]`}
    >
      <div className={`w-full h-full absolute top-0 left-0 ${active ? 'bg-transparent' : 'bg-black/15 blur-0 z-20'} rounded-[20px]`}></div>
      <div className="gradient-orange w-8 h-8 gap-3 flex items-center justify-center rounded-full">
        <Icon icon={icon} className="w-4 h-4 text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="!text-[32px] !leading-[40px] text-white text-left">{header}</h3>
        <p className="!text-white text-left font-semibold !text-[16px] leading-[24px]">
          {subheader}
        </p>
        <p className="!text-white text-left !text-[14px] leading-[20px]">{description}</p>
      </div>
    </div>
  )
}
