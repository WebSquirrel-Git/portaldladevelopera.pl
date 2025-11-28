'use client'
import { PanelOverwiewBlockPropsType } from '@/blocks/PanelOverwiewBlock/Component'
import StarIcon from '@/assets/icons/star.svg'
import Laptop from '@/assets/laptop.svg'
import AiIcon from '@/assets/icons/ai.svg'
import BlogIcon from '@/assets/icons/blog.svg'
import BuildingHomeIcon from '@/assets/icons/building-home.svg'
import Image from 'next/image'
import Link from 'next/link'

const TAGS_LIST = [
  {
    icon: AiIcon,
    text: 'Integracja panelu z AI',
  },
  {
    icon: BlogIcon,
    text: 'Blog dla dewelopera',
  },
  {
    icon: BuildingHomeIcon,
    text: 'API GOV Integrator',
  },
]

export const PanelOverwiew: React.FC<PanelOverwiewBlockPropsType> = (props) => {
  const { description, button, testimonialsList } = props

  return (
    <div className="pt-10 px-4 gap-12 flex flex-col 2xl:pt-[100px] 2xl:px-[274px] justify-center items-center">
      <div className="flex flex-col gap-3 2xl:gap-6 justify-start items-center">
        <div className="flex flex-row gap-3 items-center w-fit">
          {TAGS_LIST.map((tag, i) => (
            <div key={i} className="flex bg-gradientOrangeButton p-[1px] rounded-[32px]">
              <div className="flex flex-row gap-2.5 bg-[#512714] xl:py-1 xl:pl-[7px] xl:pr-3 p-1 rounded-[32px]">
                <Image src={tag.icon} alt={tag.text} className="w-6 h-6" />
                {/* <Icon icon={tag.icon} className='gradient-text text-gradientOrangeButton bg-clip-text text-transparent w-6 h-6'/> */}
                <span className="xl:flex hidden bg-blend-screen gradient-text bg-gradientOrangeButton bg-clip-text text-transparent">
                  {tag.text}
                </span>
              </div>
            </div>
          ))}
        </div>
        <h1 className="text-center text-white">
          Twój Panel do legalnej
          <br />
          Sprzedaży{' '}
          <b className="gradient-text font-normal bg-gradientOrangeButton bg-white/40 bg-clip-text text-transparent">
            Lokali
          </b>
        </h1>
        <div className="flex flex-col gap-8 items-center justify-center pb-0 2xl:pb-10">
          <p className="text-white text-center">{description}</p>
          <Link
            className="text-black rounded-lg box-border bg-primaryOrange border-[1px] border-white font-medium text-[18px] py-[18px] px-6 cursor-pointer"
            href={button.url}
          >
            {button.title}
          </Link>
        </div>
      </div>
      <div className="flex xl:flex-row flex-col xl:gap-[90px] gap-[18px]">
        {testimonialsList.map((testimonial, i) => (
          <div
            key={i}
            className="flex flex-col w-full sm:w-[340px] gap-3 items-center justify-start"
          >
            <div className="flex flex-row gap-1">
              {Array.from({ length: testimonial.stars }).map((_, i) => (
                <Image key={i} src={StarIcon} alt="Gwiazdka" className="w-6 h-6" />
              ))}
            </div>
            <p className="text-center gradient-text bg-gradientGreyWhite bg-clip-text text-transparent">
              {testimonial.testimonial}
            </p>
          </div>
        ))}
      </div>
      <Image src={Laptop} alt="Panel dla Dewelopera" className="w-full h-auto" />
    </div>
  )
}
