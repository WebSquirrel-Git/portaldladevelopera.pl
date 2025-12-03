import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './embla.module.scss'
import { PanelPhonesGalleryBlockPropsType } from '@/blocks/PanelPhonesGalleryBlock/Component'
import { Media } from '@/components/Media'
import { DescriptionCard } from './DescriptionCard'
type PropType = {
  slides: PanelPhonesGalleryBlockPropsType['galleryArray']
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, onNavButtonClick)

  return (
    <section className={styles.embla}>
      <DescriptionCard
        {...slides[0].description}
        active={selectedIndex === 0}
        className="xl:top-[104px] xl:right-0 xl:left-0 border-r border-b border-l-0 border-t-0 xl:w-[320px]"
      />
      <DescriptionCard
        {...slides[1].description}
        active={selectedIndex === 1}
        className="xl:top-[433px] xl:right-0 xl:left-0 border-r border-b border-l-0 border-t-0 xl:w-[326px]"
      />
      <DescriptionCard
        {...slides[2].description}
        active={selectedIndex === 2}
        className="xl:top-[41px] xl:left-auto xl:right-0 border-r border-b border-l-0 border-t-0 xl:w-[338px]"
      />
      <DescriptionCard
        {...slides[3].description}
        active={selectedIndex === 3}
        className="xl:top-[339px] xl:left-auto xl:right-0 border-r border-b border-l-0 border-t-0 xl:w-[310px]"
      />
      <div className={styles.emblaControls}>
        <div className={styles.emblaDots}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={index === selectedIndex ? styles.emblaDotSelected : styles.emblaDot}
            />
          ))}
        </div>
      </div>

      <div className={styles.emblaViewport} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {slides.map((index, i) => (
            <div
              key={i}
              className={`${styles.emblaSlide} xl:max-h-[630px] flex items-center justify-center w-full h-full`}
            >
              <Media
                resource={index.image}
                className="flex justify-center xl:max-h-[630px] max-h-[351px] h-full w-full"
                imgClassName=" xl:max-h-none xl:max-h-[630px] xl:h-[630px] xl:w-[503px] w-[280px] h-[351px] max-h-[351px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
