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
        className="xl:top-[10%] xl:right-0 xl:left-[-20px] border-r border-b border-l-0 border-t-0"
      />
      <DescriptionCard
        {...slides[1].description}
        active={selectedIndex === 1}
        className="xl:bottom-[10%] xl:right-0 xl:left-0 border-r border-b border-l-0 border-t-0"
      />
      <DescriptionCard
        {...slides[2].description}
        active={selectedIndex === 2}
        className="xl:top-[0%] xl:left-auto xl:right-0 border-r border-b border-l-0 border-t-0"
      />
      <DescriptionCard
        {...slides[3].description}
        active={selectedIndex === 3}
        className="xl:bottom-[25%] xl:left-auto xl:right-[-28px] border-r border-b border-l-0 border-t-0"
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
            <div key={i} className="flex items-center justify-center w-full h-full">
              <Media
                resource={index.image}
                imgClassName="xl:w-auto xl:max-h-none max-h-[400px] w-[444px] sm:w-[100vw] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
