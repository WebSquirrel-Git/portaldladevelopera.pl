import React, { useCallback, useEffect, useRef } from 'react'
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

  const autoplayRef = useRef<any | null>(null)
  const restartTimeoutRef = useRef<number | null>(null)

  const handleInteraction = useCallback(() => {
    const autoplay = autoplayRef.current
    if (!autoplay) return

    if (typeof autoplay.stop === 'function') {
      autoplay.stop()
    } else if (typeof autoplay.reset === 'function') {
      autoplay.reset()
    }

    if (restartTimeoutRef.current) {
      window.clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }

    restartTimeoutRef.current = window.setTimeout(() => {
      if (typeof autoplay.play === 'function') {
        autoplay.play()
      } else if (typeof autoplay.reset === 'function') {
        try { autoplay.reset() } catch { /* noop */ }
      }
      restartTimeoutRef.current = null
    }, 3000)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const plugins = (emblaApi as any).plugins ? (emblaApi as any).plugins() : undefined
    const autoplay = plugins?.autoplay ?? plugins ?? undefined
    let resolvedAutoplay = autoplay
    if (!resolvedAutoplay && Array.isArray(plugins)) {
      resolvedAutoplay = plugins.find((p: any) => p && (p.play || p.stop || p.reset))
    }
    autoplayRef.current = resolvedAutoplay ?? null

    const onPointerDown = () => {
      handleInteraction()
    }
    emblaApi.on('pointerDown', onPointerDown)

    return () => {
      emblaApi.off('pointerDown', onPointerDown)
      if (restartTimeoutRef.current) {
        window.clearTimeout(restartTimeoutRef.current)
        restartTimeoutRef.current = null
      }
      autoplayRef.current = null
    }
  }, [emblaApi, handleInteraction])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, () => {
    handleInteraction()
  })

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
              onClick={() => {
                onDotButtonClick(index)
                handleInteraction()
              }}
              className={index === selectedIndex ? styles.emblaDotSelected : styles.emblaDot}
            />
          ))}
        </div>
      </div>

      <div className={styles.emblaViewport} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`${styles.emblaSlide} xl:max-h-[630px] flex items-center justify-center w-full h-full`}
            >
              <div onClick={handleInteraction} style={{ width: '100%', height: '100%' }}>
                <Media
                  resource={slide.image}
                  className="flex justify-center xl:max-h-[630px] max-h-[351px] h-full w-full"
                  imgClassName=" xl:max-h-none xl:max-h-[630px] xl:h-[630px] xl:w-[503px] w-[280px] h-[351px] max-h-[351px] object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
