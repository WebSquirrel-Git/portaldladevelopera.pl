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
      className={`top-[670px] sm:top-[530px] left-0 right-0 w-[90%] mx-auto xl:mx-0 h-fit transition-all duration-800 ${className} isolate z-9999 absolute ${active ? 'flex' : 'hidden'} xl:flex flex-col ${active ? 'bg-white/10' : 'bg-white/0'} sm:max-w-[380px] border-secondaryOrange border-solid rounded-[20px] p-[18px]`}
    >
      <div className="gradient-orange w-8 h-8 gap-3 flex items-center justify-center rounded-full">
        <Icon icon={icon} className="w-4 h-4 text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="!text-[32px] !leading-[40px] text-white text-left">{header}</h2>
        <p className="!text-white text-left font-semibold">{subheader}</p>
        <p className="!text-white text-left !text-[14px]">{description}</p>
      </div>
    </div>
  )
}
