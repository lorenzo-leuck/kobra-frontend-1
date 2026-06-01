import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Banner } from '../../types'
import { PetScene } from './PetScene'

const STATIC_BANNER = {
  id: 'adopt',
  title: 'Find Your New Best Friend',
  description: 'Every pet here is waiting for a loving home.',
  color: '#d4dcfc',
} as const

const AUTOPLAY_MS = 5000
const SLIDE_TRANSITION_S = 0.75

interface BannerCarouselProps {
  banners?: Banner[]
}

export function BannerCarousel({ banners = [] }: BannerCarouselProps) {
  const allBanners = [STATIC_BANNER, ...banners]
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + allBanners.length) % allBanners.length)
  }, [allBanners.length])

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % allBanners.length)
  }, [allBanners.length])

  useEffect(() => {
    if (paused) return

    const timer = window.setInterval(goNext, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [goNext, paused])

  const slide = allBanners[activeIndex]

  return (
    <section
      className="banner banner__slot"
      aria-roledescription="carousel"
      aria-label="Featured announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="banner__viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className={`banner__slide${slide.id === STATIC_BANNER.id ? ' banner__slide--hero' : ''}`}
            style={{ backgroundColor: slide.id === STATIC_BANNER.id ? 'transparent' : slide.color }}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: SLIDE_TRANSITION_S, ease: 'easeInOut' }}
          >
            {slide.id === STATIC_BANNER.id ? (
              <>
                <div className="banner__scene">
                  <PetScene />
                </div>
                <div className="banner__content">
                  <p className="banner__title">{slide.title}</p>
                  <p className="banner__description">{slide.description}</p>
                </div>
              </>
            ) : (
              <div className="banner__content">
                <p className="banner__title">{slide.title}</p>
                <p className="banner__description">{slide.description}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="banner__dots" role="tablist" aria-label="Choose slide">
          {allBanners.map((banner: Banner, index: number) => (
            <button
              key={banner.id}
              type="button"
              role="tab"
              className={`banner__dot${index === activeIndex ? ' banner__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === activeIndex}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
