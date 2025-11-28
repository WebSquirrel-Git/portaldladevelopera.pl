'use client'
import { PanelNeedBlockPropsType } from '@/blocks/PanelNeedBlock/Component'
import Image from 'next/image'
import OtwarteDaneImg from '@/assets/otwarte_dane_wersja_podstawowa_poziom_pl.png'
import MinisterstwoImg from '@/assets/Ministerstwo_Cyfryzacji_logo_2023.png'
import Link from 'next/link'

export const PanelNeed: React.FC<PanelNeedBlockPropsType> = (props) => {
  const { header, description, button } = props

  return (
    <div className="gradient-orange-black-radial blur-md pt-8 xl:pt-[100px] px-4 gap-8 xl:12 flex flex-col pb-[100px] 2xl:pt-[100px] 2xl:pb-[160px] 2xl:px-[274px] justify-center items-center">
      <div className="flex flex-col gap-8 items-center justify-center">
        <h2 className="text-center text-white !xl:text-16 !xl:leading-[78px] !text-10 !leading-12 max-w-[900px]">
          <b className="font-normal gradient-orange-text">{header.gradient}</b> {header.normal}
        </h2>
        <div className="flex flex-col gap-4 xl:gap-[20px] max-w-[700px] items-center justify-center">
          <p className="text-lightGrey text-center">{description.normal}</p>
          <p className="text-center text-lightGrey font-semibold">{description.bold}</p>
          <div className="flex flex-row gap-3 xl:gap-[20px] items-center justify-center max-w-[400px]">
            <Image
              src={OtwarteDaneImg}
              alt="Otwarte Dane"
              className="h-[44px] sm:h-[72px] w-auto object-contain"
            />
            <Image
              src={MinisterstwoImg}
              alt="Miinisterstwo Cyfryzacji"
              className="h-[44px] sm:h-[72px] w-auto object-contain"
            />
          </div>
        </div>
      </div>
      <Link
        className="text-black rounded-lg box-border bg-primaryOrange border-[1px] border-white font-medium text-[18px] py-[18px] px-6 cursor-pointer"
        href={button.url}
      >
        {button.title}
      </Link>
    </div>
  )
}
