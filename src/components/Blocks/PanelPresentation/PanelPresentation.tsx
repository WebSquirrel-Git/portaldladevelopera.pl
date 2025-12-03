'use client'
import { PanelPresentationBlockPropsType } from '@/blocks/PanelPresentationBlock/Component'
import RichText from '@/components/RichText'
import StarIcon from '@/assets/icons/star-list.svg'
import Image from 'next/image'
import { Media } from '@/components/Media'

export const PanelPresentation: React.FC<PanelPresentationBlockPropsType> = (props) => {
  const { header, slidesArray } = props

  return (
    <div className="bg-[url(/background-black-blur-circles.webp)] py-[96px] xl:pt-[160px] px-4 gap-[64px] xl:12 flex flex-col xl:pb-0 xl:px-[274px] justify-center items-center">
      <h2 className="xl:text-[64px] xl:leading-[78px] text-[48px] leading-[54px] text-white xl:text-center text-left">
        {header}
      </h2>
      <div className="flex flex-col w-full gap-[96px] xl:gap-[160px]">
        {slidesArray.map((slide, i) => (
          <div
            key={i}
            className={`flex flex-col-reverse h-fit gap-8 justify-between ${i % 2 === 0 ? 'xl:flex-row' : 'xl:flex-row-reverse'}`}
          >
            <div className="flex flex-col gap-8 max-w-[472px] justify-center">
              <div className="xl:flex hidden">
                <RichText
                  data={slide.slide.header}
                  className="richtext-h2-with-gradient !text-white "
                />
              </div>
              <div className="flex flex-col gap-4">
                {slide.slide.slideList.map((listItem, z) => (
                  <div
                    key={z}
                    className="flex flex-row gap-2 items-center justify-start max-h-[590px]"
                  >
                    <Image src={StarIcon} className="w-6 h-6" alt="Gwiazdka" />
                    <RichText
                      data={listItem.slideListDescription}
                      className="richtext-p-with-link"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Media
              resource={slide.slide.image}
              className="xl:max-h-[500px] max-w-[590px] w-fit"
              imgClassName="object-contain w-full h-full"
            />
            <div className="xl:hidden flex">
              <RichText
                data={slide.slide.header}
                className="richtext-h2-with-gradient !text-white mx-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
