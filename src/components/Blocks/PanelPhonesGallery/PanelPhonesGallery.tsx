'use client'
import { PanelPhonesGalleryBlockPropsType } from '@/blocks/PanelPhonesGalleryBlock/Component'
import RichText from '@/components/RichText'
import EmblaCarousel from './EmblaCarousel/EmblaCarousel'

export const PanelPhonesGallery: React.FC<PanelPhonesGalleryBlockPropsType> = (props) => {
  const { header, galleryArray } = props

  return (
    <div className="relative bg-[url(/background-gradient.webp)] xl:min-h-0 min-h-[1000px] py-[57px] xl:py-[127px] px-4 gap-[19px] xl:gap-[41px] flex flex-col justify-start items-center">
      <RichText
        data={header}
        className="richtext-h2-with-gradient !text-white mx-0 text-center max-w-full"
      />
      <div className="xl:w-[1208px] w-full h-full">
        <EmblaCarousel slides={galleryArray} />
      </div>
    </div>
  )
}
