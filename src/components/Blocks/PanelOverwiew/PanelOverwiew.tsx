'use client'
import { PanelOverwiewBlockPropsType } from '@/blocks/PanelOverwiewBlock/Component'
import StarIcon from '@/assets/icons/star.svg'
import Laptop from '@/assets/laptop.svg'
import AiIcon from '@/assets/icons/ai.svg'
import BlogIcon from '@/assets/icons/blog.svg'
import BuildingHomeIcon from '@/assets/icons/building-home.svg'
import Image from 'next/image'
import Link from 'next/link'
import { LinkButton } from '@/components/ui/LinkButton/LinkButton'

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
            <div key={i} className="flex bg-yellowStroke pl-0 pb-0 p-[1px] rounded-[32px]">
              <div className="flex flex-row gap-1 bg-[#512714] xl:py-1 xl:pl-[7px] xl:pr-[14px] p-1 rounded-[32px]">
                <Image src={tag.icon} alt={tag.text} className="w-6 h-6" />
                {/* <Icon icon={tag.icon} className='gradient-text text-gradientOrangeButton bg-clip-text text-transparent w-6 h-6'/> */}
                <span className="xl:flex hidden gradient-orange-text">{tag.text}</span>
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
          <LinkButton url={button.url} label={button.title} />
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
